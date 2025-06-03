import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  Auth,
  Unsubscribe,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithCredential as firebaseSignInWithCredential
} from 'firebase/auth';
import { auth as firebaseAuth, handleAndroidAuth, reconnectFirestore, signInWithGoogle, debugGoogleAuth } from './firebase';
import { isYouTubeAuthenticated, clearYouTubeAuth, getYouTubeUserProfile } from './youtubeAuth';
import { isSpotifyAuthenticated, logoutFromSpotify, getSpotifyUserProfile } from './spotifyAuth';
import { isSoundCloudAuthenticated } from './soundcloudAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db as firebaseDb } from './firebase';
import '../styles/color-system.css'; // Import the new color system

// Type assertion for the auth object
const auth = firebaseAuth as Auth;

// Type assertion for Firestore db
const db = firebaseDb as import('firebase/firestore').Firestore;

// Define types for user profiles
interface SpotifyUserProfile {
  displayName: string;
  imageUrl?: string;
  id: string;
  externalUrls?: string;
}

interface YouTubeUserProfile {
  displayName: string;
  imageUrl?: string;
  id: string;
  customUrl?: string;
  subscriberCount?: string;
}

interface AuthContextType {
  user: User | null;
  userData: any | null;
  error: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  hasSpotifyAuth: boolean;
  hasYouTubeAuth: boolean;
  hasSoundCloudAuth: boolean;
  spotifyUserProfile: SpotifyUserProfile | null;
  youtubeUserProfile: YouTubeUserProfile | null;
  fetchSpotifyProfile: () => Promise<void>;
  fetchYouTubeProfile: () => Promise<void>;
  signIn: (isAndroid?: boolean) => Promise<User | null>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string, name?: string, rememberMe?: boolean, phoneNumber?: string, company?: string) => Promise<void>;
  signInWithCredential: (credential: string) => Promise<User | null>;
  setHasSpotifyAuth: (value: boolean) => void;
  setHasYouTubeAuth: (value: boolean) => void;
  setHasSoundCloudAuth: (value: boolean) => void;
  clearError: () => void;
  checkYouTubeAuth: () => Promise<boolean>;
  debugAuth: () => Promise<any>;
  disconnectFromSpotify: () => void;
  disconnectFromYouTube: () => void;
  isConnectingSpotify: boolean;
  isConnectingYouTube: boolean;
  spotifyError: string | null;
  youtubeError: string | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  hasSpotifyAuth: false,
  hasYouTubeAuth: false,
  hasSoundCloudAuth: false,
  spotifyUserProfile: null,
  youtubeUserProfile: null,
  fetchSpotifyProfile: async () => {},
  fetchYouTubeProfile: async () => {},
  signIn: async () => null,
  signOut: async () => {},
  signInWithEmail: async () => {},
  signInWithCredential: async () => null,
  setHasSpotifyAuth: () => {},
  setHasYouTubeAuth: () => {},
  setHasSoundCloudAuth: () => {},
  clearError: () => {},
  checkYouTubeAuth: async () => false,
  debugAuth: async () => {},
  disconnectFromSpotify: () => {},
  disconnectFromYouTube: () => {},
  isConnectingSpotify: false,
  isConnectingYouTube: false,
  spotifyError: null,
  youtubeError: null,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Helper function to check if error is a Firestore permissions error
// const isFirestorePermissionError = (error: any): boolean => {
//   return (error?.code === 'permission-denied' || 
//           error?.message?.includes('Missing or insufficient permissions'));
// };

// Add mobile device detection function
const isAndroidDevice = () => {
  return /Android/i.test(navigator.userAgent);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [hasSpotifyAuth, setHasSpotifyAuthInternal] = useState<boolean>(false);
  const [hasYouTubeAuth, setHasYouTubeAuthInternal] = useState<boolean>(false);
  const [hasSoundCloudAuth, setHasSoundCloudAuth] = useState<boolean>(false);

  const [spotifyUserProfile, setSpotifyUserProfile] = useState<SpotifyUserProfile | null>(null);
  const [youtubeUserProfile, setYouTubeUserProfile] = useState<YouTubeUserProfile | null>(null);
  
  const [isConnectingSpotify] = useState<boolean>(false);
  const [isConnectingYouTube] = useState<boolean>(false);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  const fetchSpotifyProfile = useCallback(async () => {
    if (hasSpotifyAuth) {
      try {
        console.log("Fetching Spotify user profile...");
        const profile = await getSpotifyUserProfile();
        if (profile) {
          setSpotifyUserProfile(profile);
          console.log("Spotify profile fetched:", profile);
        } else {
          console.log("No Spotify profile data returned or error fetching.");
          setSpotifyUserProfile(null);
        }
      } catch (e) {
        console.error("Error in fetchSpotifyProfile:", e);
        setSpotifyUserProfile(null);
      }
    } else {
      setSpotifyUserProfile(null);
    }
  }, [hasSpotifyAuth]);

  const fetchYouTubeProfile = useCallback(async () => {
    if (hasYouTubeAuth) {
      try {
        console.log("Fetching YouTube user profile...");
        const profile = await getYouTubeUserProfile();
        if (profile) {
          setYouTubeUserProfile(profile);
          console.log("YouTube profile fetched:", profile);
        } else {
          console.log("No YouTube profile data returned or error fetching.");
          setYouTubeUserProfile(null);
        }
      } catch (e) {
        console.error("Error in fetchYouTubeProfile:", e);
        setYouTubeUserProfile(null);
      }
    } else {
      setYouTubeUserProfile(null);
    }
  }, [hasYouTubeAuth]);

  const setHasSpotifyAuth = (value: boolean) => {
    setHasSpotifyAuthInternal(value);
    if (value) {
      fetchSpotifyProfile();
    } else {
      setSpotifyUserProfile(null);
    }
  };

  const setHasYouTubeAuth = (value: boolean) => {
    setHasYouTubeAuthInternal(value);
    if (value) {
      fetchYouTubeProfile();
    } else {
      setYouTubeUserProfile(null);
    }
  };
  
  const checkYouTubeAuth = async () => {
    try {
      console.log("Manual YouTube auth check initiated");
      const youtubeAuthStatus = await isYouTubeAuthenticated();
      console.log("YouTube auth check result:", youtubeAuthStatus);
      setHasYouTubeAuth(youtubeAuthStatus);
      return youtubeAuthStatus;
    } catch (error) {
      console.error("Error checking YouTube auth:", error);
      setHasYouTubeAuth(false);
      return false;
    }
  };
  
  useEffect(() => {
    const checkServiceAuth = async () => {
      if (user) {
        try {
          const spotifyAuthStatus = isSpotifyAuthenticated();
          setHasSpotifyAuth(spotifyAuthStatus);

          console.log("Checking YouTube auth on auth context initialization");
          const youtubeAuthStatus = await isYouTubeAuthenticated();
          console.log("YouTube auth check result:", youtubeAuthStatus);
          setHasYouTubeAuth(youtubeAuthStatus);
          
          const soundCloudAuthStatus = isSoundCloudAuthenticated();
          setHasSoundCloudAuth(soundCloudAuthStatus);
        } catch (error) {
          console.error('Error checking service auth:', error);
        }
      } else {
        setHasSpotifyAuth(false);
        setHasYouTubeAuth(false);
        setHasSoundCloudAuth(false);
      }
    };
    
    checkServiceAuth();
  }, [user, fetchSpotifyProfile, fetchYouTubeProfile]);
  
  useEffect(() => {
    const handleRedirectResult = async () => {
      if (!auth) {
        console.log("❌ Auth is not initialized when checking redirect");
        setLoading(false);
        return;
      }

      // Start by checking for auth_redirect_start in localStorage, which indicates
      // we're coming back from a redirect flow
      const redirectStart = localStorage.getItem('auth_redirect_start');
      if (!redirectStart) {
        console.log("ℹ️ No auth_redirect_start found, skipping redirect check");
        setLoading(false);
        return;
      }
      
      console.log("🔄 Found auth_redirect_start:", redirectStart, "- timestamp:", new Date(parseInt(redirectStart)).toLocaleString());
      document.body.classList.add('auth-redirecting'); // Optional: add a class for styling during redirect processing
      
      // Set up a timeout with exponential backoff
      const maxTimeout = 45000; // 45 seconds, increased from 30 seconds
      const redirectTimeout = setTimeout(() => {
        console.log("⌛ Redirect result check timed out after", maxTimeout/1000, "seconds");
        localStorage.removeItem('auth_redirect_start');
        document.body.classList.remove('auth-redirecting');
        setLoading(false);
        setError("Authentication process took too long. Please try again.");
      }, maxTimeout);
      
      try {
        console.log("🔍 Starting redirect result check process...");
        
        // Before proceeding, capture return path to ensure it's not lost
        const returnPath = localStorage.getItem('auth_return_path');
        console.log("🔍 Current auth_return_path:", returnPath || "Not set");
        
        // Wait briefly for auth state to stabilize
        await new Promise(resolve => {
          const stateCheck = auth.onAuthStateChanged(() => {
            stateCheck(); // Unsubscribe immediately
            resolve(true);
          });
          
          // Or resolve after 2 seconds if no auth change
          setTimeout(resolve, 2000);
        });
        
        console.log("🔄 Initial auth state checked, proceeding with redirect result processing");
        
        // For very slow connections, ensure Firestore is connected
        try {
          await reconnectFirestore();
          console.log("✅ Ensured Firestore connection before checking redirect result");
        } catch (e) {
          console.warn("⚠️ Failed to reconnect Firestore:", e);
          // Continue anyway, this is just a precaution
        }
        
        // First, check if user is already signed in
        const currentUser = auth.currentUser;
        console.log("🔍 Current user check:", currentUser ? `User: ${currentUser.email}` : "No current user");
        
        if (currentUser) {
          console.log("✅ User is already signed in:", currentUser.email);
          setUser(currentUser);
          localStorage.removeItem('auth_redirect_start');
          clearTimeout(redirectTimeout);
          document.body.classList.remove('auth-redirecting');
          setLoading(false);
          
          // Check service connections for signed-in user
          try {
            const spotifyAuthStatus = isSpotifyAuthenticated();
            setHasSpotifyAuth(spotifyAuthStatus);

            const youtubeAuthStatus = await isYouTubeAuthenticated();
            setHasYouTubeAuth(youtubeAuthStatus);
            
            setHasSoundCloudAuth(isSoundCloudAuthenticated());
          } catch (serviceError) {
            console.warn("⚠️ Error checking service connections:", serviceError);
          }
          
          navigateAfterAuth();
          return;
        }
        
        console.log("🔄 Now calling getRedirectResult to check for redirect auth...");
        
        let result = null;
        let redirectError = null;
        
        try {
          // Main redirect result check with timeout
          result = await Promise.race([
            getRedirectResult(auth),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error("Initial redirect result check timed out")), 20000)
            )
          ]);
        } catch (error) {
          redirectError = error;
          console.error("❌ Error getting redirect result:", error);
          console.error("❌ Error details:", error instanceof Error ? {
            name: error.name,
            message: error.message,
            code: (error as any).code || 'unknown'
          } : 'Non-Error type');
        }
        
        if (result && result.user) {
          console.log(`✅ Successfully signed in via redirect: ${result.user.email}`);
          setUser(result.user);
          
          localStorage.removeItem('auth_redirect_start');
          clearTimeout(redirectTimeout);
          document.body.classList.remove('auth-redirecting');
          setLoading(false);
          
          // Check service auth after successful redirect
          const spotifyAuthStatus = isSpotifyAuthenticated();
          setHasSpotifyAuth(spotifyAuthStatus);

          const youtubeAuthStatus = await isYouTubeAuthenticated();
          setHasYouTubeAuth(youtubeAuthStatus);
          
          setHasSoundCloudAuth(isSoundCloudAuthenticated());

          navigateAfterAuth();
          return;
        }
        
        // If first attempt fails or returns null, implement retry with exponential backoff
        if (!result || redirectError) {
          console.log("⚠️ Initial redirect result check failed or returned null. Implementing retries...");
          
          const maxRetries = 3;
          let retryCount = 0;
          let retrySuccess = false;
          
          while (retryCount < maxRetries && !retrySuccess) {
            retryCount++;
            const backoffDelay = Math.min(2000 * Math.pow(1.5, retryCount - 1), 10000);
            
            console.log(`🔄 Retry ${retryCount}/${maxRetries} after ${backoffDelay/1000}s delay...`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            
            // Check if user has appeared during the delay
            const currentUserCheck = auth.currentUser;
            if (currentUserCheck) {
              console.log(`✅ User appeared during retry delay: ${currentUserCheck && 'email' in currentUserCheck ? (currentUserCheck as User).email : 'unknown'}`);
              setUser(currentUserCheck);
              retrySuccess = true;
              break;
            }
            
            try {
              console.log(`🔄 Calling getRedirectResult() for retry ${retryCount}...`);
              result = await Promise.race([
                getRedirectResult(auth),
                new Promise<never>((_, reject) => 
                  setTimeout(() => reject(new Error(`Retry ${retryCount} timed out`)), 15000)
                )
              ]);
              
              if (result && result.user) {
                console.log(`✅ Successfully signed in on retry ${retryCount}: ${result.user.email}`);
                setUser(result.user);
                retrySuccess = true;
                break;
              } else {
                console.log(`⚠️ Retry ${retryCount} returned null or no user`);
              }
            } catch (retryError) {
              console.warn(`⚠️ Retry ${retryCount} failed:`, retryError);
            }
          }
          
          if (retrySuccess) {
            localStorage.removeItem('auth_redirect_start');
            clearTimeout(redirectTimeout);
            document.body.classList.remove('auth-redirecting');
            setLoading(false);
            
            // Check service auth after successful retry
            try {
              const spotifyAuthStatus = isSpotifyAuthenticated();
              setHasSpotifyAuth(spotifyAuthStatus);
  
              const youtubeAuthStatus = await isYouTubeAuthenticated();
              setHasYouTubeAuth(youtubeAuthStatus);
              
              setHasSoundCloudAuth(isSoundCloudAuthenticated());
            } catch (serviceError) {
              console.warn("⚠️ Error checking service connections after retry:", serviceError);
            }
            
            navigateAfterAuth();
            return;
          }
        }
        
        // If we got here, all redirect check attempts failed
        console.warn("❌ All redirect result checks failed, checking for specific errors");
        
        // If redirectError exists, try to give a more helpful error message
        if (redirectError) {
          if (redirectError instanceof Error) {
            if (redirectError.message.includes("timeout")) {
              setError("Authentication process took too long. Please check your connection and try again.");
            } else if (redirectError.message.includes("redirect_uri_mismatch") || 
                     (redirectError as any).code === 'auth/invalid-credential') {
              console.error("❌ CRITICAL: OAuth redirect URI mismatch or invalid credential detected!");
              setError("Authentication configuration error. Please try again or contact support.");
            } else if (redirectError.message.includes("network") || 
                     (redirectError as any).code === 'auth/network-request-failed') {
              setError("Network error during authentication. Please check your connection and try again.");
            } else if ((redirectError as any).code === 'auth/user-disabled') {
              setError("This account has been disabled. Please contact support.");
            } else if ((redirectError as any).code === 'auth/popup-closed-by-user') {
              setError("Authentication was cancelled. Please try again.");
            } else {
              setError(`Authentication error: ${redirectError.message.split('.')[0]}`);
            }
          } else {
            setError("Authentication failed with an unknown error. Please try again.");
          }
        } else {
          // No specific error, but authentication still failed
          setError("Authentication process completed but no user was signed in. Please try again.");
        }
        
        // Final fallback - check if user is already signed in despite all failures
        const finalUserCheck = auth.currentUser;
        if (finalUserCheck) {
          console.log("✅ Found current user in final check:", finalUserCheck && 'email' in finalUserCheck ? (finalUserCheck as User).email : 'unknown');
          setUser(finalUserCheck);
          navigateAfterAuth();
          return;
        }
      } catch (error: any) {
        console.error("❌ Uncaught error in handleRedirectResult:", error);
        setError("An unexpected error occurred during authentication. Please try again.");
      } finally {
        // Ensure we clean up
        localStorage.removeItem('auth_redirect_start');
        clearTimeout(redirectTimeout);
        document.body.classList.remove('auth-redirecting');
        setLoading(false);
      }
    };
    
    handleRedirectResult();
  }, []);
  
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        return userDoc.data();
      } else {
        setUserData(null);
        return null;
      }
    } catch (e) {
      setUserData(null);
      return null;
    }
  };
  
  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe: Unsubscribe = onAuthStateChanged(auth, async (authUser: User | null) => {
      console.log('🔥 onAuthStateChanged fired:', authUser ? `User ${authUser.email} (${authUser.uid})` : 'No user');
      setUser(authUser);
      if (authUser) {
        await fetchUserData(authUser.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('🔥 onAuthStateChanged error:', error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const signIn = async (isAndroid: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Starting Google sign-in process...");
      
      try {
        await signInWithGoogle(true);
        console.log("Redirect initiated - page will reload after authentication");
        return null;
      } catch (redirectError) {
        console.error("Redirect authentication failed, trying popup as fallback:", redirectError);
        
        if (!isAndroid) {
          try {
            const user = await signInWithGoogle(false);
            if (user) {
              setUser(user);
              
              try {
                setHasSpotifyAuth(isSpotifyAuthenticated());
                const youtubeAuth = await isYouTubeAuthenticated();
                setHasYouTubeAuth(youtubeAuth);
                setHasSoundCloudAuth(isSoundCloudAuthenticated());
              } catch (serviceError) {
                console.warn("Error checking service auth after popup:", serviceError);
              }
              
              return user;
            }
          } catch (popupError) {
            console.error("Popup authentication also failed:", popupError);
            throw popupError;
          }
        } else {
          throw redirectError;
        }
      }
      
      return null;
    } catch (error: any) {
      console.error("Fatal error during Google sign-in:", error);
      setError(error?.message || "Authentication failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithEmail = async (email: string, password: string, name?: string, rememberMe?: boolean, phoneNumber?: string, company?: string) => {
    setLoading(true);
    setError(null);
    
    const isAndroid = isAndroidDevice();
    
    let androidRecoveryTimeout: ReturnType<typeof setTimeout> | null = null;
    
    if (isAndroid) {
      androidRecoveryTimeout = setTimeout(() => {
        console.warn('Global Android auth recovery timeout triggered');
        setLoading(false);
        setError('Authentication process appears to be stuck. Please restart the app and try again.');
      }, 60000);
    }
    
    try {
      if (isAndroid) {
        try {
          await reconnectFirestore();
          console.log('Reconnected Firestore before authentication on Android');
        } catch (reconnectError) {
          console.warn('Failed to reconnect Firestore before auth:', reconnectError);
        }
      }
      
      const persistenceMode = isAndroid && !rememberMe 
        ? browserSessionPersistence
        : rememberMe 
          ? browserLocalPersistence
          : browserSessionPersistence;
      
      try {
        await setPersistence(auth, persistenceMode);
      } catch (persistenceError) {
        console.warn('Failed to set auth persistence:', persistenceError);
      }
      
      if (name) {
        try {
          let userCredential: UserCredential;
          
          if (isAndroid) {
            console.log('Using Android-specific auth handler for registration');
            const authPromise = createUserWithEmailAndPassword(auth, email, password);
            userCredential = await handleAndroidAuth(authPromise, 40000);
          } else {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
          }
          
          try {
            if (isAndroid) {
              const profileUpdatePromise = updateProfile(userCredential.user, { 
                displayName: name,
                ...(phoneNumber && { phoneNumber })
              });
              
              await handleAndroidAuth(profileUpdatePromise, 20000);
            } else {
              await updateProfile(userCredential.user, { 
                displayName: name,
                ...(phoneNumber && { phoneNumber })
              });
            }
          } catch (profileError) {
            console.error('Error updating user profile:', profileError);
          }
          
          setUser(userCredential.user);
          const userDataObj = {
            uid: userCredential.user.uid,
            email,
            name,
            company: company || null,
            phone: phoneNumber || null,
            role: 'client',
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', userCredential.user.uid), userDataObj);
          setUserData(userDataObj);
        } catch (regError: any) {
          const errorMessage = getFirebaseAuthErrorMessage(regError);
          setError(errorMessage);
          throw regError;
        }
      } else {
        try {
          let userCredential: UserCredential;
          
          if (isAndroid) {
            console.log('Using Android-specific auth handler for login');
            const authPromise = signInWithEmailAndPassword(auth, email, password);
            
            const loginWithTimeout = Promise.race([
              handleAndroidAuth(authPromise, 30000),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Android login timeout')), 25000)
              )
            ]);
            
            userCredential = await loginWithTimeout;
          } else {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
          }
          
          setUser(userCredential.user);
          await fetchUserData(userCredential.user.uid);
        } catch (loginError: any) {
          const errorMessage = getFirebaseAuthErrorMessage(loginError);
          setError(errorMessage);
          throw loginError;
        }
      }
      
      try {
        setHasSpotifyAuth(isSpotifyAuthenticated());
      } catch (spotifyError) {
        console.warn('Error checking Spotify auth:', spotifyError);
      }
      
      try {
        const youtubeAuth = await isYouTubeAuthenticated();
        setHasYouTubeAuth(youtubeAuth);
      } catch (youtubeError) {
        console.warn('Error checking YouTube auth:', youtubeError);
      }
      
      try {
        setHasSoundCloudAuth(isSoundCloudAuthenticated());
      } catch (soundcloudError) {
        console.warn('Error checking SoundCloud auth:', soundcloudError);
      }
      
    } catch (error) {
      console.error('Email auth error:', error);
      throw error;
    } finally {
      if (androidRecoveryTimeout) {
        clearTimeout(androidRecoveryTimeout);
      }
      
      setLoading(false);
      
      if (isAndroid) {
        setTimeout(() => {
          setLoading(loading => loading);
        }, 0);
      }
    }
  };
  
  const signInWithCredential = async (credential: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const googleCredential = GoogleAuthProvider.credential(credential);
      
      const userCredential: UserCredential = await firebaseSignInWithCredential(auth, googleCredential);
      setUser(userCredential.user);
      
      const userData = await fetchUserData(userCredential.user.uid);
      if (!userData) {
        const newUserData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: userCredential.user.displayName || '',
          role: 'client',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
        setUserData(newUserData);
      }
      
      return userCredential.user;
    } catch (error: any) {
      console.error("Error during credential sign-in:", error);
      setError(error?.message || "Authentication with credential failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const getFirebaseAuthErrorMessage = (error: any): string => {
    const errorCode = error?.code || '';
    const errorMessage = error?.message || 'Authentication failed';
    
    const errorMessages: {[key: string]: string} = {
      'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/user-not-found': 'No account found with this email. Please check your email or sign up.',
      'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/network-request-failed': 'Network connection error. Please check your internet and try again.',
      'auth/timeout': 'Request timeout. Please try again.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
      'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for this site.',
      'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later or reset your password.'
    };
    
    if (isAndroidDevice()) {
      if (errorCode === 'auth/network-request-failed') {
        return 'Network connection issue on Android. Try switching to WiFi or check your signal strength.';
      }
      
      if (errorCode === 'auth/timeout') {
        return 'Authentication timeout on Android. Please check your connection and try again.';
      }
    }
    
    return errorMessages[errorCode] || errorMessage;
  };
  
  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUserData(null);
      setHasSpotifyAuth(false);
      setHasYouTubeAuth(false);
      setHasSoundCloudAuth(false);
    } catch (error) {
      console.error("Error signing out: ", error);
      throw error;
    }
  };
  
  const clearError = () => {
    setError(null);
  };
  
  const debugAuth = async () => {
    try {
      setLoading(true);
      const result = await debugGoogleAuth();
      console.log("Auth debug result:", result);
      return result;
    } catch (error: any) {
      console.error("Error in debug function:", error);
      setError(error?.message || "Error debugging auth");
      return { error: error?.message };
    } finally {
      setLoading(false);
    }
  };
  
  const disconnectFromSpotify = () => {
    logoutFromSpotify();
    setHasSpotifyAuth(false);
    console.log("Disconnected from Spotify");
  };
  
  const disconnectFromYouTube = () => {
    clearYouTubeAuth();
    setHasYouTubeAuth(false);
    console.log("Disconnected from YouTube");
  };
  
  const navigateAfterAuth = () => {
    const returnPath = localStorage.getItem('auth_return_path');
    console.log("🔄 navigateAfterAuth called - checking for return path");
    
    // Consider adding a short delay to ensure all auth state is properly updated
    setTimeout(() => {
      // Clean up auth markers regardless of whether we find a return path
      localStorage.removeItem('auth_redirect_start');
      
      if (returnPath) {
        console.log("🔄 Found return path after auth:", returnPath);
        localStorage.removeItem('auth_return_path');
        
        try {
          // First check if this is a valid internal path (starting with /)
          const isInternalPath = returnPath.startsWith('/');
          const hasExternalProtocol = /^https?:\/\//i.test(returnPath);
          
          // Ensure we're navigating to a safe destination
          const safeDomain = window.location.hostname;
          const isSafeDomain = hasExternalProtocol ? returnPath.includes(safeDomain) : true;
          
          if (!isSafeDomain) {
            console.warn("⚠️ Attempted to navigate to an external domain. Using fallback path instead.");
            window.location.href = '/dashboard'; // Fallback to dashboard if unsafe external URL
            return;
          }
          
          // Create the full URL if needed
          const fullUrl = isInternalPath && !hasExternalProtocol 
            ? `${window.location.origin}${returnPath}` 
            : returnPath;
          
          console.log("➡️ Navigating to:", fullUrl);
          
          window.location.href = fullUrl;
        } catch (error) {
          console.error("❌ Error during navigation:", error);
          // Fallback to root path if navigation fails
          window.location.href = '/';
        }
      } else {
        console.log("⚠️ No return path found after auth, navigating to default page");
        
        // Fallback to dashboard if no return path was set
        const defaultRedirectPath = '/dashboard'; 
        console.log("➡️ Using default redirect path:", defaultRedirectPath);
        window.location.href = defaultRedirectPath;
      }
    }, 300); // Short delay to ensure auth state is fully processed
  };
  
  const value = {
    user,
    userData,
    loading,
    error,
    isAuthenticated: !!user,
    hasSpotifyAuth,
    hasYouTubeAuth,
    hasSoundCloudAuth,
    spotifyUserProfile,
    youtubeUserProfile,
    fetchSpotifyProfile,
    fetchYouTubeProfile,
    signIn,
    signOut,
    signInWithEmail,
    signInWithCredential,
    setHasSpotifyAuth,
    setHasYouTubeAuth,
    setHasSoundCloudAuth,
    clearError,
    checkYouTubeAuth,
    debugAuth,
    disconnectFromSpotify,
    disconnectFromYouTube,
    isConnectingSpotify,
    isConnectingYouTube,
    spotifyError,
    youtubeError,
    setUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 