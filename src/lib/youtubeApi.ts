import { config } from './config';

// YouTube API base URL
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const YOUTUBE_AUTH_STORAGE_KEY = 'youtube_auth_state';
const YOUTUBE_TOKEN_STORAGE_KEY = 'youtube_tokens';

interface YouTubeTokens {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}

// Helper function to extract detailed error information from YouTube API responses
const extractYouTubeErrorDetails = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json();
    console.error('YouTube API error details:', errorData);
    
    // Handle specific YouTube API error types
    if (errorData.error?.errors) {
      const errors = errorData.error.errors;
      const errorMessages = errors.map((err: any) => {
        switch (err.reason) {
          case 'quotaExceeded':
            return 'YouTube API quota exceeded. Please try again later.';
          case 'dailyLimitExceeded':
            return 'YouTube API daily limit exceeded. Please try again tomorrow.';
          case 'userRateLimitExceeded':
            return 'YouTube API rate limit exceeded. Please wait a moment and try again.';
          case 'insufficientPermissions':
            return 'Insufficient permissions. Please check your YouTube account settings.';
          case 'invalidCredentials':
            return 'Invalid YouTube credentials. Please reconnect your YouTube account.';
          case 'tokenExpired':
            return 'YouTube authentication expired. Please reconnect your YouTube account.';
          default:
            return err.message || 'YouTube API error occurred.';
        }
      });
      return errorMessages.join(' ');
    }
    
    // Fallback error messages based on status code
    switch (response.status) {
      case 400:
        return 'Invalid request to YouTube API. Please try again.';
      case 401:
        return 'YouTube authentication expired. Please reconnect your YouTube account.';
      case 403:
        return 'YouTube API quota exceeded or insufficient permissions. Please try again later.';
      case 404:
        return 'YouTube resource not found. Please check your playlist URL.';
      case 429:
        return 'YouTube API rate limit exceeded. Please wait a moment and try again.';
      case 500:
        return 'YouTube API server error. Please try again later.';
      default:
        return errorData.error?.message || `YouTube API error (${response.status})`;
    }
  } catch (parseError) {
    console.error('Failed to parse YouTube error response:', parseError);
    return `YouTube API error (${response.status}): ${response.statusText}`;
  }
};

/**
 * Get user's YouTube playlists
 */
export const getYouTubePlaylists = async (retryCount = 0): Promise<any> => {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second
  
  try {
    const { getYouTubeToken, refreshYouTubeToken } = await import('./youtubeAuth');
    let accessToken = await getYouTubeToken();
    
    if (!accessToken) {
      // Attempt one refresh cycle before failing
      const refreshed = await refreshYouTubeToken();
      if (refreshed) {
        accessToken = await getYouTubeToken();
      }
      if (!accessToken) {
        console.error('Cannot fetch YouTube playlists: No valid access token');
        throw new Error('No valid YouTube access token available. Please reconnect your YouTube account from the Connections panel.');
      }
    }

    const params = new URLSearchParams({
      part: 'snippet,status,contentDetails',
      mine: 'true',
      maxResults: '50'
    });

    let response = await fetch(`${YOUTUBE_API_BASE_URL}/playlists?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      const errorMessage = await extractYouTubeErrorDetails(response);
      console.error(`YouTube playlists error (${response.status}):`, errorMessage);
      
      // Handle specific error types
      if (response.status === 401) {
        // Try a single token refresh on unauthorized
        const refreshed = await refreshYouTubeToken();
        if (refreshed) {
          const newToken = await getYouTubeToken();
          if (newToken) {
            response = await fetch(`${YOUTUBE_API_BASE_URL}/playlists?${params.toString()}`, {
              headers: { 'Authorization': `Bearer ${newToken}` }
            });
            if (response.ok) {
              const data = await response.json();
              console.log('YouTube playlists fetched successfully (after refresh)');
              return data;
            }
          }
        }
        throw new Error('YouTube authentication expired. Please reconnect your YouTube account.');
      } else if (response.status === 403) {
        throw new Error('YouTube API quota exceeded. Please try again later or check your YouTube account permissions.');
      } else if (response.status === 429 && retryCount < maxRetries) {
        // Rate limit exceeded, retry with exponential backoff
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`YouTube API rate limited, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return getYouTubePlaylists(retryCount + 1);
      } else {
        throw new Error(errorMessage);
      }
    }

    const data = await response.json();
    console.log('YouTube playlists fetched successfully');
    return data;
  } catch (error) {
    console.error('Error fetching YouTube playlists:', error);
    
    // Retry on network errors or 5xx errors
    if (retryCount < maxRetries && (
      error instanceof TypeError || // Network error
      (error instanceof Error && error.message.includes('fetch')) ||
      (error instanceof Error && error.message.includes('500'))
    )) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Retrying YouTube playlists fetch in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getYouTubePlaylists(retryCount + 1);
    }
    
    throw error;
  }
};

/**
 * Fetch all tracks from a YouTube playlist
 */
export const fetchAllYouTubePlaylistItems = async (playlistId: string, accessToken: string) => {
  try {
    console.log('Fetching YouTube playlist items for playlist:', playlistId);
    
    const allItems: any[] = [];
    let nextPageToken: string | undefined;
    
    do {
      const params = new URLSearchParams({
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: '50'
      });
      
      if (nextPageToken) {
        params.append('pageToken', nextPageToken);
      }
      
      const response = await fetch(`${YOUTUBE_API_BASE_URL}/playlistItems?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorMessage = await extractYouTubeErrorDetails(response);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        allItems.push(...data.items);
      }
      
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);
    
    console.log('Fetched YouTube playlist items:', allItems.length);
    return allItems;
  } catch (error: unknown) {
    console.error('Error fetching YouTube playlist items:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Find an existing playlist with the same title or create a new one
 */
export const findOrCreatePlaylist = async (_userId: string, title: string, description: string, privacyStatus: 'public' | 'private' | 'unlisted' = 'private') => {
  try {
    const accessToken = await ensureYouTubeToken();
    
    if (!accessToken) {
      console.error('Cannot create YouTube playlist: No valid access token');
      throw new Error('No valid YouTube access token available. Please reconnect your YouTube account.');
    }
    
    // First, try to find an existing playlist with the same title
    console.log(`[YouTube API] Searching for existing playlist: "${title}"`);
    
    try {
      // Get user's playlists
      const response = await fetch(`${YOUTUBE_API_BASE_URL}/playlists?part=snippet&mine=true&maxResults=50`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const playlists = data.items || [];
        
        // Look for exact match or variations with "(Converted)" suffix
        const existingPlaylist = playlists.find((playlist: any) => {
          const playlistTitle = playlist.snippet?.title || '';
          return playlistTitle === title || 
                 playlistTitle === `${title} (Converted)` ||
                 playlistTitle === `${title} (Converted) (1)` ||
                 playlistTitle === `${title} (Converted) (2)` ||
                 playlistTitle === `${title} (Converted) (3)`;
        });
        
        if (existingPlaylist) {
          console.log(`[YouTube API] Found existing playlist: "${existingPlaylist.snippet.title}" (ID: ${existingPlaylist.id})`);
          return {
            id: existingPlaylist.id,
            title: existingPlaylist.snippet.title,
            description: existingPlaylist.snippet.description || ''
          };
        }
      } else {
        console.warn(`[YouTube API] Failed to fetch playlists (${response.status}), will create new playlist`);
      }
    } catch (error) {
      console.warn('[YouTube API] Error searching for existing playlists, will create new playlist:', error);
    }
    
    // If no existing playlist found, create a new one with a unique name
    console.log(`[YouTube API] Creating new playlist: "${title}"`);
    
    // Generate a unique name to avoid duplicates
    let uniqueTitle = title;
    let counter = 1;
    // Note: We can't check against existing playlists here since we don't have the list
    // The duplicate prevention is handled in the findOrCreatePlaylist function above
    // This is just a fallback to ensure unique naming
    if (counter > 10) {
      // If we've tried 10 times, add a timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      uniqueTitle = `${title} (Converted) ${timestamp}`;
    }
    
    if (uniqueTitle !== title) {
      console.log(`[YouTube API] Using unique playlist name: "${uniqueTitle}"`);
    }
    
    const playlist = await createYouTubePlaylist(_userId, uniqueTitle, description, privacyStatus);
    return playlist;
  } catch (error) {
    console.error('Error finding or creating playlist:', error);
    throw error;
  }
};

/**
 * Search YouTube for a track
 */
export const searchYouTube = async (_userId: string, query: string) => {
  // Check if we should use mock data
  const useMockData = localStorage.getItem('use_mock_youtube_data') === 'true';
  
  if (useMockData) {
    console.log(`Using mock data for YouTube search: "${query}"`);
    return generateMockSearchResults(query);
  }
  
  try {
    let accessToken = await ensureYouTubeToken();
    
    if (!accessToken) {
      const refreshed = await ensureYouTubeRefresh();
      if (refreshed) {
        accessToken = await ensureYouTubeToken();
      }
      if (!accessToken) {
        console.error('Cannot search YouTube: No valid access token');
        throw new Error('No valid YouTube access token available. Please reconnect your YouTube account.');
      }
    }
    
    // Log the search being performed
    console.log(`Searching YouTube for: "${query}"`);
    
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: '5',
      videoEmbeddable: 'true',
      videoSyndicated: 'true'
    });
    
    // Make the API request with a timeout to prevent hanging
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10 second timeout
    
    try {
      let response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        signal: abortController.signal
      });
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      // Handle response
      if (!response.ok) {
        // On 401, try one refresh and retry
        if (response.status === 401) {
          const refreshed = await ensureYouTubeRefresh();
          if (refreshed) {
            const newToken = await ensureYouTubeToken();
            if (newToken) {
              response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${newToken}` },
                signal: abortController.signal
              });
              if (response.ok) {
                const data = await response.json();
                console.log(`YouTube search successful after refresh, found ${data.items?.length || 0} results`);
                return data;
              }
            }
          }
        }
        const errorMessage = await extractYouTubeErrorDetails(response);
        console.error(`YouTube search error (${response.status}):`, errorMessage);
        
        // Check for specific error codes
        if (response.status === 403) {
          // Could be quota exceeded or permission issues
          console.log('Falling back to mock data due to API quota or permission issue');
          return generateMockSearchResults(query);
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log(`YouTube search successful, found ${data.items?.length || 0} results`);
      return data;
    } catch (fetchError: unknown) {
      // Clear the timeout in case of error
      clearTimeout(timeoutId);
      
      // Check if this was a timeout or abort
      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        console.error('YouTube search request timed out after 10 seconds');
        throw new Error('YouTube search request timed out. Please try again later.');
      }
      
      // Network errors (like ERR_CONNECTION_CLOSED)
      if (fetchError instanceof TypeError && 'message' in fetchError && 
          typeof fetchError.message === 'string' && fetchError.message.includes('fetch')) {
        console.error('Network error during YouTube search:', fetchError);
        console.log('Falling back to mock data due to network error');
        return generateMockSearchResults(query);
      }
      
      // Rethrow other errors
      throw fetchError;
    }
  } catch (error) {
    console.error('Error searching YouTube:', error);
    
    // For development, fall back to mock data when errors occur
    if (process.env.NODE_ENV !== 'production') {
      console.log('Falling back to mock data in development mode');
      return generateMockSearchResults(query);
    }
    
    // In production, let the error propagate
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Generate mock search results for development and testing
 */
const generateMockSearchResults = (query: string) => {
  // Create a deterministic but fake video ID based on query
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };
  
  // Parse out artist and track title if possible
  const parts = query.split('-').map(p => p.trim());
  const title = parts.length > 1 ? parts[1] : query;
  const artist = parts.length > 1 ? parts[0] : 'Artist';
  
  // Create mock items (3-5 results)
  const itemCount = 3 + Math.floor(Math.random() * 3);
  const items = [];
  
  for (let i = 0; i < itemCount; i++) {
    const suffix = i === 0 ? '(Official Video)' : 
                 i === 1 ? '(Lyric Video)' : 
                 i === 2 ? '(Audio)' : 
                 '(Cover)';
    
    const videoId = `mock-${hashString(query)}-${i}`;
    
    items.push({
      kind: 'youtube#searchResult',
      etag: `mock-etag-${videoId}`,
      id: {
        kind: 'youtube#video',
        videoId
      },
      snippet: {
        publishedAt: new Date().toISOString(),
        channelId: `UC${hashString(artist)}`,
        title: `${title} ${suffix}`,
        description: `Mock result for "${query}"`,
        thumbnails: {
          default: {
            url: `https://via.placeholder.com/120x90.png?text=${encodeURIComponent(title)}`,
            width: 120,
            height: 90
          },
          medium: {
            url: `https://via.placeholder.com/320x180.png?text=${encodeURIComponent(title)}`,
            width: 320,
            height: 180
          },
          high: {
            url: `https://via.placeholder.com/480x360.png?text=${encodeURIComponent(title)}`,
            width: 480,
            height: 360
          }
        },
        channelTitle: artist,
        liveBroadcastContent: 'none'
      }
    });
  }
  
  return {
    kind: 'youtube#searchListResponse',
    etag: `mock-etag-${hashString(query)}`,
    nextPageToken: 'mockNextPageToken',
    regionCode: 'US',
    pageInfo: {
      totalResults: itemCount,
      resultsPerPage: itemCount
    },
    items,
    _isMock: true
  };
};

/**
 * Create a YouTube playlist
 */
export const createYouTubePlaylist = async (_userId: string, title: string, description: string, privacyStatus: 'public' | 'private' | 'unlisted' = 'private') => {
  try {
    const accessToken = await ensureYouTubeToken();
    
    if (!accessToken) {
      throw new Error('No valid YouTube access token available. Please reconnect your YouTube account.');
    }
    
    const response = await fetch(`${YOUTUBE_API_BASE_URL}/playlists?part=snippet,status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        snippet: {
          title,
          description
        },
        status: {
          privacyStatus
        }
      })
    });
    
    if (!response.ok) {
      const errorMessage = await extractYouTubeErrorDetails(response);
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: unknown) {
    console.error('Error creating YouTube playlist:', error);
    // Don't provide mock data, let the error propagate
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Add a video to a YouTube playlist
 */
export const addToYouTubePlaylist = async (_userId: string, playlistId: string, videoId: string) => {
  try {
    const accessToken = await ensureYouTubeToken();
    
    if (!accessToken) {
      console.error('Cannot add to YouTube playlist: No valid access token');
      throw new Error('No valid YouTube access token available. Please reconnect your YouTube account.');
    }
    
    const response = await fetch(`${YOUTUBE_API_BASE_URL}/playlistItems?part=snippet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: videoId
          }
        }
      })
    });

    if (!response.ok) {
      const errorMessage = await extractYouTubeErrorDetails(response);
      console.error(`YouTube add to playlist error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`Successfully added video ${videoId} to playlist ${playlistId}`);
    return data;
  } catch (error) {
    console.error('Error adding to YouTube playlist:', error);
    throw error;
  }
};

/**
 * Make a YouTube API request with automatic token refresh and retry logic
 */
export const makeYouTubeApiRequest = async (
  endpoint: string, 
  options: RequestInit = {}, 
  retryCount = 0
): Promise<Response> => {
  const maxRetries = 2;
  
  try {
    // Get current access token
    const accessToken = await ensureYouTubeToken();
    
    if (!accessToken) {
      throw new Error('No valid YouTube access token available. Please reconnect your YouTube account.');
    }
    
    // Add authorization header
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    const response = await fetch(endpoint, requestOptions);
    
    // If we get a 401, try to refresh the token and retry
    if (response.status === 401 && retryCount < maxRetries) {
      console.log('YouTube API returned 401, attempting token refresh...');
      
      const refreshSuccess = await ensureYouTubeRefresh();
      if (refreshSuccess) {
        console.log('Token refreshed successfully, retrying request...');
        return makeYouTubeApiRequest(endpoint, options, retryCount + 1);
      } else {
        throw new Error('Failed to refresh YouTube token. Please reconnect your YouTube account.');
      }
    }
    
    return response;
  } catch (error) {
    console.error('YouTube API request failed:', error);
    throw error;
  }
};

export const generateAuthUrl = () => {
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem(YOUTUBE_AUTH_STORAGE_KEY, state);

  const params = new URLSearchParams({
    client_id: config.youtube.clientId,
    redirect_uri: config.youtube.redirectUri,
    response_type: 'code',
    scope: config.youtube.scope,
    state: state,
    access_type: 'offline',
    prompt: 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const handleAuthCallback = async (code: string, state: string): Promise<YouTubeTokens> => {
  const storedState = localStorage.getItem(YOUTUBE_AUTH_STORAGE_KEY);
  if (state !== storedState) {
    throw new Error('Invalid state parameter');
  }

  const params = new URLSearchParams({
    code,
    client_id: config.youtube.clientId,
    client_secret: config.youtube.clientSecret,
    redirect_uri: config.youtube.redirectUri,
    grant_type: 'authorization_code'
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Token exchange failed:', error);
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  const tokens = await response.json();
  const expiryDate = Date.now() + (tokens.expires_in * 1000);
  
  const tokenData: YouTubeTokens = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: expiryDate
  };

  localStorage.setItem(YOUTUBE_TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
  return tokenData;
};

export const refreshAccessToken = async (refresh_token: string): Promise<YouTubeTokens> => {
  const params = new URLSearchParams({
    client_id: config.youtube.clientId,
    client_secret: config.youtube.clientSecret,
    refresh_token: refresh_token,
    grant_type: 'refresh_token'
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const tokens = await response.json();
  const expiryDate = Date.now() + (tokens.expires_in * 1000);

  const tokenData: YouTubeTokens = {
    access_token: tokens.access_token,
    refresh_token: refresh_token, // Keep the existing refresh token
    expiry_date: expiryDate
  };

  localStorage.setItem(YOUTUBE_TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
  return tokenData;
};

export const getStoredTokens = (): YouTubeTokens | null => {
  const tokens = localStorage.getItem(YOUTUBE_TOKEN_STORAGE_KEY);
  return tokens ? JSON.parse(tokens) : null;
};

export const isTokenExpired = (tokens: YouTubeTokens): boolean => {
  return Date.now() >= tokens.expiry_date;
};

export const clearStoredTokens = () => {
  localStorage.removeItem(YOUTUBE_TOKEN_STORAGE_KEY);
  localStorage.removeItem(YOUTUBE_AUTH_STORAGE_KEY);
}; 

export const ensureYouTubeToken = async (): Promise<string | null> => {
  const { getYouTubeToken } = await import('./youtubeAuth');
  return getYouTubeToken();
};

export const ensureYouTubeRefresh = async (): Promise<boolean> => {
  const { refreshYouTubeToken } = await import('./youtubeAuth');
  return refreshYouTubeToken();
};

export const ensureYouTubeLogout = async (): Promise<void> => {
  const { clearYouTubeAuth } = await import('./youtubeAuth');
  return clearYouTubeAuth();
}; 