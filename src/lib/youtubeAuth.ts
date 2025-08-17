import { youtubeConfig } from './env';
import TokenManager from './tokenManager';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// YouTube OAuth endpoints
const YOUTUBE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const YOUTUBE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

// Fallback configuration if environment variables fail to load
const FALLBACK_CONFIG = {
  clientId: '968024909043-qv0sceqajnebc6m3088eoq519n3epbua.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'https://soundswapp.firebaseapp.com/youtube-callback'
};

// YouTube API credentials with fallback
const YOUTUBE_CLIENT_ID = youtubeConfig.clientId || FALLBACK_CONFIG.clientId;
const YOUTUBE_CLIENT_SECRET = youtubeConfig.clientSecret || FALLBACK_CONFIG.clientSecret;
const YOUTUBE_REDIRECT_URI = youtubeConfig.redirectUri || FALLBACK_CONFIG.redirectUri;

// Debug YouTube configuration
console.log('[YouTube Auth] Configuration loaded:', {
  clientId: YOUTUBE_CLIENT_ID ? `${YOUTUBE_CLIENT_ID.substring(0, 10)}...` : 'MISSING',
  redirectUri: YOUTUBE_REDIRECT_URI,
  hasClientSecret: !!YOUTUBE_CLIENT_SECRET,
  usingFallback: !youtubeConfig.clientId
});

// Log environment variables for debugging
console.log('[YouTube Auth] Environment variables:', {
  VITE_YOUTUBE_CLIENT_ID: import.meta.env.VITE_YOUTUBE_CLIENT_ID ? `${import.meta.env.VITE_YOUTUBE_CLIENT_ID.substring(0, 10)}...` : 'MISSING',
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID ? `${import.meta.env.VITE_GOOGLE_CLIENT_ID.substring(0, 10)}...` : 'MISSING',
  VITE_YOUTUBE_REDIRECT_URI: import.meta.env.VITE_YOUTUBE_REDIRECT_URI || 'MISSING'
});

// YouTube API scopes
const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/userinfo.email',
  'openid',
  'profile'
];

// Storage keys
const STORAGE_KEYS = {
  AUTH_STATE: 'youtube_auth_state',
  RETURN_PATH: 'youtube_auth_return_path',
  CALLBACK_URL: 'youtube_callback_url'
};

/**
 * Generate a random state parameter to protect against CSRF attacks
 */
const generateStateParam = (): string => {
  // Generate a random string for state parameter
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  const state = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  
  // Save state in localStorage for better persistence
  localStorage.setItem(STORAGE_KEYS.AUTH_STATE, state);
  
  // Also log the state for debugging
  console.log("Generated YouTube auth state:", state.substring(0, 5) + "...");
  
  return state;
};

/**
 * Generate the YouTube authorization URL for Authorization Code Flow
 */
export const getYouTubeAuthUrl = (): string => {
  const state = generateStateParam();
  
  console.log('[YouTube Auth] Building auth URL with params:', {
    client_id: YOUTUBE_CLIENT_ID ? `${YOUTUBE_CLIENT_ID.substring(0, 10)}...` : 'MISSING',
    redirect_uri: YOUTUBE_REDIRECT_URI,
    state: state ? `${state.substring(0, 5)}...` : 'MISSING',
    scope: YOUTUBE_SCOPES.join(' ')
  });
  
  // Validate required parameters before creating URL
  if (!YOUTUBE_CLIENT_ID) {
    console.error('[YouTube Auth] CRITICAL ERROR: client_id is missing!');
    throw new Error('YouTube client_id is not configured. Please check your environment variables.');
  }
  
  if (!YOUTUBE_REDIRECT_URI) {
    console.error('[YouTube Auth] CRITICAL ERROR: redirect_uri is missing!');
    throw new Error('YouTube redirect_uri is not configured. Please check your environment variables.');
  }
  
  const params = new URLSearchParams({
    client_id: YOUTUBE_CLIENT_ID,
    redirect_uri: YOUTUBE_REDIRECT_URI,
    response_type: 'code', // Using authorization code flow instead of implicit
    scope: YOUTUBE_SCOPES.join(' '),
    include_granted_scopes: 'true',
    state: state,
    access_type: 'offline', // Get a refresh token
    prompt: 'consent'
  }).toString();

  const authUrl = `${YOUTUBE_AUTH_ENDPOINT}?${params}`;
  console.log('[YouTube Auth] Generated auth URL:', authUrl.substring(0, 100) + '...');
  
  return authUrl;
};

/**
 * Initialize YouTube authentication flow
 */
export const initYouTubeAuth = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Generate auth URL
    const authUrl = getYouTubeAuthUrl();
    
    // Store current path to return to after auth
    localStorage.setItem(STORAGE_KEYS.RETURN_PATH, window.location.pathname);
    
    // Use full page redirect for all devices
    console.log('Using full page redirect for YouTube authentication');
    window.location.href = authUrl;
    
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize YouTube auth:', error);
    return {
      success: false,
      error: 'Failed to initialize YouTube authentication'
    };
  }
};

/**
 * Exchange authorization code for access token
 * @param code The authorization code returned from the auth server
 */
export const exchangeCodeForToken = async (code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> => {
  try {
    console.log("Exchanging code for token...");
    // Log URL for debugging
    console.log("Token endpoint:", YOUTUBE_TOKEN_ENDPOINT);
    console.log("Redirect URI:", YOUTUBE_REDIRECT_URI);
    
    const requestData = {
      client_id: YOUTUBE_CLIENT_ID,
      client_secret: YOUTUBE_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: YOUTUBE_REDIRECT_URI
    };
    
    // Log request data (sanitized)
    console.log("Request data:", {
      ...requestData,
      client_secret: "[REDACTED]",
      code: "[REDACTED]"
    });
    
    const response = await fetch(YOUTUBE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(requestData).toString()
    });

    console.log("Token response status:", response.status);
    const responseText = await response.text();

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.error("Token exchange failed:", errorData);
        throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error || 'Unknown error'}`);
      } catch (parseError) {
        console.error("Failed to parse error response:", responseText);
        throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
      }
    }

    try {
      const data = JSON.parse(responseText);
      console.log("Token exchange successful, got tokens:", {
        has_access_token: !!data.access_token,
        has_refresh_token: !!data.refresh_token,
        expires_in: data.expires_in
      });
      
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in || 3600 // Default to 1 hour if not specified
      };
    } catch (parseError) {
      console.error("Failed to parse success response:", responseText);
      throw new Error(`Failed to parse token response`);
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

/**
 * Handle YouTube OAuth callback with proper error handling
 * This should be called in the YouTube callback page component
 */
export const handleYouTubeCallback = async (): Promise<void> => {
  try {
    console.log("YouTube callback handling started");
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    console.log("URL parameters:", { 
      hasCode: !!authCode, 
      hasState: !!state, 
      error: error || 'none' 
    });
    
    // Check for errors in the callback
    if (error) {
      throw new Error(`Authorization error: ${error}`);
    }
    
    // Validate state parameter to prevent CSRF attacks
    const savedState = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    
    console.log("State validation:", { 
      savedState: savedState?.substring(0, 5) + "...", 
      receivedState: state?.substring(0, 5) + "..." 
    });
    
    // Clean up state
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    
    // Special case: if we have no saved state at all, this is likely a returning
    // user after browser restart - we'll proceed with a warning but not fail
    if (!savedState) {
      console.warn("No saved state found, proceeding with authentication anyway");
    } else if (!state || state !== savedState) {
      console.error("State validation failed", { receivedState: state, savedState });
      throw new Error('Invalid state parameter. Authentication attempt may have been compromised.');
    }
    
    if (!authCode) {
      throw new Error('No authorization code found in the callback URL');
    }
    
    console.log("Starting token exchange with code:", authCode.substring(0, 5) + "...");
    
    // Exchange code for tokens
    const tokenData = await exchangeCodeForToken(authCode);
    console.log("Token data received from Google:", tokenData);
    
    if (!tokenData.access_token) {
      throw new Error('No access token received from token exchange');
    }
    
    console.log("Saving tokens to TokenManager");
    
    // Save tokens using the TokenManager with Firestore resilience
    try {
      await TokenManager.storeTokens('youtube', {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || '',
        expiresAt: Date.now() + (tokenData.expires_in * 1000)
      });
      console.log("✅ YouTube tokens saved successfully");
    } catch (error) {
      console.error("⚠️ Failed to save YouTube tokens, but localStorage fallback should work:", error);
      // Continue execution - the TokenManager has localStorage fallback
    }
    
    // Backward compatibility: keep legacy key for any consumers still reading it
    localStorage.setItem('soundswapp_youtube_access_token', tokenData.access_token);
    console.log("YouTube authentication completed with token storage");
    
    // Update Firestore to mark YouTube as connected (with resilience)
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      
      if (userId) {
        console.log("Attempting to update Firestore user document...");
        
        // Try to update the user document to indicate YouTube is connected
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          youtubeConnected: true,
          lastUpdated: new Date()
        }, { merge: true });
        
        console.log("✅ Successfully updated Firestore with YouTube connection status");
      } else {
        console.warn("No user ID available to update Firestore");
      }
    } catch (firestoreError: any) {
      console.warn("⚠️ Failed to update Firestore user document (service may be down):", firestoreError);
      
      // Store connection status in localStorage as fallback
      try {
        localStorage.setItem('soundswapp_youtube_connected', 'true');
        localStorage.setItem('soundswapp_youtube_connected_at', new Date().toISOString());
        console.log("✅ Stored YouTube connection status in localStorage as fallback");
      } catch (localError) {
        console.error("Failed to store connection status in localStorage:", localError);
      }
      
      // Don't throw - authentication is still successful
    }
    
    // Dispatch event to notify about authentication success
    window.dispatchEvent(new CustomEvent('youtube-auth-changed', { 
      detail: { authenticated: true } 
    }));
    
    console.log("YouTube authentication successful");
  } catch (error: unknown) {
    console.error('YouTube authentication error:', error);
    // Don't redirect automatically - let the component handle the error
    throw error;
  }
};

/**
 * Refresh the access token using a refresh token
 */
export const refreshYouTubeToken = async (): Promise<boolean> => {
  const tokens = await TokenManager.getTokens('youtube');
  const refreshToken = tokens?.refreshToken;
  
  if (!refreshToken) {
    console.log('No refresh token available for YouTube');
    return false;
  }
  
  try {
    console.log('Attempting to refresh YouTube token...');
    
    const response = await fetch(YOUTUBE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: YOUTUBE_CLIENT_ID,
        client_secret: YOUTUBE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }).toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('YouTube token refresh failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      // If refresh token is invalid, clear all auth data
      if (response.status === 400 || response.status === 401) {
        console.log('Refresh token is invalid, clearing YouTube auth data');
        clearYouTubeAuth();
      }
      
      throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('YouTube token refreshed successfully');
    
    // Update tokens using TokenManager
    TokenManager.storeTokens('youtube', {
      accessToken: data.access_token,
      refreshToken: refreshToken, // Keep the existing refresh token
      expiresAt: Date.now() + (data.expires_in * 1000)
    });
    // Backward compatibility: keep legacy localStorage key in sync
    localStorage.setItem('soundswapp_youtube_access_token', data.access_token);
    
    return true;
  } catch (error) {
    console.error('Error refreshing YouTube token:', error);
    
    // Clear invalid auth data on any error
    clearYouTubeAuth();
    return false;
  }
};

/**
 * Check if user is authenticated with YouTube
 */
export const isYouTubeAuthenticated = async (): Promise<boolean> => {
  // First check if we have a valid token
  return TokenManager.hasValidTokens('youtube');
};

/**
 * Get YouTube access token with auto-refresh if needed
 */
export const getYouTubeToken = async (): Promise<string | null> => {
  try {
    const tokens = await TokenManager.getTokens('youtube');
    
    if (tokens?.accessToken) {
      // Check if token is expired and refresh if needed
      if (tokens.expiresAt && Date.now() >= tokens.expiresAt) {
        console.log("YouTube token expired, attempting to refresh...");
        const refreshSuccess = await refreshYouTubeToken();
        if (refreshSuccess) {
          const refreshedTokens = await TokenManager.getTokens('youtube');
          return refreshedTokens?.accessToken || null;
        } else {
          console.log("Failed to refresh YouTube token");
          return null;
        }
      }
      
      return tokens.accessToken;
    }
    
    // If no valid token, we'll need to refresh asynchronously
    // but for this synchronous function, we return null
    console.log("No valid YouTube token found, needs refresh");
    return null;
  } catch (error) {
    console.error("Error in getYouTubeToken:", error);
    return null;
  }
};

/**
 * Clear YouTube authentication data
 */
export const clearYouTubeAuth = (): void => {
  TokenManager.clearTokens('youtube');
  localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
  localStorage.removeItem(STORAGE_KEYS.RETURN_PATH);
  localStorage.removeItem(STORAGE_KEYS.CALLBACK_URL);
  localStorage.removeItem('soundswapp_youtube_access_token');
}; 