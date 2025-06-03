// SoundCloud API requires OAuth2 for authentication
// Documentation: https://developers.soundcloud.com/docs/api/guide

// SoundCloud API constants
const SOUNDCLOUD_CLIENT_ID = import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID || '';
const SOUNDCLOUD_REDIRECT_URI = import.meta.env.VITE_SOUNDCLOUD_REDIRECT_URI || '';
const SOUNDCLOUD_AUTH_ENDPOINT = 'https://soundcloud.com/connect';

// Storage keys for tokens
const SC_ACCESS_TOKEN_KEY = 'soundcloud_access_token';
const SC_REFRESH_TOKEN_KEY = 'soundcloud_refresh_token';
const SC_EXPIRES_AT_KEY = 'soundcloud_expires_at';

/**
 * Generate the SoundCloud OAuth URL
 */
export const getSoundCloudAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: SOUNDCLOUD_CLIENT_ID,
    redirect_uri: SOUNDCLOUD_REDIRECT_URI,
    response_type: 'code',
    scope: 'non-expiring',
    state: generateRandomState()
  });

  return `${SOUNDCLOUD_AUTH_ENDPOINT}?${params.toString()}`;
};

/**
 * Generate a random string for state parameter to prevent CSRF attacks
 */
const generateRandomState = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Check if user is authenticated with SoundCloud
 */
export const isSoundCloudAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem(SC_ACCESS_TOKEN_KEY);
  const expiresAt = localStorage.getItem(SC_EXPIRES_AT_KEY);
  
  if (!accessToken) {
    return false;
  }
  
  // Check if token is expired
  if (expiresAt) {
    const now = Date.now();
    if (now > parseInt(expiresAt, 10)) {
      // Token is expired, try to refresh
      // This would be implemented with refreshSoundCloudToken()
      return false;
    }
  }
  
  return true;
};

/**
 * Initialize SoundCloud auth flow
 */
export const initSoundCloudAuth = (): void => {
  // Redirect to SoundCloud auth page
  window.location.href = getSoundCloudAuthUrl();
};

/**
 * Handle the auth callback from SoundCloud
 * This would be called in your callback route handler
 */
export const handleSoundCloudCallback = async (code: string): Promise<boolean> => {
  try {
    // This would be an API endpoint on your server that exchanges the code for tokens
    // Since SoundCloud API doesn't support CORS, this requires a server component
    // For demo purposes, we're stubbing this out
    console.log('Would exchange code for token:', code);
    
    // In a real implementation, you would:
    // 1. Make a request to your backend server
    // 2. Server exchanges code for tokens with SoundCloud
    // 3. Server returns tokens to client
    // 4. Client stores tokens in localStorage
    
    // For now, simulate success - in a real implementation, remove this mockup
    localStorage.setItem(SC_ACCESS_TOKEN_KEY, 'mock_token');
    localStorage.setItem(SC_EXPIRES_AT_KEY, (Date.now() + 3600 * 1000).toString());
    
    return true;
  } catch (error) {
    console.error('Error handling SoundCloud callback:', error);
    return false;
  }
};

/**
 * Get the stored SoundCloud token
 */
export const getSoundCloudToken = (): string | null => {
  return localStorage.getItem(SC_ACCESS_TOKEN_KEY);
};

/**
 * Log out from SoundCloud
 */
export const soundCloudLogout = (): void => {
  localStorage.removeItem(SC_ACCESS_TOKEN_KEY);
  localStorage.removeItem(SC_REFRESH_TOKEN_KEY);
  localStorage.removeItem(SC_EXPIRES_AT_KEY);
};

// This is a placeholder for the future implementation
export const fetchSoundCloudPlaylists = async () => {
  const token = getSoundCloudToken();
  if (!token) {
    throw new Error('Not authenticated with SoundCloud');
  }
  
  // This would make API calls to SoundCloud to fetch user playlists
  // Will be implemented when SoundCloud integration is fully supported
  return [];
}; 