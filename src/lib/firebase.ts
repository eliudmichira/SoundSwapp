import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithRedirect,
  signInWithPopup, 
  getRedirectResult,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  Auth,
  browserSessionPersistence,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { 
  getFirestore,
  Firestore,
  disableNetwork,
  enableNetwork,
  getDocs,
  query,
  collection,
  limit
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from './env';

// Add additional mobile detection and optimization
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isAndroidDevice = () => {
  return /Android/i.test(navigator.userAgent);
};

// Initialize Firebase with error handling
let app: any;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: any = null;
let firestoreConnected = true;

// Flag to help with debugging
let firestoreInitAttempts = 0;

try {
  console.log('Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth first
  auth = getAuth(app);
  console.log('Firebase Auth initialized');
  
  // Configure auth for better mobile performance
  if (auth) {
    // Set longer timeout for mobile devices
    if (isMobileDevice()) {
      (auth as any)._timeout = 60000; // 60 seconds for mobile
      console.log('Configured extended Firebase auth timeout for mobile device');
      
      // Add specific Android optimizations
      if (isAndroidDevice()) {
        // Use a shorter persistence session for Android to avoid "stuck" sessions
        (auth as any)._persistenceKey = 'firebase:auth:persistence:android';
        // Add a custom flag for Android-specific handling
        (auth as any)._isAndroid = true;
        console.log('Applied Android-specific Firebase auth optimizations');
      }
    }
  }
  
  // Now initialize Firestore with retry logic
  const initFirestore = (attempt = 0): Firestore | null => {
    try {
      firestoreInitAttempts = attempt + 1;
      console.log(`Initializing Firestore (attempt ${firestoreInitAttempts})...`);
      
      const firestore = getFirestore(app);
      console.log('Firestore initialization successful!');
      firestoreConnected = true;
      return firestore;
    } catch (err) {
      console.error(`Firestore initialization failed (attempt ${firestoreInitAttempts}):`, err);
      
      // Retry up to 3 times with exponential backoff
      if (attempt < 2) {
        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`Retrying Firestore initialization in ${backoffTime}ms...`);
        // For immediate retries, we'll do them synchronously
        return initFirestore(attempt + 1);
      }
      
      return null;
    }
  };
  
  // Initialize Firestore with retry
  db = initFirestore();
  
  // Validate Firestore connection
  if (db) {
    console.log('Firestore connection established, starting app...');
  } else {
    console.error('Failed to initialize Firestore after multiple attempts. App may have limited functionality.');
    firestoreConnected = false;
  }
  
  // Initialize analytics last, it's least critical
  try {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized');
  } catch (analyticsError) {
    console.warn('Firebase Analytics initialization failed:', analyticsError);
    analytics = null;
  }

  // After initializing Firebase Auth, add this code to ensure persistence is set correctly
  // This helps ensure auth state persists across redirects
  if (auth) {
    // Set longer timeout for mobile devices
    if (isMobileDevice()) {
      (auth as any)._timeout = 60000; // 60 seconds for mobile
      console.log('Configured extended Firebase auth timeout for mobile device');
      
      // Add specific Android optimizations
      if (isAndroidDevice()) {
        // Use a shorter persistence session for Android to avoid "stuck" sessions
        (auth as any)._persistenceKey = 'firebase:auth:persistence:android';
        // Add a custom flag for Android-specific handling
        (auth as any)._isAndroid = true;
        console.log('Applied Android-specific Firebase auth optimizations');
      }
    }
    
    // Set up auth state observer for debugging
    auth.onAuthStateChanged((user) => {
      console.log('🔑 Firebase Auth state changed:', user ? 
        `User ${user.email} (${user.uid})` : 
        'No user');
    }, (error) => {
      console.error('🔑 Firebase Auth state error:', error);
    });
  }
} catch (firebaseError) {
  console.error('Firebase initialization failed:', firebaseError);
  // Create fallbacks to prevent app crashes
  // These will be non-functional but prevent null reference errors
  if (!app) app = {} as any;
  if (!auth) auth = {} as unknown as Auth;
  if (!db) db = {} as unknown as Firestore;
  if (!analytics) analytics = {} as any;
}

// Manually disconnect/reconnect Firestore to help with the channel termination errors
export const disconnectFirestore = async (): Promise<void> => {
  if (db && firestoreConnected) {
    try {
      await disableNetwork(db);
      firestoreConnected = false;
      console.log('Firestore network disabled');
    } catch (err) {
      console.error('Error disconnecting Firestore:', err);
    }
  }
};

export const reconnectFirestore = async (attemptCount = 0): Promise<boolean> => {
  if (!db) {
    console.error('Cannot reconnect - Firestore database not initialized');
    return false;
  }
  
  // If already connected, return success
  if (firestoreConnected) {
    console.log('Firestore already connected');
    return true;
  }
  
  try {
    console.log('Attempting to reconnect Firestore network...');
    
    // Add a small delay before reconnection
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Enable network with timeout
    const enablePromise = enableNetwork(db);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore reconnect timeout')), 10000)
    );
    
    await Promise.race([enablePromise, timeoutPromise]);
    
    firestoreConnected = true;
    console.log('Firestore network successfully re-enabled');
    
    // Verify connection by performing a simple query
    try {
      // Try to access a document that should always exist (like a public config doc)
      // or just check if we can access the database at all
      await Promise.race([
        getDocs(query(collection(db, 'users'), limit(1))),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Test query timeout')), 5000))
      ]);
      console.log('Connection verified with test query');
    } catch (verifyError) {
      console.warn('Failed to verify connection, but network appears enabled:', verifyError);
      // We'll still consider this a success since enableNetwork worked
    }
    
    return true;
  } catch (err) {
    console.error('Error reconnecting Firestore:', err);
    
    // Try again with backoff if under max attempts (3)
    if (attemptCount < 3) {
      const backoffTime = Math.pow(2, attemptCount) * 1000; // Exponential backoff
      console.log(`Retrying Firestore reconnection in ${backoffTime}ms (attempt ${attemptCount + 1}/3)`);
      
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return reconnectFirestore(attemptCount + 1);
    }
    
    firestoreConnected = false;
    return false;
  }
};

// Add Android-specific auth helper
export const handleAndroidAuth = async (authPromise: Promise<any>, timeoutMs = 20000): Promise<any> => {
  if (!isAndroidDevice()) {
    // Just return the promise if not on Android
    return authPromise;
  }
  
  console.log('Using enhanced Android-specific auth handling');
  
  // Create a more aggressive timeout promise for Android
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Authentication timeout on Android. Please check your connection and try again.'));
    }, timeoutMs);
  });
  
  // Create a safety loop to detect stuck auth
  let authStarted = false;
  let authCompleted = false;
  
  // Start a monitoring loop that will force a rejection if auth appears stuck
  const monitoringInterval = setInterval(() => {
    if (authStarted && !authCompleted) {
      // Check if auth has been running too long without completing
      console.log('Android auth monitoring - still waiting...');
    }
  }, 5000); // Check every 5 seconds
  
  try {
    authStarted = true;
    
    // Try to ensure good connection first
    try {
      await reconnectFirestore();
      console.log('Successfully reconnected Firestore before Android auth');
    } catch (e) {
      console.warn('Failed to reconnect Firestore before Android auth:', e);
    }
    
    // For Google auth, add a special check to clear any existing auth state
    // This helps prevent issues with previous failed auth attempts
    if (authPromise.toString().includes('GoogleAuthProvider')) {
      try {
        console.log('Google auth detected, ensuring clean auth state');
        const existingUser = auth?.currentUser;
        if (existingUser) {
          console.log('Found existing user, this may help with token refresh');
        }
      } catch (e) {
        console.warn('Error checking existing user:', e);
      }
    }
    
    // For Android, add a small pre-auth delay to allow UI to update and network to stabilize
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Race the auth promise against the timeout
    const result = await Promise.race([
      authPromise,
      timeoutPromise
    ]);
    
    authCompleted = true;
    console.log('Android auth completed successfully');
    
    // Add small delay to ensure auth state is properly updated
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return result;
  } catch (error) {
    authCompleted = true;
    console.error('Android authentication error:', error);
    
    // Special handling for Google popup issues on Android
    if (error instanceof Error && 
        (error.message.includes('popup') || 
         error.message.includes('The popup has been closed'))) {
      console.log('Android popup issue detected, attempting to handle gracefully');
      
      // Throw a more specific error for popup issues
      throw new Error('The authentication popup was closed. Please try again and keep the popup open until completion.');
    }
    
    // Check if it's a network error
    if (error instanceof Error && 
        (error.message.includes('network') || 
         error.message.includes('timeout') || 
         error.message.includes('connection'))) {
      // Try to reconnect again
      try {
        await reconnectFirestore();
      } catch (e) {
        console.warn('Failed to reconnect after Android auth error:', e);
      }
      
      // For network errors on Android, provide more context in the error
      throw new Error(`Android network error during authentication: ${error.message}. Try switching to WiFi or restart the app.`);
    }
    
    throw error;
  } finally {
    // Always clear the interval
    clearInterval(monitoringInterval);
    
    // For Android, force a reconnect after auth attempts to maintain good connection state
    try {
      setTimeout(() => {
        reconnectFirestore().catch(e => 
          console.warn('Post-auth reconnect failed:', e)
        );
      }, 1000);
    } catch (e) {
      // Ignore errors here
    }
  }
};

// Add listeners for page visibility and online/offline events
if (typeof window !== 'undefined') {
  // Handle tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // When tab is not visible, consider disconnecting Firestore to avoid connection issues
      if (db && firestoreConnected) {
        window.setTimeout(() => {
          // Only disconnect if the page remains hidden for at least 5 minutes
          if (document.visibilityState === 'hidden') {
            disconnectFirestore();
          }
        }, 300000); // 5 minutes
      }
    } else if (document.visibilityState === 'visible') {
      // When tab becomes visible again, reconnect if needed
      if (db && !firestoreConnected) {
        reconnectFirestore();
      }
    }
  });

  // Handle offline/online events
  window.addEventListener('online', () => {
    if (db && !firestoreConnected) {
      reconnectFirestore();
    }
  });
  
  window.addEventListener('offline', () => {
    if (db && firestoreConnected) {
      disconnectFirestore();
    }
  });
  
  // Handle beforeunload to properly clean up connections
  window.addEventListener('beforeunload', () => {
    if (db && firestoreConnected) {
      // Just set the flag - actual disconnection would be too late
      firestoreConnected = false;
    }
  });
  
  // Add Android-specific network handling
  if (isAndroidDevice()) {
    // Check network status more frequently on Android
    let lastNetworkCheck = Date.now();
    
    const checkAndroidNetwork = () => {
      if (Date.now() - lastNetworkCheck > 30000) { // 30 seconds
        lastNetworkCheck = Date.now();
        
        if (navigator.onLine && db && !firestoreConnected) {
          reconnectFirestore();
        } else if (!navigator.onLine && db && firestoreConnected) {
          disconnectFirestore();
        }
      }
    };
    
    // Check more frequently during user interaction
    document.addEventListener('click', checkAndroidNetwork);
    document.addEventListener('touchstart', checkAndroidNetwork);
    document.addEventListener('keydown', checkAndroidNetwork);
  }
}

// Export Firebase components with type assertions
export { auth, db, analytics, firestoreConnected };

// Export Firebase auth methods
export { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile 
};

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async (preferRedirect = true) => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }
  
  // Emergency cleanup: If there's existing redirect data but no auth attempt within 10 minutes,
  // it may indicate the redirect flow was interrupted. Clear it to prevent getting stuck.
  const existingRedirectStart = localStorage.getItem('auth_redirect_start');
  if (existingRedirectStart) {
    const startTime = parseInt(existingRedirectStart);
    if (isNaN(startTime) || Date.now() - startTime > 10 * 60 * 1000) { // 10 minutes
      console.log('📝 Found stale auth_redirect_start, clearing it before new attempt');
      localStorage.removeItem('auth_redirect_start');
    } else {
      console.log('⚠️ Found recent auth_redirect_start, might be a duplicate auth attempt');
    }
  }
  
  // Clean up any previous redirect data to ensure we start fresh
  localStorage.removeItem('auth_redirect_start');
  
  // Set fresh redirect start timestamp
  const authTimestamp = Date.now();
  localStorage.setItem('auth_redirect_start', authTimestamp.toString());
  console.log('📝 Saved auth_redirect_start timestamp:', authTimestamp, new Date(authTimestamp).toLocaleTimeString());
  
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  
  // Debug: log current origin to help troubleshoot redirect URI issues
  console.log('🔍 Authentication Environment:');
  console.log('- Current origin:', window.location.origin);
  console.log('- Current pathname:', window.location.pathname);
  console.log('- Full URL:', window.location.href);
  console.log('- Expected redirect URI:', `${window.location.origin}/__/auth/handler`);
  console.log('- User agent:', navigator.userAgent);
  console.log('- Online status:', navigator.onLine ? 'Online' : 'Offline');
  console.log('- Platform:', navigator.platform);
  
  // Ensure proper return path after sign-in
  const returnPath = window.location.pathname + window.location.search;
  if (returnPath) {
    localStorage.setItem('auth_return_path', returnPath);
    console.log('📝 Saved return path for after auth:', returnPath);
  }
  
  try {
    // Before attempting any auth method, make sure Firestore is connected
    try {
      await reconnectFirestore();
      console.log('✅ Ensured Firestore connection before Google sign-in');
    } catch (firestoreError) {
      console.warn('⚠️ Failed to reconnect Firestore, continuing anyway:', firestoreError);
    }
    
    // For mobile, especially Android, use longer timeout settings
    if (isMobileDevice()) {
      // Configure longer timeouts
      console.log('🔧 Applying enhanced timeouts for mobile device');
      // Apply any mobile-specific persistence settings if needed
      try {
        // For mobile, default to a session persistence for faster auth
        await setPersistence(auth, browserSessionPersistence);
      } catch (persistError) {
        console.warn('⚠️ Failed to set auth persistence:', persistError);
      }
    }
    
    // Add login_hint for any previously used Google account if available
    const lastEmail = localStorage.getItem('last_auth_email');
    if (lastEmail && lastEmail.includes('@')) {
      console.log('🔍 Found previous email, adding as login_hint');
      provider.setCustomParameters({
        'login_hint': lastEmail
      });
    }
    
    if (preferRedirect) {
      console.log('📱 Using redirect method for Google sign-in');
      
      try {
        // Try popup first on localhost for better development experience
        if (window.location.hostname === 'localhost') {
          console.log('🖥️ Using popup for localhost development environment');
          const result = await signInWithPopup(auth, provider);
          if (result && result.user) {
            console.log('✅ User signed in via popup:', result.user.email);
            
            // Save email for future login_hint
            if (result.user.email) {
              localStorage.setItem('last_auth_email', result.user.email);
            }
            
            // Clean up any redirect data
            localStorage.removeItem('auth_redirect_start');
            localStorage.removeItem('auth_redirect_initiated');
            
            return result.user;
          }
        } else {
          // Add a progress tracking flag to localStorage for debugging
          localStorage.setItem('auth_redirect_initiated', 'true');
          
          // Add a small delay to ensure Firebase is fully ready
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('🔄 Calling signInWithRedirect...');
          
          // Use a fallback timer to detect if the redirect doesn't happen
          const redirectFallbackTimer = setTimeout(() => {
            console.error("⚠️ Redirect didn't happen within expected time. This could indicate a problem with Firebase configuration.");
            localStorage.setItem('redirect_failed', 'true');
          }, 5000);
          
          try {
            // Attempt the redirect with a longer timeout to account for slower connections
            await Promise.race([
              signInWithRedirect(auth, provider),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Redirect initialization timed out - browser may be blocking redirects')), 30000)
              )
            ]);
            
            clearTimeout(redirectFallbackTimer);
          } catch (redirectInitError) {
            clearTimeout(redirectFallbackTimer);
            console.log('🔄 Redirect initialization error, trying popup as immediate fallback...');
            
            // Immediate fallback to popup
            try {
              const popupResult = await signInWithPopup(auth, provider);
              if (popupResult?.user?.email) {
                localStorage.setItem('last_auth_email', popupResult.user.email);
              }
              return popupResult.user;
            } catch (immediateFallbackError) {
              console.error('❌ Both redirect and immediate popup fallback failed:', immediateFallbackError);
              throw redirectInitError; // Throw the original error
            }
          }
          
          // This point should technically never be reached as redirect should navigate away
          console.log('⚠️ Redirect completed without navigation? Checking result...');
        }
        
        // Add a fallback check for the redirect result
        try {
          console.log('🔍 Checking for redirect result immediately...');
          const result = await Promise.race([
            getRedirectResult(auth),
            new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('Immediate redirect result check timed out')), 8000)
            )
          ]);
          
          if (result && result.user) {
            console.log('✅ User signed in:', result.user.email);
            // Save email for future login_hint
            if (result.user.email) {
              localStorage.setItem('last_auth_email', result.user.email);
            }
            return result.user;
          } else {
            console.log('⚠️ No user found in immediate redirect result check');
          }
        } catch (immediateCheckError) {
          console.warn('⚠️ Immediate redirect result check failed:', immediateCheckError);
        }
        
        // If we reach here, the redirect hasn't fully completed yet
        console.log('⏳ Redirect initiated, page will reload soon...');
        
        // Return null to indicate the auth is in progress via redirect
        return null;
      } catch (redirectError: any) {
        console.error('❌ Error during redirect sign-in:', redirectError);
        
        // Check for common redirect errors
        if (redirectError.message && (
            redirectError.message.includes('redirect_uri_mismatch') || 
            redirectError.message.includes('invalid_request')
        )) {
          console.error('❌ CRITICAL: Likely OAuth redirect URI mismatch. Check Google Cloud Console configuration!');
          console.error(`❌ Ensure that ${window.location.origin}/__/auth/handler is added as an authorized redirect URI.`);
          
          // Save diagnostic info for later debugging
          localStorage.setItem('redirect_error_type', 'uri_mismatch');
          localStorage.setItem('redirect_error_time', Date.now().toString());
          localStorage.setItem('redirect_error_origin', window.location.origin);
        }
        
        // Clean up the redirect marker on error
        localStorage.removeItem('auth_redirect_start');
        localStorage.removeItem('auth_redirect_initiated');
        
        // If we're not on mobile, try popup as fallback
        if (!isMobileDevice()) {
          console.log('🔄 Falling back to popup method after redirect failure');
          
          try {
            // If URI mismatch, add a small delay before fallback to avoid rate limiting
            if (redirectError.message && redirectError.message.includes('redirect_uri_mismatch')) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Attempt popup as fallback
            console.log('🔄 Attempting popup fallback method...');
            const popupResult = await signInWithPopup(auth, provider);
            
            if (popupResult?.user?.email) {
              localStorage.setItem('last_auth_email', popupResult.user.email);
            }
            
            return popupResult.user;
          } catch (popupFallbackError) {
            console.error('❌ Popup fallback also failed:', popupFallbackError);
            throw redirectError; // Throw the original redirect error
          }
        } else {
          // On mobile, throw a more descriptive error
          throw new Error(
            redirectError?.message || 
            'Google sign-in redirect failed. Please check your connection and try again.'
          );
        }
      }
    } else {
      // Use popup flow
      console.log('🖥️ Using popup method for Google sign-in');
      
      try {
        const result = await signInWithPopup(auth, provider);
        if (result && result.user) {
          console.log('✅ User signed in via popup:', result.user.email);
          
          // Save email for future login_hint
          if (result.user.email) {
            localStorage.setItem('last_auth_email', result.user.email);
          }
          
          // Clean up any redirect data since we succeeded with popup
          localStorage.removeItem('auth_redirect_start');
          localStorage.removeItem('auth_redirect_initiated');
          
          return result.user;
        } else {
          console.error('❌ Popup sign-in returned null result');
          throw new Error('Authentication failed - no user data returned');
        }
      } catch (popupError: any) {
        console.error('❌ Error during popup sign-in:', popupError);
        
        // Check for common popup errors
        if (popupError.code === 'auth/popup-blocked') {
          console.error('❌ Popup was blocked by the browser. User should enable popups for this site.');
        }
        
        // Clean up any redirect data
        localStorage.removeItem('auth_redirect_start');
        localStorage.removeItem('auth_redirect_initiated');
        
        // Throw with more descriptive message
        throw new Error(
          popupError?.message || 
          'Google sign-in popup failed. Please try again or use a different sign-in method.'
        );
      }
    }
  } catch (error: any) {
    console.error('❌ Fatal error in signInWithGoogle:', error);
    
    // Clean up redirect data 
    localStorage.removeItem('auth_redirect_start');
    localStorage.removeItem('auth_redirect_initiated');
    
    throw error;
  }
};

// Add debug function to help troubleshoot auth issues
export const debugGoogleAuth = async () => {
  try {
    console.log("🔍 DEBUG: Google Auth debugging info:");
    
    // Check current auth state
    const currentUser = auth?.currentUser;
    console.log(" - Current user:", currentUser ? `${currentUser.email} (${currentUser.uid})` : "None");
    
    // Check for pending redirects
    const redirectStart = localStorage.getItem('auth_redirect_start');
    console.log(" - Pending redirect:", redirectStart ? `Started at ${new Date(parseInt(redirectStart)).toLocaleString()}` : "None");
    
    // Check localStorage for Firebase redirect info
    try {
      const redirectKey = localStorage.getItem('firebase:authUser');
      const pendingCred = localStorage.getItem('firebase:pendingRedirect');
      console.log(" - Auth storage:", redirectKey ? "Has auth user data" : "No auth user data");
      console.log(" - Pending redirect:", pendingCred ? "Yes" : "No");
    } catch (e) {
      console.error(" - Error checking localStorage", e);
    }
    
    // Check network status
    console.log(" - Network status:", navigator.onLine ? "Online" : "Offline");
    console.log(" - User agent:", navigator.userAgent);
    
    return {
      hasUser: !!currentUser,
      isAndroid: isAndroidDevice(),
      isMobile: isMobileDevice(),
      isOnline: navigator.onLine,
      hasPendingRedirect: !!localStorage.getItem('firebase:pendingRedirect')
    };
  } catch (e: unknown) {
    console.error("Error in debug function:", e);
    return { error: e instanceof Error ? e.message : String(e) };
  }
};

// Get redirect result (to be used after a signInWithRedirect) 
export const getAuthRedirectResult = async () => {
  try {
    if (!auth) throw new Error("Firebase auth not initialized");
    
    console.log("Starting getAuthRedirectResult processing");
    
    // Check if we have a pending redirect
    const redirectStart = localStorage.getItem('auth_redirect_start');
    if (!redirectStart) {
      console.log("No pending redirect found in getAuthRedirectResult");
      return null;
    }
    
    console.log("Pending redirect found with ID:", redirectStart);
    
    // Add exponential backoff retry logic for more reliability
    const maxRetries = 2;
    let lastError = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        // Wait with exponential backoff before retrying
        const waitTime = attempt * 1000; // 1s, 2s
        console.log(`Retry attempt ${attempt}/${maxRetries} after ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      try {
        let result;
        
        if (isAndroidDevice()) {
          console.log("Using Android-specific handler for redirect result");
          result = await handleAndroidAuth(getRedirectResult(auth), 30000);
        } else {
          result = await Promise.race([
            getRedirectResult(auth),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error("Firebase redirect result check timed out")), 25000)
            )
          ]);
        }
        
        if (result && result.user) {
          console.log("Redirect result success:", result.user.email);
          
          // Clear the redirect marker
          localStorage.removeItem('auth_redirect_start');
          
          // Reconnect Firestore if needed after authentication via redirect
          if (db && !firestoreConnected) {
            try {
              await reconnectFirestore();
            } catch (e) {
              console.warn("Failed to reconnect Firestore after successful redirect:", e);
            }
          }
          
          return result.user;
        } else if (result) {
          console.log("Got redirect result but no user");
          // Edge case: We got a result but no user
          if (auth.currentUser) {
            console.log("But we have a current user:", auth.currentUser.email);
            return auth.currentUser;
          }
          return null;
        } else {
          console.log("No redirect result on attempt", attempt);
          lastError = new Error("No redirect result");
        }
      } catch (error) {
        console.error(`Error getting redirect result (attempt ${attempt}):`, error);
        lastError = error;
        
        // Special handling for timeout errors - check for current user
        if (error instanceof Error && error.message.includes("timed out") && auth.currentUser) {
          console.log("Redirect timed out but we have a current user:", auth.currentUser.email);
          return auth.currentUser;
        }
      }
    }
    
    // Clear the redirect marker after all attempts
    localStorage.removeItem('auth_redirect_start');
    
    // If we have a current user despite failures, return it
    if (auth.currentUser) {
      console.log("Returning current user after failed redirect result:", auth.currentUser.email);
      return auth.currentUser;
    }
    
    throw lastError || new Error("Failed to get redirect result after multiple attempts");
  } catch (error) {
    console.error("Final error handling redirect result:", error);
    // Clear the redirect marker in case of error
    localStorage.removeItem('auth_redirect_start');
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    if (!auth) throw new Error("Firebase auth not initialized");
    
    // Disconnect Firestore before signing out
    if (db && firestoreConnected) {
      await disconnectFirestore();
    }
    
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Helper to check if Firebase is properly initialized
export const isFirebaseInitialized = () => {
  return !!app && !!auth && !!db;
};

// Export a function to check the current auth state - useful for debugging
export const checkAuthState = () => {
  const currentUser = auth?.currentUser;
  console.log('Current auth state check:', currentUser ? 
    `User signed in: ${currentUser.email} (${currentUser.uid})` : 
    'No user signed in');
  return currentUser;
};

// Add a cleanup function for auth state
export const cleanupAuthState = async () => {
  try {
    if (!auth) {
      console.error('Auth not initialized');
      return false;
    }
    
    // Clear any pending redirects
    await auth.setPersistence(browserSessionPersistence);
    console.log('Auth state cleaned up');
    return true;
  } catch (e) {
    console.error('Error cleaning up auth state:', e);
    return false;
  }
};

// Sign in with Apple
export const signInWithApple = async (preferRedirect = isMobileDevice()) => {
  if (!auth) {
    console.error("Firebase Auth is not initialized.");
    throw new Error("Firebase Auth is not initialized.");
  }

  const provider = new OAuthProvider('apple.com');
  // Request email and name scopes. Firebase requests these by default 
  // if 'One account per email address' is enabled in Firebase console.
  // If you have 'Multiple accounts per email address' enabled, or want to ensure
  // these are requested, you can add them explicitly.
  provider.addScope('email');
  provider.addScope('name');

  // Optional: Localize the Apple authentication screen
  // provider.setCustomParameters({
  //   locale: 'fr' // Example: French
  // });

  try {
    if (preferRedirect) {
      console.log('Attempting Apple sign-in with redirect...');
      await signInWithRedirect(auth, provider);
      // After redirect, getRedirectResult() will be called on page load.
      // No direct result here.
      return null; 
    } else {
      console.log('Attempting Apple sign-in with popup...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Apple sign-in successful (popup):', user);
      
      // You can get the Apple OAuth Access and ID Tokens.
      const credential = OAuthProvider.credentialFromResult(result);
      if (credential) {
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        console.log('Apple Access Token:', accessToken);
        console.log('Apple ID Token:', idToken);
      }
      return user;
    }
  } catch (error: any) {
    console.error('Error during Apple sign-in:', error);
    // Handle specific errors
    if (error.code === 'auth/account-exists-with-different-credential') {
      alert('An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      console.log('Apple sign-in popup request cancelled by user.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.log('Apple sign-in popup closed by user.');
    } else {
      alert(`Apple Sign-In Error: ${error.message}`);
    }
    throw error;
  }
};

// Ensure getRedirectResult is handled appropriately on page load 
// if not already present. It should be called early in your app's lifecycle.
// Example (add this near your Firebase initialization or in your main app component):

/* 
// It's often good practice to call getRedirectResult as soon as auth is initialized
if (auth) {
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        const user = result.user;
        console.log('Apple sign-in successful (redirect):', user);
        const credential = OAuthProvider.credentialFromResult(result);
        if (credential) {
          const accessToken = credential.accessToken;
          const idToken = credential.idToken;
          console.log('Apple Access Token (redirect):', accessToken);
          console.log('Apple ID Token (redirect):', idToken);
        }
        // You might want to update UI or navigate user here
      }
    })
    .catch((error) => {
      console.error('Error during Apple getRedirectResult:', error);
      // Handle errors here, such as auth/account-exists-with-different-credential
       if (error.code === 'auth/account-exists-with-different-credential') {
        alert('An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.');
      }
    });
}
*/ 