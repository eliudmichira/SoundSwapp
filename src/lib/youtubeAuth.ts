import { youtubeConfig } from './env';

// YouTube OAuth endpoints
const YOUTUBE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const YOUTUBE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

// YouTube API credentials
const YOUTUBE_CLIENT_ID = youtubeConfig.clientId;
const YOUTUBE_CLIENT_SECRET = youtubeConfig.clientSecret; // Required for code flow
const YOUTUBE_REDIRECT_URI = 'https://soundswapp.firebaseapp.com/youtube-callback';

// YouTube API scopes
const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

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
  
  // Save state in localStorage instead of sessionStorage for better persistence
  localStorage.setItem('youtube_auth_state', state);
  
  // Also log the state for debugging
  console.log("Generated YouTube auth state:", state.substring(0, 5) + "...");
  
  return state;
};

/**
 * Generate the YouTube authorization URL for Authorization Code Flow
 * This is more secure than Implicit Flow for client-side applications
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
    
    // For client-side applications, this exchange should ideally happen on your backend
    // to protect your client secret. This is a simplified example.
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
 * Check if there's a preserved YouTube callback URL and extract the auth code
 * @returns The authorization code if found, null otherwise
 */
export const getPreservedCallback = (): { code: string; state: string } | null => {
  const callbackUrl = localStorage.getItem('youtube_callback_url');
  if (!callbackUrl) return null;

  try {
    const url = new URL(callbackUrl);
    const params = new URLSearchParams(url.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) return null;

    return { code, state };
  } catch (err) {
    console.error('Error parsing preserved callback URL:', err);
    return null;
  }
};

/**
 * Clear any preserved callback data
 */
export const clearPreservedCallback = (): void => {
  localStorage.removeItem('youtube_callback_url');
};

/**
 * Handle YouTube OAuth callback with proper error handling
 * This should be called in the YouTube callback page component
 */
export const handleYouTubeCallback = async (): Promise<void> => {
  try {
    console.log("YouTube callback handling started");
    
    // Get URL parameters - first check current URL, then preserved callback
    let authCode: string | null = null;
    let state: string | null = null;
    let error: string | null = null;

    // Check current URL first
    const urlParams = new URLSearchParams(window.location.search);
    authCode = urlParams.get('code');
    state = urlParams.get('state');
    error = urlParams.get('error');

    // If no code in URL, check for preserved callback
    if (!authCode) {
      const preserved = getPreservedCallback();
      if (preserved) {
        console.log("Found preserved callback data");
        authCode = preserved.code;
        state = preserved.state;
        // Clear the preserved data since we're using it
        clearPreservedCallback();
      }
    }
    
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
    // Check both sessionStorage and localStorage for flexibility
    const savedStateSession = sessionStorage.getItem('youtube_auth_state');
    const savedStateLocal = localStorage.getItem('youtube_auth_state');
    
    // Use whichever state value we can find
    const savedState = savedStateSession || savedStateLocal;
    
    console.log("Saved state check:", { 
      savedStateSession, 
      savedStateLocal, 
      receivedState: state 
    });
    
    // Clean up state from both storages
    sessionStorage.removeItem('youtube_auth_state');
    localStorage.removeItem('youtube_auth_state');
    
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
    
    if (!tokenData.access_token) {
      throw new Error('No access token received from token exchange');
    }
    
    console.log("Saving tokens to localStorage");
    // Save tokens
    saveYouTubeTokens(
      tokenData.access_token, 
      tokenData.expires_in, 
      tokenData.refresh_token
    );
    
    // Confirm tokens were saved
    const token = getYouTubeToken();
    const refreshToken = localStorage.getItem('youtube_refresh_token');
    console.log("Token verification:", { 
      accessTokenSaved: !!token, 
      refreshTokenSaved: !!refreshToken 
    });
    
    // Don't redirect automatically - let the component handle it
    // This solves race conditions with state updates
    return;
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
  const refreshToken = localStorage.getItem('youtube_refresh_token');
  
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
    
    // Update only the access token and its expiry
    localStorage.setItem('youtube_access_token', data.access_token);
    localStorage.setItem('youtube_token_expiry', (Date.now() + data.expires_in * 1000).toString());
    
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
  const token = getYouTubeToken();
  
  if (token) {
    console.log("YouTube auth: Valid token found");
    return true;
  }
  
  // Try to refresh the token if we have a refresh token
  const refreshToken = localStorage.getItem('youtube_refresh_token');
  if (refreshToken) {
    console.log("YouTube auth: Trying to refresh token");
    return await refreshYouTubeToken();
  }
  
  console.log("YouTube auth: No valid token or refresh token found");
  return false;
};

/**
 * Get YouTube access token from localStorage with auto-refresh if needed
 */
export const getYouTubeToken = (): string | null => {
  try {
    const token = localStorage.getItem('youtube_access_token');
    const expiry = localStorage.getItem('youtube_token_expiry');
    
    console.log("getYouTubeToken check:", { 
      has_token: !!token, 
      has_expiry: !!expiry,
      expiry_value: expiry ? new Date(parseInt(expiry, 10)).toISOString() : null,
      now: new Date().toISOString()
    });
    
    if (token && expiry) {
      // Check if token is still valid
      const expiryTime = parseInt(expiry, 10);
      const now = Date.now();
      const isValid = expiryTime > now;
      
      console.log("Token validity check:", { 
        expiry_time: expiryTime,
        now: now,
        is_valid: isValid,
        time_remaining_ms: expiryTime - now
      });
      
      if (isValid) {
        return token;
      } else {
        console.log("Token expired, needs refresh");
      }
    } else {
      console.log("No token or expiry found in localStorage");
    }
    
    return null;
  } catch (error) {
    console.error("Error in getYouTubeToken:", error);
    return null;
  }
};

/**
 * Save YouTube tokens to localStorage
 */
export const saveYouTubeTokens = (
  accessToken: string, 
  expiresIn: number, 
  refreshToken?: string
): void => {
  try {
    console.log("Saving tokens to localStorage", {
      has_access_token: !!accessToken,
      has_refresh_token: !!refreshToken,
      expires_in: expiresIn
    });
    
    localStorage.setItem('youtube_access_token', accessToken);
    localStorage.setItem('youtube_token_expiry', (Date.now() + expiresIn * 1000).toString());
    
    if (refreshToken) {
      localStorage.setItem('youtube_refresh_token', refreshToken);
    }
    
    // Verify storage worked
    const savedToken = localStorage.getItem('youtube_access_token');
    const savedExpiry = localStorage.getItem('youtube_token_expiry');
    const savedRefresh = localStorage.getItem('youtube_refresh_token');
    
    console.log("Tokens saved verification:", {
      access_token_saved: savedToken === accessToken,
      expiry_saved: !!savedExpiry,
      refresh_token_saved: refreshToken ? savedRefresh === refreshToken : true
    });
  } catch (error) {
    console.error("Error saving tokens to localStorage:", error);
    throw new Error(`Failed to save authentication tokens: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Clear YouTube authentication data from localStorage
 */
export const clearYouTubeAuth = (): void => {
  localStorage.removeItem('youtube_access_token');
  localStorage.removeItem('youtube_token_expiry');
  localStorage.removeItem('youtube_refresh_token');
  localStorage.removeItem('youtube_auth_state');
  // Potentially update AuthContext or trigger an event
};

/**
 * Make an authenticated request to the YouTube API
 */
export const youtubeApiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  // Ensure we have a valid token
  const token = await getAuthenticatedToken();
  
  if (!token) {
    throw new Error('Not authenticated with YouTube');
  }
  
  // Make the API request
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token might be invalid, try refreshing
      const refreshed = await refreshYouTubeToken();
      if (refreshed) {
        // Retry the request with the new token
        return youtubeApiRequest(url, options);
      }
      throw new Error('Authentication error: Unable to refresh token');
    }
    
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Helper to get an authenticated token, refreshing if necessary
 */
async function getAuthenticatedToken(): Promise<string | null> {
  // First check if we have a valid token
  let token = getYouTubeToken();
  
  // If no valid token, try to refresh
  if (!token) {
    const refreshed = await refreshYouTubeToken();
    if (refreshed) {
      token = getYouTubeToken();
    }
  }
  
  return token;
}

// Add this new function
export const getYouTubeUserProfile = async (): Promise<any | null> => {
  try {
    const token = await getAuthenticatedToken(); // Or getYouTubeToken() if preferred
    if (!token) {
      console.log('No YouTube token available for fetching user profile.');
      return null;
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching YouTube user profile:', response.status, errorData);
      if (response.status === 401 || response.status === 403) {
        clearYouTubeAuth(); // Token might be invalid/expired
      }
      return null;
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const profile = data.items[0].snippet;
      const stats = data.items[0].statistics;
      return {
        displayName: profile.title,
        imageUrl: profile.thumbnails?.default?.url, // or medium/high
        id: data.items[0].id,
        customUrl: profile.customUrl,
        subscriberCount: stats?.subscriberCount // Example of additional info if needed
      };
    } else {
      console.log('No channel found for the authenticated YouTube user.');
      return null;
    }
  } catch (error) {
    console.error('Exception fetching YouTube user profile:', error);
    return null;
  }
}; 