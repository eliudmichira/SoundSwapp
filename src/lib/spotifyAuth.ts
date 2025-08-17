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
  AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
  TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  // Full scopes for standard accounts
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-follow-read',
    'user-top-read',
    'user-library-read'
  ],
  // Fallback scopes for family accounts (read-only)
  FAMILY_FRIENDLY_SCOPES: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative'
  ]
};

// Debug Spotify configuration
console.log('[Spotify Auth] Configuration loaded:', {
  clientId: SPOTIFY_CONFIG.CLIENT_ID ? `${SPOTIFY_CONFIG.CLIENT_ID.substring(0, 10)}...` : 'MISSING',
  redirectUri: SPOTIFY_CONFIG.REDIRECT_URI,
  hasClientSecret: !!SPOTIFY_CONFIG.CLIENT_SECRET
});

// Log environment variables for debugging  
console.log('[Spotify Auth] Environment variables:', {
  VITE_SPOTIFY_CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID ? `${import.meta.env.VITE_SPOTIFY_CLIENT_ID.substring(0, 10)}...` : 'MISSING',
  VITE_SPOTIFY_REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'MISSING'
});

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

    // Debug log the token exchange parameters
    console.log('[Spotify Auth] Token exchange parameters:', {
      client_id: SPOTIFY_CONFIG.CLIENT_ID ? `${SPOTIFY_CONFIG.CLIENT_ID.substring(0, 10)}...` : 'MISSING',
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      has_code: !!code,
      has_code_verifier: !!storedAuthState.codeVerifier,
      has_client_secret: !!SPOTIFY_CONFIG.CLIENT_SECRET
    });

    const tokenParams = new URLSearchParams({
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
      client_secret: SPOTIFY_CONFIG.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: storedAuthState.codeVerifier
    });

    console.log('[Spotify Auth] Making token exchange request to:', SPOTIFY_CONFIG.TOKEN_ENDPOINT);

    const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('[Spotify Auth] Token exchange failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestParams: {
          client_id: SPOTIFY_CONFIG.CLIENT_ID ? `${SPOTIFY_CONFIG.CLIENT_ID.substring(0, 10)}...` : 'MISSING',
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        }
      });
      
      // If it's a redirect URI mismatch, provide helpful error message
      if (response.status === 400 && errorData?.error === 'invalid_grant') {
        console.error('[Spotify Auth] REDIRECT URI MISMATCH - Check your Spotify app settings!');
        console.error('[Spotify Auth] Expected redirect URI in Spotify settings:', redirectUri);
      }
      
      return null;
    }

    const tokens = await response.json();
    console.log('[Spotify Auth] Token exchange successful');
    return tokens;
  } catch (error) {
    console.error('[Spotify Auth] Failed to exchange code for tokens:', error);
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
    // Convert to Unix timestamp in seconds (not milliseconds)
    const expiresAt = Math.floor(Date.now() / 1000) + tokens.expires_in;
    
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
          expiresAt, // Already in seconds format
          scope: tokens.scope || undefined
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
export const getSpotifyAuthUrl = async (scopes: string[] = SPOTIFY_CONFIG.SCOPES): Promise<string> => {
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
    scope: scopes.join(' ')
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
      console.log('[Spotify Auth] No Spotify token available for fetching user profile.');
      return null;
    }

    console.log('[Spotify Auth] 🎵 Fetching Spotify user profile...');
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.warn('[Spotify Auth] Profile fetch failed:', response.status, response.statusText);
      
      // Check content type before trying to parse as JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      let errorInfo = `HTTP ${response.status}`;
      if (isJson) {
        try {
          const errorData = await response.json();
          errorInfo = errorData.error?.message || errorData.message || errorInfo;
        } catch (parseError) {
          console.warn('[Spotify Auth] Failed to parse error response as JSON:', parseError);
        }
      } else {
        // Non-JSON response (likely HTML error page)
        const errorText = await response.text();
        console.warn('[Spotify Auth] Received non-JSON error response:', errorText.substring(0, 200) + '...');
      }
      
      console.error('[Spotify Auth] Error fetching Spotify user profile:', response.status, errorInfo);
      
      // Handle specific error cases
      if (response.status === 401) {
        console.log('[Spotify Auth] Token expired or invalid, clearing auth...');
        logoutFromSpotify();
      } else if (response.status === 403) {
        console.log('[Spotify Auth] Access forbidden - likely account restrictions');
        // Don't logout for 403 as it might be account restrictions, not invalid token
      }
      
      return null;
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('[Spotify Auth] Failed to parse profile response as JSON:', parseError);
      return null;
    }
    
    console.log('[Spotify Auth] ✅ Profile fetched successfully:', {
      displayName: data.display_name,
      hasImages: !!(data.images && data.images.length > 0),
      id: data.id
    });
    
    // We are interested in display_name and images[0].url
    return {
      displayName: data.display_name,
      imageUrl: data.images && data.images.length > 0 ? data.images[0].url : null,
      id: data.id,
      email: data.email,
      externalUrls: data.external_urls?.spotify
    };
  } catch (error) {
    console.error('[Spotify Auth] Exception fetching Spotify user profile:', error);
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

/**
 * Detect if account is a family plan account with restrictions
 */
export async function detectAccountType(accessToken: string): Promise<{
  accountType: 'premium' | 'free' | 'family_child' | 'family_restricted' | 'unknown';
  hasPlaylistAccess: boolean;
  canCreatePlaylists: boolean;
  recommendations: string[];
}> {
  try {
    // Validate token before making API calls
    if (!accessToken || accessToken.trim() === '') {
      console.warn('[Spotify Auth] No access token provided to detectAccountType');
      return {
        accountType: 'unknown',
        hasPlaylistAccess: false,
        canCreatePlaylists: false,
        recommendations: ['No access token available. Please reconnect your Spotify account.']
      };
    }

    console.log('[Spotify Auth] 🔍 Detecting account type...');
    
    // Get user profile with better error handling
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (!profileResponse.ok) {
      console.warn('[Spotify Auth] Profile request failed:', profileResponse.status, profileResponse.statusText);
      
      if (profileResponse.status === 403) {
        // 403 suggests account restrictions or invalid permissions
        return {
          accountType: 'family_restricted',
          hasPlaylistAccess: false,
          canCreatePlaylists: false,
          recommendations: [
            'Your Spotify account has restricted permissions (403 Forbidden)',
            'This is common with family plan child accounts',
            'Try using public playlist URLs for conversion instead',
            'Contact your family plan administrator for full access'
          ]
        };
      } else if (profileResponse.status === 401) {
        // 401 suggests expired or invalid token
        return {
          accountType: 'unknown',
          hasPlaylistAccess: false,
          canCreatePlaylists: false,
          recommendations: [
            'Your Spotify access token has expired or is invalid',
            'Please reconnect your Spotify account',
            'Try signing out and signing back in'
          ]
        };
      }
      
      // Other errors
      return {
        accountType: 'unknown',
        hasPlaylistAccess: false,
        canCreatePlaylists: false,
        recommendations: [`Unable to access Spotify profile (${profileResponse.status}). Please try reconnecting.`]
      };
    }
    
    let profile;
    try {
      profile = await profileResponse.json();
    } catch (parseError) {
      console.error('[Spotify Auth] Failed to parse profile response as JSON:', parseError);
      return {
        accountType: 'unknown',
        hasPlaylistAccess: false,
        canCreatePlaylists: false,
        recommendations: [
          'Received invalid response from Spotify',
          'This may indicate account restrictions',
          'Please try reconnecting your account'
        ]
      };
    }
    
    // Test playlist access with better error handling
    const playlistResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=1', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const hasPlaylistAccess = playlistResponse.ok;
    let canCreatePlaylists = false;
    
    // Only test playlist creation if we have playlist access
    if (hasPlaylistAccess) {
      // Test playlist creation capability (dry run)
      const createTestResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'SoundSwapp Test (Will be deleted)',
          description: 'Test playlist for permissions - will be deleted immediately',
          public: false
        })
      });
      
      canCreatePlaylists = createTestResponse.ok;
      
      // If test playlist was created, delete it immediately
      if (createTestResponse.ok) {
        try {
          const testPlaylist = await createTestResponse.json();
          await fetch(`https://api.spotify.com/v1/playlists/${testPlaylist.id}/followers`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
        } catch (cleanupError) {
          console.warn('[Spotify Auth] Failed to cleanup test playlist:', cleanupError);
          // Don't fail the detection for cleanup issues
        }
      }
    }
    
    // Determine account type and recommendations
    let accountType: 'premium' | 'free' | 'family_child' | 'family_restricted' | 'unknown' = 'unknown';
    const recommendations: string[] = [];
    
    if (profile.product === 'premium') {
      if (hasPlaylistAccess && canCreatePlaylists) {
        accountType = 'premium';
        console.log('[Spotify Auth] ✅ Full Premium account detected');
      } else if (hasPlaylistAccess && !canCreatePlaylists) {
        accountType = 'family_restricted';
        recommendations.push('Your account has playlist creation restrictions');
        recommendations.push('You can still convert playlists using public playlist URLs');
        recommendations.push('Ask the family plan admin to enable playlist creation');
        console.log('[Spotify Auth] ⚠️ Family restricted account detected');
      } else {
        accountType = 'family_child';
        recommendations.push('Your account appears to be a family plan child account');
        recommendations.push('Contact your family plan administrator for playlist access');
        recommendations.push('You can still use public playlist URLs for conversion');
        console.log('[Spotify Auth] ⚠️ Family child account detected');
      }
    } else {
      accountType = 'free';
      recommendations.push('Consider upgrading to Spotify Premium for full playlist features');
      recommendations.push('You can still convert public playlists using URLs');
      console.log('[Spotify Auth] ℹ️ Free account detected');
    }
    
    console.log('[Spotify Auth] Account type detected:', {
      accountType,
      product: profile.product,
      hasPlaylistAccess,
      canCreatePlaylists,
      country: profile.country
    });
    
    return {
      accountType,
      hasPlaylistAccess,
      canCreatePlaylists,
      recommendations
    };
    
  } catch (error) {
    console.error('[Spotify Auth] Error detecting account type:', error);
    return {
      accountType: 'unknown',
      hasPlaylistAccess: false,
      canCreatePlaylists: false,
      recommendations: [
        'Unable to detect account type due to an error',
        'Please try reconnecting your Spotify account',
        'You can still use public playlist URLs for conversion'
      ]
    };
  }
}

/**
 * Initialize progressive Spotify authentication (try full scopes, fallback to read-only)
 */
export const initProgressiveSpotifyAuth = async (useReadOnlyFallback = false): Promise<{
  success: boolean;
  error?: string;
  accountType?: string;
  recommendations?: string[];
}> => {
  try {
    // Check if user is authenticated first
    const { isAuthenticated, error: authError } = ensureUserAuthenticated();
    
    if (!isAuthenticated) {
      return {
        success: false,
        error: authError || 'Authentication required'
      };
    }

    // Choose scopes based on fallback flag
    const scopes = useReadOnlyFallback ? SPOTIFY_CONFIG.FAMILY_FRIENDLY_SCOPES : SPOTIFY_CONFIG.SCOPES;
    
    console.log(`[Spotify Auth] Initiating auth with ${useReadOnlyFallback ? 'family-friendly' : 'full'} scopes:`, scopes);

    // Generate auth URL with appropriate scopes
    const authUrl = await getSpotifyAuthUrl(scopes);
    
    // Store auth attempt type
    localStorage.setItem('spotify_auth_type', useReadOnlyFallback ? 'family_friendly' : 'full');
    localStorage.setItem('spotify_auth_return_path', window.location.pathname);
    
    // Use full page redirect
    window.location.href = authUrl;
    
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize progressive Spotify auth:', error);
    return {
      success: false,
      error: 'Failed to initialize Spotify authentication'
    };
  }
}; 

/**
 * Get comprehensive Spotify user profile data
 */
export const getDetailedSpotifyProfile = async (): Promise<any | null> => {
  try {
    const token = await getSpotifyToken();
    if (!token) {
      console.warn('[Spotify Auth] No access token available for detailed profile');
      return null;
    }

    console.log('[Spotify Auth] 🔍 Fetching detailed Spotify profile data...');

    // Fetch multiple endpoints in parallel with silent error handling
    const [
      profileResponse,
      playlistsResponse, 
      followingResponse,
      topArtistsResponse,
      savedTracksResponse,
      savedAlbumsResponse
    ] = await Promise.allSettled([
      // User profile (always available with basic scopes)
      fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      // User playlists (always available with playlist scopes)
      fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      // Following (artists) - silent fail if 403
      fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => new Response(null, { status: 403 })),
      // Top artists (for genres) - silent fail if 403
      fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => new Response(null, { status: 403 })),
      // Saved tracks count - silent fail if 403
      fetch('https://api.spotify.com/v1/me/tracks?limit=1', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => new Response(null, { status: 403 })),
      // Saved albums count - silent fail if 403
      fetch('https://api.spotify.com/v1/me/albums?limit=1', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => new Response(null, { status: 403 }))
    ]);

    // Parse profile data
    let profile = null;
    if (profileResponse.status === 'fulfilled' && profileResponse.value.ok) {
      try {
        profile = await profileResponse.value.json();
      } catch (e) {
        console.warn('[Spotify Auth] Failed to parse profile response');
      }
    }

    if (!profile) {
      console.warn('[Spotify Auth] Could not fetch basic profile data');
      return null;
    }

    // Parse playlists data (handle 403 silently)
    let playlistsData = { public: 0, private: 0, collaborative: 0, total: 0 };
    if (playlistsResponse.status === 'fulfilled' && playlistsResponse.value.ok) {
      try {
        const playlists = await playlistsResponse.value.json();
        playlistsData.total = playlists.total || 0;
        
        // Count playlist types
        if (playlists.items) {
          playlists.items.forEach((playlist: any) => {
            if (playlist.collaborative) {
              playlistsData.collaborative++;
            } else if (playlist.public) {
              playlistsData.public++;
            } else {
              playlistsData.private++;
            }
          });
        }
      } catch (e) {
        console.warn('[Spotify Auth] Failed to parse playlists response');
      }
    }

    // Parse following data (handle 403 silently)
    let followingCount = 0;
    if (followingResponse.status === 'fulfilled' && followingResponse.value.ok) {
      try {
        const following = await followingResponse.value.json();
        followingCount = following.artists?.total || 0;
      } catch (e) {
        console.warn('[Spotify Auth] Failed to parse following response');
      }
    }

    // Parse top artists for genres (handle 403 silently)
    let topGenres: string[] = [];
    if (topArtistsResponse.status === 'fulfilled' && topArtistsResponse.value.ok) {
      try {
        const topArtists = await topArtistsResponse.value.json();
        if (topArtists.items) {
          const genreCount: { [key: string]: number } = {};
          topArtists.items.forEach((artist: any) => {
            if (artist.genres) {
              artist.genres.forEach((genre: string) => {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
              });
            }
          });
          
          // Get top 3 genres
          topGenres = Object.entries(genreCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([genre]) => genre.charAt(0).toUpperCase() + genre.slice(1));
        }
      } catch (e) {
        console.warn('[Spotify Auth] Failed to parse top artists response');
      }
    }

    // Parse saved tracks count (handle 403 silently)
    let savedTracksCount = 0;
    if (savedTracksResponse.status === 'fulfilled' && savedTracksResponse.value.ok) {
      try {
        const savedTracks = await savedTracksResponse.value.json();
        savedTracksCount = savedTracks.total || 0;
      } catch (e) {
        console.warn('[Spotify Auth] Failed to parse saved tracks response');
      }
    }

    // Parse saved albums count (handle 403 silently)
    let savedAlbumsCount = 0;
    if (savedAlbumsResponse.status === 'fulfilled' && savedAlbumsResponse.value.ok) {
      try {
        const savedAlbums = await savedAlbumsResponse.value.json();
        savedAlbumsCount = savedAlbums.total || 0;
      } catch (e) {
        console.warn('[Spotify Auth] Failed to parse saved albums response');
      }
    }

    // Build comprehensive profile with fallback data for restricted endpoints
    const detailedProfile = {
      // Basic profile info (real)
      displayName: profile.display_name || 'Spotify User',
      imageUrl: profile.images && profile.images.length > 0 ? profile.images[0].url : null,
      id: profile.id,
      email: profile.email,
      country: profile.country,
      product: profile.product, // free, premium, etc.
      followers: profile.followers?.total || 0,
      
      // Real playlist data
      publicPlaylists: playlistsData.public,
      privatePlaylists: playlistsData.private,
      collaborativePlaylists: playlistsData.collaborative,
      totalPlaylists: playlistsData.total,
      
      // Real following data (or fallback)
      followingArtists: followingCount || 'Not available',
      
      // Real saved content (or fallback)
      savedTracks: savedTracksCount || 'Not available',
      savedAlbums: savedAlbumsCount || 'Not available',
      
      // Real genres (or fallback)
      topGenres: topGenres.length > 0 ? topGenres : ['Music Lover'],
      
      // Account details (real where available)
      accountType: profile.product === 'premium' ? 'Premium' : 'Free',
      explicitContentFilter: profile.explicit_content?.filter_enabled ? 'Enabled' : 'Disabled',
      
      // Technical details that are standard for account type
      audioQuality: profile.product === 'premium' ? 'High (320kbps)' : 'Normal (160kbps)',
      offlineDownloads: profile.product === 'premium' ? 'Available' : 'Not Available',
      deviceLimit: profile.product === 'premium' ? 5 : 1,
      
      // Data we can't get from API (remove from display or mark as unavailable)
      lastActive: 'Real-time data not available via API',
      listeningTime: 'Real-time data not available via API',
      monthlyListeners: 'Not available for user accounts',
      nextBilling: 'Billing info not available via API',
      crossfade: 'Settings not available via API',
      equalizer: 'Settings not available via API'
    };

    console.log('[Spotify Auth] ✅ Detailed profile fetched:', {
      displayName: detailedProfile.displayName,
      hasImage: !!detailedProfile.imageUrl,
      product: detailedProfile.product,
      savedTracks: detailedProfile.savedTracks,
      totalPlaylists: detailedProfile.totalPlaylists,
      topGenres: detailedProfile.topGenres
    });

    return detailedProfile;

  } catch (error) {
    console.error('[Spotify Auth] Exception fetching detailed Spotify profile:', error);
    return null;
  }
}; 

/**
 * Check if user needs to re-authenticate for additional scopes
 */
export const checkSpotifyScopeCompleteness = async (): Promise<{
  needsReauth: boolean;
  missingScopes: string[];
  currentScopes: string[];
}> => {
  try {
    const token = await getSpotifyToken();
    if (!token) {
      return {
        needsReauth: true,
        missingScopes: SPOTIFY_CONFIG.SCOPES,
        currentScopes: []
      };
    }

    // Try to access a restricted endpoint to see if we have the scopes
    const testResponses = await Promise.allSettled([
      fetch('https://api.spotify.com/v1/me/following?type=artist&limit=1', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch('https://api.spotify.com/v1/me/top/artists?limit=1', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch('https://api.spotify.com/v1/me/tracks?limit=1', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    const missingScopes: string[] = [];
    const currentScopes: string[] = [];

    // Check which endpoints are accessible
    if (testResponses[0].status === 'fulfilled' && testResponses[0].value.status === 403) {
      missingScopes.push('user-follow-read');
    } else {
      currentScopes.push('user-follow-read');
    }

    if (testResponses[1].status === 'fulfilled' && testResponses[1].value.status === 403) {
      missingScopes.push('user-top-read');
    } else {
      currentScopes.push('user-top-read');
    }

    if (testResponses[2].status === 'fulfilled' && testResponses[2].value.status === 403) {
      missingScopes.push('user-library-read');
    } else {
      currentScopes.push('user-library-read');
    }

    return {
      needsReauth: missingScopes.length > 0,
      missingScopes,
      currentScopes
    };
  } catch (error) {
    console.error('[Spotify Auth] Error checking scope completeness:', error);
    return {
      needsReauth: true,
      missingScopes: SPOTIFY_CONFIG.SCOPES,
      currentScopes: []
    };
  }
};

/**
 * Force re-authentication to get additional scopes
 */
export const forceSpotifyReauth = async (): Promise<void> => {
  try {
    console.log('[Spotify Auth] Forcing re-authentication for additional scopes...');
    
    // Clear existing tokens
    await logoutFromSpotify();
    
    // Start new authentication with full scopes
    const authUrl = await getSpotifyAuthUrl(SPOTIFY_CONFIG.SCOPES);
    window.location.href = authUrl;
  } catch (error) {
    console.error('[Spotify Auth] Error forcing re-authentication:', error);
    throw error;
  }
}; 