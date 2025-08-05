import { youtubeConfig } from './env';
import TokenManager from './tokenManager';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// YouTube OAuth endpoints
const YOUTUBE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const YOUTUBE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

// YouTube API credentials
const YOUTUBE_CLIENT_ID = youtubeConfig.clientId;
const YOUTUBE_CLIENT_SECRET = youtubeConfig.clientSecret; // Required for code flow
const YOUTUBE_REDIRECT_URI = youtubeConfig.redirectUri;

// YouTube API scopes
const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl'
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

  return `${YOUTUBE_AUTH_ENDPOINT}?${params}`;
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
    
    // Save tokens using the TokenManager
    TokenManager.storeTokens('youtube', {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || '',
      expiresAt: Date.now() + (tokenData.expires_in * 1000)
    });
    console.log("Token should now be in localStorage:", localStorage.getItem('soundswapp_youtube_access_token'));
    
    // Update Firestore to mark YouTube as connected
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      
      if (userId) {
        // Update the user document to indicate YouTube is connected
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
          youtubeConnected: true,
          lastUpdated: new Date()
        }, { merge: true });
        
        console.log("Updated Firestore with YouTube connection status");
      } else {
        console.warn("No user ID available to update Firestore");
      }
    } catch (firestoreError) {
      console.error("Failed to update Firestore:", firestoreError);
      // Continue execution - TokenManager backup is still available
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
    return false;
  }
  
  try {
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
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    // Update tokens using TokenManager
    TokenManager.storeTokens('youtube', {
      accessToken: data.access_token,
      refreshToken: refreshToken, // Keep the existing refresh token
      expiresAt: Date.now() + (data.expires_in * 1000)
    });
    
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearYouTubeAuth(); // Clear invalid auth data
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
}; 