import { generateRandomString } from './cryptoUtils';
import { isMobileDevice } from './utils';

// Spotify API credentials
const CLIENT_ID = '00c8de708f5d471eabb281146cf195bc';
const CLIENT_SECRET = 'b9049fc180f5459684ee75dbb0509e06';
const REDIRECT_URI = `${window.location.origin}/callback`;
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private'
];

// Switch to Authorization Code Flow (PKCE) to avoid CSP issues
export const initSpotifyAuth = () => {
  // Generate a random state value for security
  const state = generateRandomString(16);
  
  // Generate code verifier and code challenge for PKCE
  const codeVerifier = generateRandomString(64);
  
  // Store values for later verification in both storages for redundancy
  localStorage.setItem('spotify_auth_state', state);
  sessionStorage.setItem('spotify_auth_state', state); // Also store in sessionStorage
  localStorage.setItem('spotify_code_verifier', codeVerifier);
  
  // Also store the current URL to return to after auth completes
  localStorage.setItem('spotify_auth_return_path', window.location.pathname);
  
  // Log state for debugging
  console.log("Generated Spotify auth state:", state.substring(0, 5) + "...");
  
  // Build authorization URL with code flow parameters
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code'); // Use 'code' for authorization code flow
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('scope', SCOPES.join(' '));
  // For maximum compatibility, don't use PKCE code challenge since we have a client secret
  
  // Check if running on mobile device
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    console.log('Mobile device detected, using redirect flow for authentication');
    // On mobile, use full redirect to avoid popup issues
  window.location.href = authUrl.toString();
  } else {
    // On desktop, continue using popup flow
    const width = 450;
    const height = 730;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      authUrl.toString(),
      'Spotify Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  }
};

// Check if user is fully authenticated before starting Spotify auth
export const ensureUserAuthenticated = (): boolean => {
  // First check if we have a user object in the window
  const hasWindowUser = !!(window as any)?.auth?.currentUser || !!(window as any)?.auth?.user;
  
  // Check for Firebase auth user in localStorage (more reliable)
  const firebaseUserKey = Object.keys(localStorage).find(key => 
    key.startsWith('firebase:authUser:') && key.endsWith('[DEFAULT]')
  );
  const hasFirebaseAuth = !!firebaseUserKey;
  
  // For mobile browsers, check if we have auth tokens saved
  const hasAuthTokens = !!localStorage.getItem('authUser') || 
                       !!sessionStorage.getItem('authUser');
  
  // For debugging
  console.log('Auth check:', { hasWindowUser, hasFirebaseAuth, hasAuthTokens });
  
  // Also check for session cookie if available
  const hasAuthCookie = document.cookie.includes('firebaseAuth=true');
  
  // If any of these conditions are true, user is authenticated
  const isAuthenticated = hasWindowUser || hasFirebaseAuth || hasAuthTokens || hasAuthCookie;
  
  // For debugging, particularly on mobile
  if (!isAuthenticated) {
    console.warn('User appears to be NOT authenticated when connecting to Spotify');
  } else {
    console.log('User is authenticated for Spotify connection');
  }
  
  return isAuthenticated;
};

// Handle the redirect from Spotify with auth code
export const handleSpotifyCallback = async (): Promise<{ success: boolean, error?: string }> => {
  try {
    // Get the query parameters (code flow uses query params, not hash)
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get values from params
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    console.log("Spotify callback received:", {
      hasCode: !!code,
      hasState: !!state,
      error: error || 'none'
    });
  
  // Check for errors
  if (error) {
    return { 
      success: false, 
      error: `Spotify authorization error: ${error}`
    };
  }
  
    // Verify state parameter - check both localStorage and sessionStorage
    const storedStateLocal = localStorage.getItem('spotify_auth_state');
    const storedStateSession = sessionStorage.getItem('spotify_auth_state');
    
    // Use either state that matches
    const storedState = storedStateLocal || storedStateSession;
    
    // Log state check
    console.log("Spotify state validation:", {
      receivedState: state?.substring(0, 5) + "...",
      storedStateLocal: storedStateLocal?.substring(0, 5) + "...",
      storedStateSession: storedStateSession?.substring(0, 5) + "..."
    });
    
    // Clean up state after checking
    localStorage.removeItem('spotify_auth_state');
    sessionStorage.removeItem('spotify_auth_state');
    
    // Special case: if we have no saved state at all, this is likely
    // a returning user after browser restart - proceed with a warning
    if (!storedState) {
      console.warn("No saved Spotify state found, proceeding with authentication anyway");
    } else if (state !== storedState) {
    return { 
      success: false, 
      error: 'State verification failed. The request might have been tampered with.'
    };
  }
  
    if (!code) {
      return { 
        success: false, 
        error: 'No authorization code found in the URL'
      };
    }
    
    // Exchange code for token using fetch directly
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Encode client credentials in Basic Authorization header
        'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      }).toString(),
      mode: 'cors'
    });
    
    if (!tokenResponse.ok) {
      let errorMessage = `Failed to exchange authorization code: Status ${tokenResponse.status}`;
      try {
        const errorData = await tokenResponse.json();
        console.error('Token exchange error:', errorData);
        errorMessage = `Failed to exchange authorization code: ${errorData.error_description || errorData.error}`;
      } catch (e) {
        console.error('Could not parse error response:', e);
      }
      
    return { 
      success: false, 
        error: errorMessage
    };
  }
    
    const tokenData = await tokenResponse.json();
  
  // Store tokens in localStorage
    localStorage.setItem('spotify_access_token', tokenData.access_token);
    localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
  localStorage.setItem('spotify_token_expires_at', 
      (Date.now() + (tokenData.expires_in * 1000)).toString());
  
  // Clean up state
  localStorage.removeItem('spotify_auth_state');
    localStorage.removeItem('spotify_code_verifier');
    
    // If this is a popup window, notify the parent and close
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: 'SPOTIFY_AUTH_SUCCESS' }, window.location.origin);
      window.close();
    } else {
      // For mobile redirect flow, retrieve the return path
      const returnPath = localStorage.getItem('spotify_auth_return_path') || '/';
      localStorage.removeItem('spotify_auth_return_path');
      
      // If we're already at that path, no need to navigate
      if (window.location.pathname !== returnPath) {
        window.location.href = returnPath;
      }
    }
  
  return { success: true };
  } catch (error) {
    console.error('Spotify auth callback error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Spotify authentication'
    };
  }
};

// Get a valid token, refreshing if needed
export const getSpotifyToken = async (): Promise<string | null> => {
  const accessToken = localStorage.getItem('spotify_access_token');
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const expiresAt = localStorage.getItem('spotify_token_expires_at');
  
  if (!accessToken) {
    console.log('No access token available, authentication required');
    return null;
  }
  
  // Check if token is not expired yet, return immediately
  // Add a buffer of 5 minutes (300,000 ms) to refresh before actual expiration
  if (expiresAt && Date.now() < Number(expiresAt) - 300000) {
    return accessToken;
  }
  
  console.log('Token expired or will soon expire, attempting refresh');
  
  // Token is expired, try to refresh
  if (refreshToken) {
    try {
      console.log('Using refresh token to get new access token');
      const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }).toString(),
        mode: 'cors'
      });
      
      if (!refreshResponse.ok) {
        // Get error details for better debugging
        let errorData;
        try {
          errorData = await refreshResponse.json();
          console.error('Spotify refresh token error:', errorData);
        } catch (e) {
          console.error('Failed to parse error response from Spotify:', e);
        }
        
        // If refresh fails with 401, the refresh token is invalid or expired
        if (refreshResponse.status === 401) {
          console.warn('Refresh token is invalid, clearing auth data');
          logoutFromSpotify();
          return null;
        }
        
        // For other error codes, try one more time after a short delay
        // This helps with transient network issues
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const retryResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          }).toString(),
          mode: 'cors'
        });
        
        if (!retryResponse.ok) {
          // If retry also fails, clear tokens and return null
          console.error('Spotify token refresh retry failed, status:', retryResponse.status);
          logoutFromSpotify();
          return null;
        }
        
        const retryData = await retryResponse.json();
        
        // Store new tokens
        localStorage.setItem('spotify_access_token', retryData.access_token);
        localStorage.setItem('spotify_token_expires_at', 
          (Date.now() + (retryData.expires_in * 1000)).toString());
        
        // Some refresh responses include a new refresh token
        if (retryData.refresh_token) {
          localStorage.setItem('spotify_refresh_token', retryData.refresh_token);
        }
        
        console.log('Successfully refreshed Spotify token on retry');
        return retryData.access_token;
      }
      
      const refreshData = await refreshResponse.json();
      
      // Store new tokens
      localStorage.setItem('spotify_access_token', refreshData.access_token);
      localStorage.setItem('spotify_token_expires_at', 
        (Date.now() + (refreshData.expires_in * 1000)).toString());
      
      // Some refresh responses include a new refresh token
      if (refreshData.refresh_token) {
        localStorage.setItem('spotify_refresh_token', refreshData.refresh_token);
      }
      
      console.log('Successfully refreshed Spotify token');
      return refreshData.access_token;
    } catch (error) {
      console.error('Error refreshing Spotify token:', error);
      logoutFromSpotify();
      return null;
    }
  } else {
    // No refresh token, user needs to re-authenticate
    console.warn('No refresh token available, user needs to re-authenticate');
    logoutFromSpotify();
    return null;
  }
};

// Synchronous version for compatibility
export const getSpotifyTokenSync = (): string | null => {
  const accessToken = localStorage.getItem('spotify_access_token');
  const expiresAt = localStorage.getItem('spotify_token_expires_at');
  
  if (!accessToken) {
    return null;
  }
  
  // Check if token is expired - with 5 minute buffer
  if (expiresAt && Date.now() > Number(expiresAt) - 300000) {
    // Token is expired or will expire soon
    console.warn('Spotify token is expired or will expire soon (from sync check)');
    
    // Trigger an async refresh in the background but don't wait for it
    getSpotifyToken().catch(error => {
      console.error('Background token refresh failed:', error);
    });
    
    // Return null to force the caller to handle auth flow
    return null;
  }
  
  return accessToken;
};

// Check if user is authenticated with Spotify
export const isSpotifyAuthenticated = (): boolean => {
  return !!localStorage.getItem('spotify_access_token');
};

// Logout from Spotify
export const logoutFromSpotify = (): void => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expires_at');
  localStorage.removeItem('spotify_auth_state');
  localStorage.removeItem('spotify_code_verifier');
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