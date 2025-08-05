import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { signInWithGoogle as firebaseSignInWithGoogle } from './firebase';
import TokenManager from './tokenManager';
import { SimpleAuth } from './simpleAuth';

// Constants for storage
const AUTH_RECOVERY_KEY = 'auth_recovery_data';
const YOUTUBE_AUTH_STATE_KEY = 'youtube_auth_state';
const STORE_NAME = 'auth_store';

// Helper function to save to IndexedDB
const saveToIndexedDB = async (storeName: string, key: string, data: any) => {
  // Simple implementation - in a real app, you'd want to handle errors better
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open('app_db', 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(data, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e);
      };
      
      request.onerror = (e) => reject(e);
    } catch (e) {
      reject(e);
    }
  });
};

// Helper function to read from IndexedDB
const readFromIndexedDB = async (storeName: string, key: string) => {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open('app_db', 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        try {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const getRequest = store.get(key);
          
          getRequest.onsuccess = () => resolve(getRequest.result);
          getRequest.onerror = (e) => reject(e);
        } catch (e) {
          reject(e);
        }
      };
      
      request.onerror = (e) => reject(e);
    } catch (e) {
      reject(e);
    }
  });
};

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  hasSpotifyAuth: boolean;
  hasYouTubeAuth: boolean;
  setHasSpotifyAuth: (value: boolean) => void;
  setHasYouTubeAuth: (value: boolean) => void;
  authRecoveryAttempted: boolean;
  isAuthenticated: boolean;
  // Authentication functions
  signInWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  // Profile management
  spotifyUserProfile: any;
  youtubeUserProfile: any;
  fetchSpotifyProfile: () => Promise<void>;
  fetchYouTubeProfile: () => Promise<void>;
  // Service connections
  disconnectFromSpotify: () => Promise<void>;
  disconnectFromYouTube: () => Promise<void>;
  isConnectingSpotify: boolean;
  isConnectingYouTube: boolean;
  spotifyError: string | null;
  youtubeError: string | null;
  checkYouTubeAuth: () => Promise<boolean>;
  // General error handling
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSpotifyAuth, setHasSpotifyAuth] = useState(false);
  const [hasYouTubeAuth, setHasYouTubeAuth] = useState(false);
  const [authRecoveryAttempted, setAuthRecoveryAttempted] = useState(false);
  const [spotifyUserProfile, setSpotifyUserProfile] = useState<any>(null);
  const [youtubeUserProfile, setYoutubeUserProfile] = useState<any>(null);
  const [isConnectingSpotify, setIsConnectingSpotify] = useState(false);
  const [isConnectingYouTube, setIsConnectingYouTube] = useState(false);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Save auth state for recovery
  const saveAuthState = async (user: FirebaseUser | null) => {
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        timestamp: Date.now()
      };
      
      // Save to localStorage as backup
      localStorage.setItem(AUTH_RECOVERY_KEY, JSON.stringify(userData));
      
      // Save to IndexedDB
      try {
        await saveToIndexedDB(STORE_NAME, 'currentUser', userData);
      } catch (error) {
        console.error('IndexedDB save failed:', error);
      }
    }
  };

  // Implementation of signInWithEmail
  const signInWithEmail = async (email: string, password: string, displayName?: string) => {
    const auth = getAuth();
    
    try {
      if (displayName) {
        // This is a sign-up operation
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update the user profile with the display name
        await updateProfile(userCredential.user, { displayName });
      } else {
        // This is a sign-in operation
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  // Implementation of signIn (Google sign-in)
  const signIn = async () => {
    try {
      await firebaseSignInWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  // Implementation of signOut
  const signOut = async () => {
    const auth = getAuth();
    await firebaseSignOut(auth);
  };

  // Stub implementations for service-related functions
  const fetchSpotifyProfile = async () => {
    try {
      setIsConnectingSpotify(true);
      setSpotifyError(null);
      
      console.log('Fetching Spotify profile...');
      
      // Get Spotify tokens
      const tokens = await TokenManager.getTokens('spotify');
      if (!tokens) {
        console.log('No Spotify tokens available - user needs to authenticate');
        setSpotifyUserProfile({ 
          displayName: 'Connect Spotify', 
          id: 'spotify_user_id' 
        });
        return;
      }
      
      // Fetch actual Spotify profile
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
      }
      
      const profile = await response.json();
      console.log('Spotify profile fetched:', profile);
      
      // Set the actual profile data
      setSpotifyUserProfile({
        id: profile.id,
        displayName: profile.display_name,
        email: profile.email,
        imageUrl: profile.images?.[0]?.url,
        country: profile.country,
        product: profile.product, // premium, free, etc.
        followers: profile.followers?.total
      });
      
    } catch (err) {
      console.error('Error fetching Spotify profile:', err);
      setSpotifyError('Failed to fetch Spotify profile');
      
      // Fallback to placeholder if API fails
      setSpotifyUserProfile({ 
        displayName: 'Spotify User', 
        id: 'spotify_user_id' 
      });
    } finally {
      setIsConnectingSpotify(false);
    }
  };

  const fetchYouTubeProfile = async () => {
    try {
      setIsConnectingYouTube(true);
      setYoutubeError(null);
      
      console.log('Fetching YouTube profile...');
      
      // Get YouTube tokens
      const tokens = await TokenManager.getTokens('youtube');
      if (!tokens) {
        console.log('No YouTube tokens available - user needs to authenticate');
        setYoutubeUserProfile({ 
          displayName: 'Connect YouTube', 
          id: 'youtube_user_id' 
        });
        return;
      }
      
      // Fetch actual YouTube profile
      const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true`, {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('YouTube token expired, attempting refresh...');
          // Try to refresh the token and retry
          const refreshedTokens = await TokenManager.getTokens('youtube');
          if (refreshedTokens) {
            // Retry with refreshed token
            const retryResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true`, {
              headers: {
                'Authorization': `Bearer ${refreshedTokens.accessToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!retryResponse.ok) {
              throw new Error(`YouTube API error: ${retryResponse.status} ${retryResponse.statusText}`);
            }
            
            const data = await retryResponse.json();
            console.log('YouTube profile fetched (after refresh):', data);
            
            if (data.items && data.items.length > 0) {
              const channel = data.items[0];
              const snippet = channel.snippet;
              const statistics = channel.statistics;
              
              // Set the actual profile data
              setYoutubeUserProfile({
                id: channel.id,
                displayName: snippet.title,
                imageUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
                description: snippet.description,
                subscriberCount: statistics?.subscriberCount,
                videoCount: statistics?.videoCount,
                viewCount: statistics?.viewCount,
                customUrl: snippet.customUrl
              });
            } else {
              throw new Error('No YouTube channel found');
            }
          } else {
            throw new Error('Failed to refresh YouTube token');
          }
        } else {
          throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        console.log('YouTube profile fetched:', data);
        
        if (data.items && data.items.length > 0) {
          const channel = data.items[0];
          const snippet = channel.snippet;
          const statistics = channel.statistics;
          
          // Set the actual profile data
          setYoutubeUserProfile({
            id: channel.id,
            displayName: snippet.title,
            imageUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
            description: snippet.description,
            subscriberCount: statistics?.subscriberCount,
            videoCount: statistics?.videoCount,
            viewCount: statistics?.viewCount,
            customUrl: snippet.customUrl
          });
        } else {
          throw new Error('No YouTube channel found');
        }
      }
      
    } catch (err) {
      console.error('Error fetching YouTube profile:', err);
      setYoutubeError('Failed to fetch YouTube profile');
      
      // Fallback to placeholder if API fails
      setYoutubeUserProfile({ 
        displayName: 'YouTube User', 
        id: 'youtube_user_id' 
      });
    } finally {
      setIsConnectingYouTube(false);
    }
  };

  const disconnectFromSpotify = async () => {
    try {
      // Actual implementation would revoke Spotify access
      console.log('Disconnecting from Spotify...');
      setHasSpotifyAuth(false);
      setSpotifyUserProfile(null);
      // Clear connection date
      localStorage.removeItem('spotify_connection_date');
    } catch (err) {
      console.error('Error disconnecting from Spotify:', err);
      setSpotifyError('Failed to disconnect from Spotify');
    }
  };

  const disconnectFromYouTube = async () => {
    try {
      // Actual implementation would revoke YouTube access
      console.log('Disconnecting from YouTube...');
      setHasYouTubeAuth(false);
      setYoutubeUserProfile(null);
      // Clear connection date
      localStorage.removeItem('youtube_connection_date');
    } catch (err) {
      console.error('Error disconnecting from YouTube:', err);
      setYoutubeError('Failed to disconnect from YouTube');
    }
  };

  const checkYouTubeAuth = async () => {
    try {
      // Actual implementation would check YouTube token validity
      console.log('Checking YouTube auth...');
      return hasYouTubeAuth;
    } catch (err) {
      console.error('Error checking YouTube auth:', err);
      setYoutubeError('Failed to check YouTube authentication');
      return false;
    }
  };

  // Fallback authentication using Spotify-style pattern
  const fallbackAuth = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('[DEBUG] Attempting fallback authentication...');
      
      // First try SimpleAuth
      if (SimpleAuth.isAuthenticated()) {
        console.log('[DEBUG] SimpleAuth authentication found');
        const simpleUser = SimpleAuth.getCurrentUser();
        if (simpleUser) {
          console.log('[DEBUG] SimpleAuth user:', simpleUser.email);
          
          // Dispatch a custom event to notify the app
          window.dispatchEvent(new CustomEvent('fallback-auth-success', {
            detail: { user: simpleUser, source: 'simpleAuth' }
          }));
          
          return { success: true };
        }
      }
      
      // Fallback to original method
      const savedData = JSON.parse(localStorage.getItem(AUTH_RECOVERY_KEY) || 'null');
      
      if (savedData && Date.now() - savedData.timestamp < 3600000) { // 1 hour
        console.log('[DEBUG] Found valid saved auth data, attempting recovery...');
        
        // Try to restore the user session
        const auth = getAuth();
        
        // Check if we're already authenticated
        if (auth.currentUser) {
          console.log('[DEBUG] User already authenticated, skipping fallback');
          return { success: true };
        }
        
        // For fallback, we'll use a simplified approach
        // In a real implementation, you might want to verify the token with your backend
        console.log('[DEBUG] Fallback auth successful for user:', savedData.email);
        
        // Dispatch a custom event to notify the app
        window.dispatchEvent(new CustomEvent('fallback-auth-success', {
          detail: { user: savedData, source: 'legacy' }
        }));
        
        return { success: true };
      }
      
      return { 
        success: false, 
        error: 'No valid authentication data found for fallback' 
      };
    } catch (error) {
      console.error('[DEBUG] Fallback authentication failed:', error);
      return { 
        success: false, 
        error: 'Fallback authentication failed' 
      };
    }
  };

  // Initialize auth persistence
  useEffect(() => {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[DEBUG] Auth state changed:', { 
        hasUser: !!user, 
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
        timestamp: new Date().toISOString()
      });
      setUser(user);
      
      try {
        await saveAuthState(user);
        
        if (user) {
          // Save YouTube auth state if we're in the callback
          if (window.location.pathname.includes('youtube-callback')) {
            const currentUrl = window.location.href;
            sessionStorage.setItem(YOUTUBE_AUTH_STATE_KEY, currentUrl);
          }
          
          // Check service connections with error handling and fallbacks
          try {
            console.log('[DEBUG] Checking service connections for user:', user.uid);
            
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();
            
            console.log('[DEBUG] Firestore user data:', userData);
            
            // Primary source: Firestore
            let spotifyConnected = !!userData?.spotifyConnected;
            let youtubeConnected = !!userData?.youtubeConnected;
            
            console.log('[DEBUG] Firestore connection status:', { spotifyConnected, youtubeConnected });
            
            // Fallback: Check token validity directly using TokenManager
            if (!spotifyConnected) {
              const hasSpotifyTokens = await TokenManager.hasValidTokens('spotify');
              const hasYouTubeTokens = await TokenManager.hasValidTokens('youtube');
              console.log('[DEBUG] TokenManager Spotify check:', hasSpotifyTokens);
              spotifyConnected = hasSpotifyTokens;
            }
            
            if (!youtubeConnected) {
              const hasSpotifyTokens = await TokenManager.hasValidTokens('spotify');
              const hasYouTubeTokens = await TokenManager.hasValidTokens('youtube');
              console.log('[DEBUG] TokenManager YouTube check:', hasYouTubeTokens);
              youtubeConnected = hasYouTubeTokens;
            }
            
            // Additional fallback: Check SimpleAuth service connections
            const simpleSpotifyConnected = SimpleAuth.isServiceConnected('spotify');
            const simpleYouTubeConnected = SimpleAuth.isServiceConnected('youtube');
            
            console.log('[DEBUG] SimpleAuth service connections:', { simpleSpotifyConnected, simpleYouTubeConnected });
            
            console.log('[DEBUG] Final connection status:', { 
              spotifyConnected: spotifyConnected || simpleSpotifyConnected, 
              youtubeConnected: youtubeConnected || simpleYouTubeConnected 
            });
            
            setHasSpotifyAuth(spotifyConnected || simpleSpotifyConnected);
            setHasYouTubeAuth(youtubeConnected || simpleYouTubeConnected);
            
            // Auto-fetch profiles when services are connected
            if (spotifyConnected || simpleSpotifyConnected) {
              fetchSpotifyProfile();
            }
            if (youtubeConnected || simpleYouTubeConnected) {
              fetchYouTubeProfile();
            }
          } catch (firestoreError) {
            console.error('[DEBUG] Firestore error when checking service connections:', firestoreError);
            
            // Use token validation as complete fallback
            const spotifyConnected = await TokenManager.hasValidTokens('spotify');
            const youtubeConnected = await TokenManager.hasValidTokens('youtube');
            
            console.log('[DEBUG] TokenManager fallback check:', { spotifyConnected, youtubeConnected });
            
            // Additional fallback: Check SimpleAuth service connections
            const simpleSpotifyConnected = SimpleAuth.isServiceConnected('spotify');
            const simpleYouTubeConnected = SimpleAuth.isServiceConnected('youtube');
            
            console.log('[DEBUG] SimpleAuth fallback check:', { simpleSpotifyConnected, simpleYouTubeConnected });
            
            console.log('[DEBUG] Using token validation fallback:', { 
              spotifyConnected: spotifyConnected || simpleSpotifyConnected, 
              youtubeConnected: youtubeConnected || simpleYouTubeConnected 
            });
            setHasSpotifyAuth(spotifyConnected || simpleSpotifyConnected);
            setHasYouTubeAuth(youtubeConnected || simpleYouTubeConnected);
            
            // Auto-fetch profiles when services are connected
            if (spotifyConnected || simpleSpotifyConnected) {
              fetchSpotifyProfile();
            }
            if (youtubeConnected || simpleYouTubeConnected) {
              fetchYouTubeProfile();
            }
          }
        } else {
          // User is not authenticated, clear all service connections
          console.log('[DEBUG] User not authenticated, clearing service connections');
          setHasSpotifyAuth(false);
          setHasYouTubeAuth(false);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('[DEBUG] Error in auth state change handler:', error);
        setLoading(false);
        setError('Authentication error. Please try again.');
      }
    });

    // Listen for Spotify authentication changes
    const handleSpotifyAuthChange = (event: CustomEvent) => {
      console.log('Spotify auth change event received:', event.detail);
      const isAuthenticated = event.detail?.authenticated || false;
      setHasSpotifyAuth(isAuthenticated);
      
      if (isAuthenticated) {
        setSpotifyError(null);
        // Save connection date
        localStorage.setItem('spotify_connection_date', new Date().toISOString());
      }
    };

    // Listen for YouTube authentication changes
    const handleYouTubeAuthChange = (event: CustomEvent) => {
      console.log('YouTube auth change event received:', event.detail);
      const isAuthenticated = event.detail?.authenticated || false;
      setHasYouTubeAuth(isAuthenticated);
      
      if (isAuthenticated) {
        setYoutubeError(null);
        // Save connection date
        localStorage.setItem('youtube_connection_date', new Date().toISOString());
      }
    };

    // Listen for token updates
    const handleSpotifyTokenUpdate = (event: CustomEvent) => {
      console.log('Spotify token update event received:', event.detail);
      const hasToken = event.detail?.hasToken || false;
      setHasSpotifyAuth(hasToken);
    };

    const handleYouTubeTokenUpdate = (event: CustomEvent) => {
      console.log('YouTube token update event received:', event.detail);
      const hasToken = event.detail?.hasToken || false;
      setHasYouTubeAuth(hasToken);
    };

    // Listen for fallback auth success
    const handleFallbackAuthSuccess = (event: CustomEvent) => {
      console.log('[DEBUG] Fallback auth success event received:', event.detail);
      // The user data will be handled by the main auth state change handler
    };

    // Add event listeners
    window.addEventListener('spotify-auth-changed', handleSpotifyAuthChange as EventListener);
    window.addEventListener('youtube-auth-changed', handleYouTubeAuthChange as EventListener);
    window.addEventListener('spotify-token-updated', handleSpotifyTokenUpdate as EventListener);
    window.addEventListener('youtube-token-updated', handleYouTubeTokenUpdate as EventListener);
    window.addEventListener('fallback-auth-success', handleFallbackAuthSuccess as EventListener);

    // Attempt auth recovery if needed
    const attemptAuthRecovery = async () => {
      // Don't attempt recovery if we're already on the login page with recovery=true
      if (window.location.pathname === '/login' && window.location.search.includes('recovery=true')) {
        console.log('[DEBUG] Already on recovery login page, skipping auth recovery attempt');
        setAuthRecoveryAttempted(true);
        return;
      }
      
      if (!auth.currentUser && !authRecoveryAttempted) {
        try {
          console.log('[DEBUG] No current user, attempting auth recovery...');
          
          // First try the fallback authentication
          const fallbackResult = await fallbackAuth();
          if (fallbackResult.success) {
            console.log('[DEBUG] Fallback authentication successful');
            setAuthRecoveryAttempted(true);
            return;
          }
          
          // If fallback fails, try the original recovery method
          console.log('[DEBUG] Fallback auth failed, trying original recovery method...');
          
          // Check IndexedDB first
          const idbData = await readFromIndexedDB(STORE_NAME, 'currentUser');

          // Fall back to localStorage if IndexedDB fails
          const savedData = idbData || JSON.parse(localStorage.getItem(AUTH_RECOVERY_KEY) || 'null');
          
          if (savedData && Date.now() - savedData.timestamp < 3600000) { // 1 hour
            console.log('[DEBUG] Found valid saved auth data for uid:', savedData.uid);
            
            // Only redirect to recovery login if we're on a callback page
            if (window.location.pathname.includes('callback')) {
              console.log('[DEBUG] On callback page, redirecting to recovery login');
              localStorage.setItem('post_auth_redirect', window.location.href);
              window.location.href = '/login?recovery=true';
            } else {
              console.log('[DEBUG] Not on callback page, clearing stale auth data');
              // Clear stale auth data if we're not on a callback page
              localStorage.removeItem(AUTH_RECOVERY_KEY);
              try {
                await saveToIndexedDB(STORE_NAME, 'currentUser', null);
              } catch (e) {
                console.warn('Failed to clear IndexedDB auth data:', e);
              }
            }
          } else {
            console.log('[DEBUG] No valid saved auth data found');
            // Clear any stale data
            localStorage.removeItem(AUTH_RECOVERY_KEY);
          }
        } catch (error) {
          console.error('[DEBUG] Auth recovery failed:', error);
          // Clear any corrupted data
          localStorage.removeItem(AUTH_RECOVERY_KEY);
        }
        setAuthRecoveryAttempted(true);
      } else if (auth.currentUser) {
        console.log('[DEBUG] User is already authenticated, skipping recovery');
        setAuthRecoveryAttempted(true);
      }
    };

    attemptAuthRecovery();

    return () => {
      unsubscribe();
      window.removeEventListener('spotify-auth-changed', handleSpotifyAuthChange as EventListener);
      window.removeEventListener('youtube-auth-changed', handleYouTubeAuthChange as EventListener);
      window.removeEventListener('spotify-token-updated', handleSpotifyTokenUpdate as EventListener);
      window.removeEventListener('youtube-token-updated', handleYouTubeTokenUpdate as EventListener);
      window.removeEventListener('fallback-auth-success', handleFallbackAuthSuccess as EventListener);
    };
  }, [authRecoveryAttempted]);

  // Clear expired tokens on app initialization
  useEffect(() => {
    const clearExpiredTokens = () => {
      console.log('[DEBUG] Clearing expired tokens on app initialization');
      
      // Check Spotify tokens
      const spotifyExpires = localStorage.getItem('soundswapp_spotify_expires_at');
      if (spotifyExpires && parseInt(spotifyExpires) < Date.now()) {
        console.log('[DEBUG] Clearing expired Spotify tokens');
        localStorage.removeItem('soundswapp_spotify_access_token');
        localStorage.removeItem('soundswapp_spotify_expires_at');
        localStorage.removeItem('soundswapp_spotify_refresh_token');
        setHasSpotifyAuth(false);
      }
      
      // Check YouTube tokens
      const youtubeExpires = localStorage.getItem('soundswapp_youtube_expires_at');
      if (youtubeExpires && parseInt(youtubeExpires) < Date.now()) {
        console.log('[DEBUG] Clearing expired YouTube tokens');
        localStorage.removeItem('soundswapp_youtube_access_token');
        localStorage.removeItem('soundswapp_youtube_expires_at');
        localStorage.removeItem('soundswapp_youtube_refresh_token');
        setHasYouTubeAuth(false);
      }
    };
    
    clearExpiredTokens();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      hasSpotifyAuth,
      hasYouTubeAuth,
      setHasSpotifyAuth,
      setHasYouTubeAuth,
      authRecoveryAttempted,
      isAuthenticated: !!user,
      // Authentication functions
      signInWithEmail,
      signIn,
      signOut,
      // Profile management
      spotifyUserProfile,
      youtubeUserProfile,
      fetchSpotifyProfile,
      fetchYouTubeProfile,
      // Service connections
      disconnectFromSpotify,
      disconnectFromYouTube,
      isConnectingSpotify,
      isConnectingYouTube,
      spotifyError,
      youtubeError,
      checkYouTubeAuth,
      // Error handling
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 