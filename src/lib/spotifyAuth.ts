import { generateRandomString, generateCodeVerifier, generateCodeChallenge } from './cryptoUtils';
import { isMobileDevice } from './utils';
import { spotifyConfig } from './env';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import TokenManager from './tokenManager';

// Spotify API configuration
const SPOTIFY_CONFIG = {
  CLIENT_ID: spotifyConfig.clientId,
  CLIENT_SECRET: spotifyConfig.clientSecret,
  REDIRECT_URI: spotifyConfig.redirectUri,
  VALID_REDIRECT_URIS: spotifyConfig.validRedirectUris,
  AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
  TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  SCOPES: [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private'
  ]
};

// Types
interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface AuthState {
  state: string;
  codeVerifier: string;
  returnPath: string;
}

// Storage keys
const STORAGE_KEYS = {
  AUTH_STATE: 'spotify_auth_state',
  CODE_VERIFIER: 'spotify_code_verifier',
  RETURN_PATH: 'spotify_auth_return_path',
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  EXPIRES_AT: 'spotify_token_expires_at',
  REDIRECT_URI: 'spotify_redirect_uri'
};

/**
 * Check if user is authenticated before starting Spotify auth
 */
export const ensureUserAuthenticated = (): { isAuthenticated: boolean; error?: string } => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return {
      isAuthenticated: false,
      error: 'You need to be signed in to connect your Spotify account'
    };
  }

  return { isAuthenticated: true };
};

/**
 * Initialize Spotify authentication flow using PKCE
 */
export const initSpotifyAuth = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if user is authenticated first
    const { isAuthenticated, error: authError } = ensureUserAuthenticated();
    
    if (!isAuthenticated) {
      return {
        success: false,
        error: authError || 'Authentication required'
      };
    }

    // Generate auth URL with PKCE
    const authUrl = await getSpotifyAuthUrl();
    
    // Store current path to return to after auth
    localStorage.setItem('spotify_auth_return_path', window.location.pathname);
    
    // Use full page redirect for all devices (more reliable)
    console.log('Using full page redirect for Spotify authentication');
    window.location.href = authUrl;
    
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize Spotify auth:', error);
    return {
      success: false,
      error: 'Failed to initialize Spotify authentication'
    };
  }
};

/**
 * Handle the OAuth callback from Spotify
 */
export const handleSpotifyCallback = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    // Log parameters for debugging
    console.log("Callback parameters:", {
      hasCode: !!code,
      hasState: !!state,
      error: error || 'none'
    });
  
    // Handle OAuth errors
  if (error) {
    return { 
      success: false, 
      error: `Spotify authorization error: ${error}`
    };
  }
  
    if (!code || !state) {
      return { 
        success: false, 
        error: 'Missing required authorization parameters' 
      };
    }
    
    // Get stored auth state
    const storedAuthState = getStoredAuthState();
    if (!storedAuthState) {
      return { 
        success: false, 
        error: 'No authentication state found' 
      };
    }
    
    // Validate state parameter
    if (state !== storedAuthState.state) {
    return { 
      success: false, 
        error: 'Invalid state parameter' 
      };
    }
    
    // Get the redirect URI that was used for the initial request
    const usedRedirectUri = localStorage.getItem(STORAGE_KEYS.REDIRECT_URI) || SPOTIFY_CONFIG.REDIRECT_URI;
    
    // Exchange code for tokens using the same redirect URI
    const tokens = await exchangeCodeForTokens(code, usedRedirectUri);
    if (!tokens) {
      return { 
        success: false, 
        error: 'Failed to exchange authorization code for tokens' 
      };
    }
    
    // Store tokens securely
    await storeTokens(tokens);
    
    // Clean up auth state
    clearAuthState();
    localStorage.removeItem(STORAGE_KEYS.REDIRECT_URI);
    
    // Dispatch event to notify application of successful authentication
    window.dispatchEvent(new CustomEvent('spotify-auth-changed', { 
      detail: { authenticated: true } 
    }));
    
    console.log("Spotify authentication successful, dispatched spotify-auth-changed event");
    
    return { success: true };
  } catch (error) {
    console.error('Spotify callback error:', error);
    return { 
      success: false, 
      error: 'Failed to complete authentication' 
    };
  }
};

/**
 * Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<SpotifyTokens | null> {
  try {
    // Get stored auth state to retrieve code verifier
    const storedAuthState = getStoredAuthState();
    if (!storedAuthState?.codeVerifier) {
      console.error('No code verifier found in stored auth state');
      return null;
    }

    const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
        client_secret: SPOTIFY_CONFIG.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: storedAuthState.codeVerifier
      }).toString()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Token exchange error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return null;
    }

    const tokens = await response.json();
    return tokens;
  } catch (error) {
    console.error('Failed to exchange code for tokens:', error);
    return null;
  }
}

/**
 * Get the current user ID from Firebase Auth
 */
function getUserId(): string | null {
  const auth = getAuth();
  return auth.currentUser?.uid || null;
}

/**
 * Store tokens securely in both localStorage and Firestore
 */
async function storeTokens(tokens: SpotifyTokens): Promise<void> {
  try {
    const expiresAt = Date.now() + (tokens.expires_in * 1000);
    
    // Store using TokenManager
    TokenManager.storeTokens('spotify', {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt
    });
    
    // Store in Firestore for persistence
    const userId = getUserId();
    if (userId) {
      try {
        const userTokenRef = doc(db, 'users', userId, 'tokens', 'spotify');
        await setDoc(userTokenRef, {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt
        });
        
        // Also update the user document to indicate Spotify is connected
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          spotifyConnected: true,
          lastUpdated: new Date()
        }, { merge: true });
        
      } catch (firestoreError) {
        console.error('Failed to store tokens in Firestore:', firestoreError);
        // Continue execution - localStorage backup is still available
      }
    }
    
    // Dispatch event to notify about token update
    window.dispatchEvent(new CustomEvent('spotify-auth-changed', {
      detail: { authenticated: true }
    }));
  } catch (error) {
    console.error('Failed to store tokens:', error);
    throw error;
  }
}

/**
 * Get stored auth state from either localStorage or sessionStorage
 */
function getStoredAuthState(): AuthState | null {
  const localState = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
  const sessionState = sessionStorage.getItem(STORAGE_KEYS.AUTH_STATE);
  
  try {
    return JSON.parse(localState || sessionState || 'null');
  } catch {
    return null;
  }
}

/**
 * Clear authentication state from storage
 */
function clearAuthState(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
}

/**
 * Check if the current Spotify access token is valid
 */
export async function isSpotifyAuthenticated(): Promise<boolean> {
  console.log('[DEBUG] isSpotifyAuthenticated() called');
  return await TokenManager.hasValidTokens('spotify');
}

/**
 * Get the current access token, refreshing if necessary
 */
export async function getSpotifyToken(): Promise<string | null> {
  try {
    console.log('[DEBUG] getSpotifyToken() called');
    
    // Use TokenManager to get tokens
    const tokens = await TokenManager.getTokens('spotify');
    console.log('[DEBUG] Tokens from TokenManager:', tokens ? 'Found' : 'Not found');
    
    if (tokens) {
      console.log('[DEBUG] Returning valid token from TokenManager');
      return tokens.accessToken;
    }
    
    console.log('[DEBUG] No valid tokens found, attempting refresh...');
    
    // If no valid tokens, try to refresh using TokenManager
    const storedTokens = await TokenManager.getTokens('spotify');
    if (storedTokens?.refreshToken) {
      console.log('[DEBUG] Found refresh token in TokenManager, attempting refresh...');
      const newTokens = await refreshAccessToken(storedTokens.refreshToken);
      if (newTokens) {
        console.log('[DEBUG] Token refresh successful, storing new tokens...');
        
        // Store using TokenManager
        TokenManager.storeTokens('spotify', {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
          expiresAt: Date.now() + (newTokens.expires_in * 1000)
        });
        
        console.log('[DEBUG] New tokens stored successfully');
        return newTokens.access_token;
      } else {
        console.error('[DEBUG] Token refresh failed');
      }
    } else {
      console.log('[DEBUG] No refresh token available');
    }
    
    console.log('[DEBUG] No valid token available');
    return null;
  } catch (error) {
    console.error('[DEBUG] Error in getSpotifyToken:', error);
    return null;
  }
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens | null> {
  try {
    const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
          method: 'POST',
          headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
        client_secret: SPOTIFY_CONFIG.CLIENT_SECRET
      }).toString()
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
  }
}

/**
 * Log out from Spotify by clearing all tokens and state
 */
export function logoutFromSpotify(): void {
  // Clear tokens using TokenManager
  TokenManager.clearTokens('spotify');
  
  // Clear legacy storage keys for backward compatibility
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

/**
 * Check the current authentication status
 */
async function checkAuthStatus(): Promise<void> {
  const isAuthed = await isSpotifyAuthenticated();
  if (!isAuthed) {
    // Trigger auth state change in your app
    window.dispatchEvent(new CustomEvent('spotify-auth-changed', { 
      detail: { authenticated: false } 
    }));
  }
}

// Add this new function
export const getSpotifyAuthUrl = async (): Promise<string> => {
  // Generate PKCE and state values
  const state = generateRandomString(32);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store auth state securely
  const authState: AuthState = {
    state,
    codeVerifier,
    returnPath: window.location.pathname
  };
  
  // Store in both storages for redundancy
  localStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(authState));
  sessionStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(authState));
  
  // Store the current redirect URI being used
  localStorage.setItem(STORAGE_KEYS.REDIRECT_URI, SPOTIFY_CONFIG.REDIRECT_URI);
  
  // Build authorization URL with PKCE
  const authUrl = new URL(SPOTIFY_CONFIG.AUTH_ENDPOINT);
  const params = {
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state,
    scope: SPOTIFY_CONFIG.SCOPES.join(' ')
  };
  
  Object.entries(params).forEach(([key, value]) => {
    authUrl.searchParams.append(key, value);
  });
  
  // Log the auth URL for debugging
  console.log('Spotify Auth URL:', authUrl.toString());
  
  return authUrl.toString();
};

// Add this new function
export const getSpotifyUserProfile = async (): Promise<any | null> => {
  try {
    const token = await getSpotifyToken();
    if (!token) {
      console.log('No Spotify token available for fetching user profile.');
      return null;
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching Spotify user profile:', response.status, errorData);
      // If 401 or 403, might indicate token issue, try to clear auth
      if (response.status === 401 || response.status === 403) {
        logoutFromSpotify(); // Or a more nuanced token refresh/clear
      }
      return null;
    }

    const data = await response.json();
    // We are interested in display_name and images[0].url
    return {
      displayName: data.display_name,
      imageUrl: data.images && data.images.length > 0 ? data.images[0].url : null,
      id: data.id,
      externalUrls: data.external_urls?.spotify
    };
  } catch (error) {
    console.error('Exception fetching Spotify user profile:', error);
    return null;
  }
}; 

/**
 * Get the current access token synchronously (no refresh)
 */
export async function getSpotifyTokenSync(): Promise<string | null> {
  console.log('[DEBUG] getSpotifyTokenSync() called');
  const tokens = await TokenManager.getTokens('spotify');
  const token = tokens?.accessToken || null;
  console.log('[DEBUG] getSpotifyTokenSync result:', token ? 'Found' : 'Not found');
  return token;
} 