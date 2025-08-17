import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isProvider: boolean;
  phoneNumber?: string;
  location?: string;
  rating?: number;
  completedTasks?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isProvider: boolean;
  error: string | null;
  
  // Authentication functions
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string, isProvider: boolean) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  
  // Clear error
  clearError: () => void;
  
  // Platform authentication properties
  hasSpotifyAuth: boolean;
  hasYouTubeAuth: boolean;
  setHasSpotifyAuth: (hasAuth: boolean) => void;
  setHasYouTubeAuth: (hasAuth: boolean) => void;
  disconnectFromSpotify: () => Promise<void>;
  disconnectFromYouTube: () => Promise<void>;
  isConnectingSpotify: boolean;
  isConnectingYouTube: boolean;
  spotifyError: string | null;
  youtubeError: string | null;
  spotifyUserProfile: any | null;
  youtubeUserProfile: any | null;
  
  // Platform profile fetching
  fetchSpotifyProfile: () => Promise<void>;
  fetchYouTubeProfile: () => Promise<void>;
  checkYouTubeAuth: () => Promise<boolean>;
  
  // Generic sign in method
  signIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Platform authentication state
  const [hasSpotifyAuth, setHasSpotifyAuth] = useState(false);
  const [hasYouTubeAuth, setHasYouTubeAuth] = useState(false);
  const [isConnectingSpotify, setIsConnectingSpotify] = useState(false);
  const [isConnectingYouTube, setIsConnectingYouTube] = useState(false);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [spotifyUserProfile, setSpotifyUserProfile] = useState<any | null>(null);
  const [youtubeUserProfile, setYoutubeUserProfile] = useState<any | null>(null);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          isProvider: data.isProvider || false,
          phoneNumber: data.phoneNumber,
          location: data.location,
          rating: data.rating,
          completedTasks: data.completedTasks || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  // Create or update user profile
  const createUserProfile = async (user: FirebaseUser, isProvider: boolean = false): Promise<UserProfile> => {
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || undefined,
      isProvider,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), profile);
      return profile;
    } catch (err) {
      console.error('Error creating user profile:', err);
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedProfile = {
        ...userProfile,
        ...updates,
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
      setUserProfile(updatedProfile as UserProfile);
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      
      // Fetch user profile
      const profile = await fetchUserProfile(result.user.uid);
      setUserProfile(profile);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string, displayName: string, isProvider: boolean): Promise<void> => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, { displayName });
      
      // Create user profile
      const profile = await createUserProfile(result.user, isProvider);
      
      setUser(result.user);
      setUserProfile(profile);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      
      // Check if user profile exists, create if not
      let profile = await fetchUserProfile(result.user.uid);
      if (!profile) {
        profile = await createUserProfile(result.user, false);
      }
      setUserProfile(profile);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  // Clear error
  const clearError = () => setError(null);
  
  // Platform authentication functions
  const disconnectFromSpotify = async (): Promise<void> => {
    try {
      setHasSpotifyAuth(false);
      setSpotifyUserProfile(null);
      setSpotifyError(null);
      // Additional cleanup logic can be added here
    } catch (err: any) {
      setSpotifyError(err.message || 'Failed to disconnect from Spotify');
      throw err;
    }
  };
  
  const disconnectFromYouTube = async (): Promise<void> => {
    try {
      setHasYouTubeAuth(false);
      setYoutubeUserProfile(null);
      setYoutubeError(null);
      // Additional cleanup logic can be added here
    } catch (err: any) {
      setYoutubeError(err.message || 'Failed to disconnect from YouTube');
      throw err;
    }
  };

  // Platform profile fetching methods
  const fetchSpotifyProfile = async (): Promise<void> => {
    try {
      console.log('[AuthContext] 🎵 Fetching Spotify user profile...');
      
      // Import both profile functions
      const { getDetailedSpotifyProfile, getSpotifyUserProfile, checkSpotifyScopeCompleteness } = await import('../lib/spotifyAuth');
      
      // Check if user needs to re-authenticate for additional scopes
      const scopeCheck = await checkSpotifyScopeCompleteness();
      if (scopeCheck.needsReauth && scopeCheck.missingScopes.length > 0) {
        console.log('[AuthContext] User needs re-authentication for scopes:', scopeCheck.missingScopes);
        // Store this info for later use, but don't force re-auth immediately
        localStorage.setItem('spotify_needs_reauth', JSON.stringify({
          missingScopes: scopeCheck.missingScopes,
          timestamp: Date.now()
        }));
      }
      
      try {
        // Try detailed profile first
        const profileData = await getDetailedSpotifyProfile();
        
        if (profileData) {
          console.log('[AuthContext] ✅ Detailed Spotify profile fetched:', {
            displayName: profileData.displayName,
            hasImage: !!profileData.imageUrl,
            id: profileData.id,
            savedTracks: profileData.savedTracks,
            totalPlaylists: profileData.totalPlaylists,
            product: profileData.product
          });
          
          setSpotifyUserProfile({
            // Basic profile (compatible with existing code)
            displayName: profileData.displayName || 'Spotify User',
            imageUrl: profileData.imageUrl,
            images: profileData.imageUrl ? [{ url: profileData.imageUrl }] : [], // Add images array for compatibility
            id: profileData.id,
            email: profileData.email,
            externalUrls: profileData.externalUrls,
            
            // Extended real data
            country: profileData.country,
            product: profileData.product,
            followers: profileData.followers,
            publicPlaylists: profileData.publicPlaylists,
            privatePlaylists: profileData.privatePlaylists,
            collaborativePlaylists: profileData.collaborativePlaylists,
            totalPlaylists: profileData.totalPlaylists,
            followingArtists: profileData.followingArtists,
            savedTracks: profileData.savedTracks,
            savedAlbums: profileData.savedAlbums,
            topGenres: profileData.topGenres,
            accountType: profileData.accountType,
            explicitContentFilter: profileData.explicitContentFilter,
            audioQuality: profileData.audioQuality,
            offlineDownloads: profileData.offlineDownloads,
            deviceLimit: profileData.deviceLimit,
            lastActive: profileData.lastActive,
            listeningTime: profileData.listeningTime,
            monthlyListeners: profileData.monthlyListeners,
            nextBilling: profileData.nextBilling,
            crossfade: profileData.crossfade,
            equalizer: profileData.equalizer
          });
          
          setSpotifyError(null);
          return; // Success with detailed profile
        }
      } catch (detailedError) {
        console.warn('[AuthContext] ⚠️ Detailed profile failed, falling back to basic profile:', detailedError);
      }
      
      // Fallback to basic profile if detailed fails
      console.log('[AuthContext] 🔄 Falling back to basic Spotify profile...');
      const basicProfileData = await getSpotifyUserProfile();
      
      if (basicProfileData) {
        console.log('[AuthContext] ✅ Basic Spotify profile fetched:', {
          displayName: basicProfileData.displayName,
          hasImage: !!basicProfileData.imageUrl,
          id: basicProfileData.id
        });
        
        setSpotifyUserProfile({
          // Basic profile data
          displayName: basicProfileData.displayName || 'Spotify User',
          imageUrl: basicProfileData.imageUrl,
          images: basicProfileData.imageUrl ? [{ url: basicProfileData.imageUrl }] : [],
          id: basicProfileData.id,
          email: basicProfileData.email,
          externalUrls: basicProfileData.externalUrls,
          
          // Default/unavailable values for restricted accounts
          country: 'Not available',
          product: 'Restricted account',
          followers: 0,
          publicPlaylists: 0,
          privatePlaylists: 0,
          collaborativePlaylists: 0,
          totalPlaylists: 0,
          followingArtists: 0,
          savedTracks: 0,
          savedAlbums: 0,
          topGenres: ['Account restricted'],
          accountType: 'Restricted',
          explicitContentFilter: 'Not available',
          audioQuality: 'Not available',
          offlineDownloads: 'Not available',
          deviceLimit: 1,
          lastActive: 'Not available',
          listeningTime: 'Not available',
          monthlyListeners: 'Not available',
          nextBilling: 'Not available',
          crossfade: 'Not available',
          equalizer: 'Not available'
        });
        
        setSpotifyError('Limited profile data (account restrictions)');
      } else {
        console.warn('[AuthContext] ⚠️ No Spotify profile data available');
        setSpotifyUserProfile(null);
        setSpotifyError('Unable to fetch Spotify profile');
      }
    } catch (err: any) {
      console.error('[AuthContext] ❌ Error fetching Spotify profile:', err);
      setSpotifyError(err.message || 'Failed to fetch Spotify profile');
      setSpotifyUserProfile(null);
      throw err;
    }
  };

  const fetchYouTubeProfile = async (): Promise<void> => {
    try {
      console.log('[AuthContext] 🎥 Fetching YouTube user profile...');
      
      // Import token manager to get YouTube token
      const TokenManager = (await import('../lib/tokenManager')).default;
      
      // Get YouTube access token
      const tokens = await TokenManager.getTokens('youtube');
      if (!tokens?.accessToken) {
        throw new Error('No YouTube access token available');
      }
      
      // Fetch YouTube profile using Google People API
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.warn(`[AuthContext] YouTube profile fetch failed: ${response.status} ${response.statusText}`);
        
        if (response.status === 401) {
          // Token expired, try to refresh
          console.log('[AuthContext] YouTube token expired, attempting refresh...');
          try {
            const refreshedTokens = await TokenManager.refreshTokensPublic('youtube', tokens.refreshToken);
            if (refreshedTokens) {
              // Retry with refreshed token
              const retryResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                  'Authorization': `Bearer ${refreshedTokens.accessToken}`,
                  'Content-Type': 'application/json'
                }
              });
              
              if (!retryResponse.ok) {
                console.warn(`[AuthContext] YouTube profile retry failed: ${retryResponse.status}`);
                throw new Error(`YouTube profile fetch failed: ${retryResponse.status}`);
              }
              
              const profileData = await retryResponse.json();
              console.log('[AuthContext] ✅ YouTube profile fetched (after refresh):', {
                name: profileData.name,
                hasImage: !!profileData.picture,
                id: profileData.id
              });
              
              setYoutubeUserProfile({
                displayName: profileData.name || 'YouTube User',
                imageUrl: profileData.picture,
                picture: profileData.picture, // Also store as 'picture' for compatibility
                id: profileData.id,
                email: profileData.email,
                locale: profileData.locale
              });
              
              setYoutubeError(null);
              return;
            } else {
              console.warn('[AuthContext] Failed to refresh YouTube token');
              throw new Error('Failed to refresh YouTube token');
            }
          } catch (refreshError) {
            console.error('[AuthContext] Error refreshing YouTube token:', refreshError);
            throw new Error('Failed to refresh YouTube token');
          }
        } else {
          // For other errors, just log and continue
          console.warn(`[AuthContext] YouTube profile fetch failed with status ${response.status}, but continuing...`);
          // Don't throw error, just return null profile
          setYoutubeUserProfile(null);
          setYoutubeError(`YouTube profile unavailable (${response.status})`);
          return;
        }
      }
      
      const profileData = await response.json();
      console.log('[AuthContext] ✅ YouTube profile fetched:', {
        name: profileData.name,
        hasImage: !!profileData.picture,
        id: profileData.id
      });
      
      setYoutubeUserProfile({
        displayName: profileData.name || 'YouTube User',
        imageUrl: profileData.picture,
        picture: profileData.picture, // Also store as 'picture' for compatibility
        id: profileData.id,
        email: profileData.email,
        locale: profileData.locale
      });
      
      setYoutubeError(null);
      
    } catch (err: any) {
      console.error('[AuthContext] ❌ Error fetching YouTube profile:', err);
      setYoutubeError(err.message || 'Failed to fetch YouTube profile');
      setYoutubeUserProfile(null);
      throw err;
    }
  };

  const checkYouTubeAuth = async (): Promise<boolean> => {
    try {
      // This would typically check if YouTube auth token is valid
      // For now, return the current state
      return hasYouTubeAuth;
    } catch (err: any) {
      setYoutubeError(err.message || 'Failed to check YouTube auth');
      return false;
    }
  };

  // Generic sign in method (defaults to Google sign in)
  const signIn = async (): Promise<void> => {
    return signInWithGoogle();
  };

  // Check platform authentication status on app load
  const checkPlatformAuthStatus = async (firebaseUser: any) => {
    try {
      // Dynamically import to avoid circular dependencies
      const { isSpotifyAuthenticated } = await import('../lib/spotifyAuth');
      const TokenManager = (await import('../lib/tokenManager')).default;
      
      console.log('[AuthContext] Checking platform auth status...');
      
      // Check Spotify authentication
      try {
        const spotifyAuth = await isSpotifyAuthenticated();
        console.log('[AuthContext] Spotify auth status:', spotifyAuth);
        setHasSpotifyAuth(spotifyAuth);
        
        // Fetch Spotify profile if authenticated
        if (spotifyAuth) {
          try {
            console.log('[AuthContext] 🎵 Fetching Spotify profile on app load...');
            await fetchSpotifyProfile();
          } catch (profileError) {
            console.warn('[AuthContext] ⚠️ Failed to fetch Spotify profile on app load:', profileError);
            // Don't fail the auth check if profile fetch fails
          }
        }
      } catch (error) {
        console.warn('[AuthContext] Error checking Spotify auth:', error);
        setHasSpotifyAuth(false);
      }

      // Check YouTube authentication
      try {
        const youtubeTokens = await TokenManager.getTokens('youtube');
        const hasYouTubeTokens = !!youtubeTokens?.accessToken;
        console.log('[AuthContext] YouTube auth status:', hasYouTubeTokens);
        setHasYouTubeAuth(hasYouTubeTokens);
        
        // Fetch YouTube profile if authenticated
        if (hasYouTubeTokens) {
          try {
            console.log('[AuthContext] 🎥 Fetching YouTube profile on app load...');
            await fetchYouTubeProfile();
          } catch (profileError) {
            console.warn('[AuthContext] ⚠️ Failed to fetch YouTube profile on app load:', profileError);
            // Don't fail the auth check if profile fetch fails
          }
        }
      } catch (error) {
        console.warn('[AuthContext] Error checking YouTube auth:', error);
        setHasYouTubeAuth(false);
      }
    } catch (error) {
      console.error('[AuthContext] Error in checkPlatformAuthStatus:', error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile
        const profile = await fetchUserProfile(firebaseUser.uid);
        setUserProfile(profile);
        
        // Check platform authentication status
        await checkPlatformAuthStatus(firebaseUser);
      } else {
        setUserProfile(null);
        // Clear platform auth states when user signs out
        setHasSpotifyAuth(false);
        setHasYouTubeAuth(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Listen for platform authentication events
  useEffect(() => {
    const handleSpotifyAuthChange = async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('[AuthContext] Spotify auth changed:', customEvent.detail);
      setHasSpotifyAuth(customEvent.detail.authenticated);
      setSpotifyError(null); // Clear any previous errors
      
      // Fetch profile when authentication succeeds
      if (customEvent.detail.authenticated) {
        try {
          console.log('[AuthContext] 🎵 Spotify authenticated, fetching profile...');
          await fetchSpotifyProfile();
        } catch (error) {
          console.warn('[AuthContext] ⚠️ Failed to fetch Spotify profile after auth:', error);
          // Don't fail the auth process if profile fetch fails
        }
      } else {
        // Clear profile when disconnected
        setSpotifyUserProfile(null);
      }
    };

    const handleYouTubeAuthChange = async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('[AuthContext] YouTube auth changed:', customEvent.detail);
      setHasYouTubeAuth(customEvent.detail.authenticated);
      setYoutubeError(null); // Clear any previous errors
      
      // Fetch profile when authentication succeeds
      if (customEvent.detail.authenticated) {
        try {
          console.log('[AuthContext] 🎥 YouTube authenticated, fetching profile...');
          await fetchYouTubeProfile();
        } catch (error) {
          console.warn('[AuthContext] ⚠️ Failed to fetch YouTube profile after auth:', error);
          // Don't fail the auth process if profile fetch fails
        }
      } else {
        // Clear profile when disconnected
        setYoutubeUserProfile(null);
      }
    };

    // Add event listeners
    window.addEventListener('spotify-auth-changed', handleSpotifyAuthChange);
    window.addEventListener('youtube-auth-changed', handleYouTubeAuthChange);

    console.log('[AuthContext] Added platform auth event listeners');

    // Cleanup event listeners
    return () => {
      window.removeEventListener('spotify-auth-changed', handleSpotifyAuthChange);
      window.removeEventListener('youtube-auth-changed', handleYouTubeAuthChange);
      console.log('[AuthContext] Removed platform auth event listeners');
    };
  }, []);

  const value: AuthContextType = {
      user,
    userProfile,
      loading,
      isAuthenticated: !!user,
    isProvider: userProfile?.isProvider || false,
    error,
      signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
      signOut,
    updateUserProfile,
    clearError,
    hasSpotifyAuth,
    hasYouTubeAuth,
    setHasSpotifyAuth,
    setHasYouTubeAuth,
    disconnectFromSpotify,
    disconnectFromYouTube,
    isConnectingSpotify,
    isConnectingYouTube,
    spotifyError,
    youtubeError,
    spotifyUserProfile,
    youtubeUserProfile,
    
    // Platform profile fetching
    fetchSpotifyProfile,
    fetchYouTubeProfile,
    checkYouTubeAuth,
    
    // Generic sign in method
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 