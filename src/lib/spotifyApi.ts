import { db as firebaseDb } from './firebase';
import { doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { spotifyConfig } from './env';
import { getSpotifyToken, getSpotifyTokenSync } from './spotifyAuth';
import TokenManager from './tokenManager';

// Type assertion for Firestore db
const db = firebaseDb as Firestore;

// Constants
const ENDPOINTS = {
  AUTH: 'https://accounts.spotify.com/authorize',
  TOKEN: 'https://accounts.spotify.com/api/token',
  BASE: 'https://api.spotify.com/v1'
};

const SPOTIFY_CONFIG = {
  CLIENT_ID: spotifyConfig.clientId,
  CLIENT_SECRET: spotifyConfig.clientSecret,
  REDIRECT_URI: spotifyConfig.redirectUri,
  SCOPES: [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private'
  ]
};

// Cache management
const CACHE = {
  DURATION: {
    PLAYLISTS: 3600000, // 1 hour in milliseconds
    TRACKS: 3600000,    // 1 hour in milliseconds
    ARTISTS: 86400000   // 24 hours in milliseconds
  },
  KEYS: {
    PLAYLISTS: 'spotify_playlists_cache',
    PLAYLISTS_TTL: 'spotify_playlists_cache_ttl',
    TRACKS_PREFIX: 'spotify_tracks_cache_',
    TRACKS_TTL_PREFIX: 'spotify_tracks_cache_ttl_',
    ARTISTS_PREFIX: 'spotify_artist_cache_',
    ARTISTS_TTL_PREFIX: 'spotify_artist_cache_ttl_',
    CODE_VERIFIER: 'spotify_code_verifier',
    TOKEN: 'spotify_access_token',
    TOKEN_EXPIRES: 'spotify_token_expires_at'
  }
};

// Types
export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  owner: string;
  url?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  artistIds: string[];
  artistImages: string[];
  genres: string[];
  album: string;
  duration_ms: number;
  popularity: number;
  explicit: boolean;
  releaseYear: string;
  searchQuery: string;
}

interface SpotifyErrorResponse {
  error?: {
    status?: number;
    message?: string;
  };
}

/**
 * Crypto helper functions for PKCE auth flow
 */
class CryptoHelper {
  static generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map(x => possible[x % possible.length])
    .join('');
  }

  static async sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await crypto.subtle.digest('SHA-256', data);
  }
  
  static base64UrlEncode(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  }

  static generateCodeVerifier(): string {
    return this.generateRandomString(64);
  }

  static async generateCodeChallenge(verifier: string): Promise<string> {
    const hashed = await this.sha256(verifier);
    return this.base64UrlEncode(hashed);
  }
}

/**
 * Cache management utility class
 */
class CacheManager {
  static get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static set<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static getTtl(key: string): number | null {
    const ttl = localStorage.getItem(key);
    return ttl ? Number(ttl) : null;
  }

  static setTtl(key: string, duration: number): void {
    localStorage.setItem(key, (Date.now() + duration).toString());
  }

  static isValid(key: string): boolean {
    const ttl = this.getTtl(key);
    return ttl !== null && Date.now() < ttl;
  }

  static getCached<T>(dataKey: string, ttlKey: string): T | null {
    if (this.isValid(ttlKey)) {
      return this.get<T>(dataKey);
    }
    return null;
  }

  static setWithTtl<T>(dataKey: string, ttlKey: string, data: T, duration: number): void {
    this.set(dataKey, data);
    this.setTtl(ttlKey, duration);
  }

  static invalidate(dataKey: string, ttlKey: string): void {
    localStorage.removeItem(dataKey);
    localStorage.removeItem(ttlKey);
  }
}

/**
 * API request handler with built-in retries and token refresh
 */
class SpotifyApiClient {
  private static readonly MAX_RETRIES = 2;
  public static artistCache: Record<string, any> = {};

  static async request<T>(
    url: string, 
    options: RequestInit = {}, 
    retryCount = 0
  ): Promise<T> {
    console.log(`[DEBUG] SpotifyApiClient.request(${url}) called, retry: ${retryCount}`);
    
    // Try both ways to get a token
    let accessToken: string | undefined = (await getSpotifyTokenSync()) || undefined;
    console.log(`[DEBUG] Token from getSpotifyTokenSync():`, accessToken ? 'Found' : 'Not found');
    
    if (!accessToken) {
      console.log(`[DEBUG] Trying async getSpotifyToken()...`);
      accessToken = (await getSpotifyToken()) || undefined;
      console.log(`[DEBUG] Token from getSpotifyToken():`, accessToken ? 'Found' : 'Not found');
    }
    
    if (!accessToken) {
      console.error(`[DEBUG] No valid Spotify access token available`);
      throw new Error('No valid Spotify access token available. Please reconnect.');
    }

    console.log(`[DEBUG] Using token: ${accessToken.substring(0, 20)}...`);

    // Ensure headers exist and convert to plain object if it's Headers instance
    const headers: Record<string, string> = {};
    
    // Copy existing headers if any
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (typeof options.headers === 'object') {
        Object.assign(headers, options.headers);
      }
    }
    
    // Add authorization header if not explicitly provided
    if (!Object.keys(headers).some(key => key.toLowerCase() === 'authorization')) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    // Replace the headers in options
    options.headers = headers;
    
    try {
      console.log(`[DEBUG] Making request to: ${url}`);
      const response = await fetch(url, options);
      console.log(`[DEBUG] Response status: ${response.status} ${response.statusText}`);
      
      // Handle successful response
      if (response.ok) {
        console.log(`[DEBUG] Request successful`);
        return await response.json();
      }
      
      // Handle token expiration with refresh
      if (response.status === 401 && retryCount < this.MAX_RETRIES) {
        console.log(`[DEBUG] Access token expired (401), refreshing...`);
        
        try {
          // Get current tokens from TokenManager
          const currentTokens = await TokenManager.getTokens('spotify');
          if (currentTokens?.refreshToken) {
            // Try to refresh using TokenManager
            const refreshedTokens = await TokenManager.refreshTokensPublic('spotify', currentTokens.refreshToken);
            if (refreshedTokens) {
              console.log(`[DEBUG] Token refresh successful, retrying request...`);
              // Update the authorization header with the new token
              Object.assign(options.headers, { 'Authorization': `Bearer ${refreshedTokens.accessToken}` });
              
              // Retry the request with the new token
              return this.request<T>(url, options, retryCount + 1);
            }
          }
        } catch (refreshError) {
          console.error(`[DEBUG] Token refresh failed:`, refreshError);
        }
        
        // If refresh failed, throw a specific error for auth issues
        throw new Error('Your Spotify session has expired. Please reconnect your Spotify account.');
      }
      
      // Extract error details from response
      const errorDetails = await this.parseErrorResponse(response);
      console.error(`[DEBUG] API request failed:`, errorDetails);
      
      throw new Error(errorDetails);
    } catch (error) {
      console.error(`[DEBUG] Request error:`, error);
      
      // If not our custom error from above, rethrow with better context
      if (!(error instanceof Error)) {
        throw new Error(`Unexpected error calling ${url}: ${error}`);
      }
      
      // Retry network errors
      if (error.message.includes('network') && retryCount < this.MAX_RETRIES) {
        console.log(`[DEBUG] Network error, retrying (${retryCount + 1}/${this.MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.request<T>(url, options, retryCount + 1);
      }
      
      throw error;
    }
  }

  static async parseErrorResponse(response: Response): Promise<string> {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    
    try {
      const errorData: SpotifyErrorResponse = await response.json();
      
      if (errorData?.error?.message) {
        errorMessage = `Spotify API Error: ${errorData.error.message}`;
      } else if (errorData?.error?.status) {
        // Provide more helpful messages for common error codes
        switch (errorData.error.status) {
          case 401:
            errorMessage = 'Authentication failed. Please reconnect to Spotify.';
            break;
          case 403:
            errorMessage = 'You do not have permission to access this resource.';
            break;
          case 404:
            errorMessage = 'Resource not found. It might be private or deleted.';
            break;
          case 429:
            errorMessage = 'Rate limit exceeded. Please try again later.';
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = 'Spotify service is currently unavailable. Please try again later.';
            break;
        }
      }
    } catch (e) {
      // If we can't parse the JSON, use the original error
      console.warn('Failed to parse Spotify error response:', e);
    }
    
    return errorMessage;
  }
  
  /**
   * Helper method for handling paginated results
   */
  static async getPaginated<T>(initialUrl: string, accessToken?: string): Promise<T[]> {
    let allItems: T[] = [];
    let nextUrl: string | undefined = initialUrl;
    
    while (nextUrl) {
      try {
        const options: RequestInit = {
          headers: {
            'Content-Type': 'application/json'
          } as Record<string, string>
        };
        
        // Add authorization if provided
        if (accessToken) {
          (options.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
        }
        
        const data: { items: T[]; next: string | null } = await this.request<{ items: T[]; next: string | null }>(nextUrl, options);
        allItems = [...allItems, ...data.items];
        nextUrl = (data.next === null ? undefined : data.next) as string | undefined;
      } catch (error) {
        throw error;
      }
    }
    
    return allItems;
  }
  
  /**
   * Get cached artist data or fetch from API
   */
  static async getArtistDetails(artistId: string, forceRefresh = false): Promise<any> {
    // Use in-memory cache first (fastest)
    if (!forceRefresh && this.artistCache[artistId]) {
      return this.artistCache[artistId];
    }
    
    // Try persistent cache next
    const cacheKey = `${CACHE.KEYS.ARTISTS_PREFIX}${artistId}`;
    const cacheTtlKey = `${CACHE.KEYS.ARTISTS_TTL_PREFIX}${artistId}`;
    
    if (!forceRefresh) {
      const cachedData = CacheManager.getCached<any>(cacheKey, cacheTtlKey);
      if (cachedData) {
        // Update in-memory cache
        this.artistCache[artistId] = cachedData;
        return cachedData;
      }
    }
    
    // Fetch from API
    try {
      const data = await this.request<any>(`${ENDPOINTS.BASE}/artists/${artistId}`);
      
      // Process artist data
      const processedData = {
        ...data,
        // Get the highest quality image available
        images: data.images?.sort((a: any, b: any) => b.width - a.width) || [],
        // Add a direct image URL for easier access
        imageUrl: data.images?.length > 0 ? data.images[0].url : null
      };
      
      // Save to both caches
      this.artistCache[artistId] = processedData;
      CacheManager.setWithTtl(cacheKey, cacheTtlKey, processedData, CACHE.DURATION.ARTISTS);
      
      return processedData;
    } catch (error) {
      console.error(`Error fetching artist ${artistId}:`, error);
      return null; // Return null instead of throwing to avoid cascading failures
    }
  }
}

/**
 * Authorization code flow with PKCE
 */
export class SpotifyAuth {
  /**
   * Generate the Spotify authorization URL with PKCE
   */
  static async getAuthUrl(): Promise<string> {
    const codeVerifier = CryptoHelper.generateCodeVerifier();
    localStorage.setItem(CACHE.KEYS.CODE_VERIFIER, codeVerifier);
    
    // Generate code challenge using S256 method (more secure)
    const codeChallenge = await CryptoHelper.generateCodeChallenge(codeVerifier);
  
  const params = new URLSearchParams({
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
    response_type: 'code',
      redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
      scope: SPOTIFY_CONFIG.SCOPES.join(' '),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    show_dialog: 'true'
  });
  
    return `${ENDPOINTS.AUTH}?${params.toString()}`;
  }

/**
 * Exchange authorization code for access token using PKCE
 */
  static async getAccessToken(code: string): Promise<any> {
    const codeVerifier = localStorage.getItem(CACHE.KEYS.CODE_VERIFIER);
  
  if (!codeVerifier) {
    throw new Error('Code verifier not found. Please try authenticating again.');
  }
  
    const authString = btoa(`${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`);
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
      redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    code_verifier: codeVerifier
  });
  
    const response = await fetch(ENDPOINTS.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authString}`
      },
      body: params.toString()
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Spotify token error response:', errorData);
      throw new Error(`Authentication failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store the token with expiration
    localStorage.setItem(CACHE.KEYS.TOKEN, data.access_token);
    localStorage.setItem(CACHE.KEYS.TOKEN_EXPIRES, 
                         (Date.now() + (data.expires_in * 1000)).toString());
    
    return data;
  }

/**
 * Save Spotify tokens to Firestore for a user
 */
  static async saveTokens(userId: string, tokens: any): Promise<void> {
  try {
    await setDoc(doc(db, 'users', userId, 'tokens', 'spotify'), {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    });
  } catch (error) {
    console.error('Error saving Spotify tokens:', error);
    throw error;
  }
  }

/**
 * Get Spotify tokens from Firestore for a user
 */
  static async getTokens(userId: string): Promise<SpotifyTokens> {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId, 'tokens', 'spotify'));
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Check if token is expired and needs refresh
      if (data.expiresAt < Date.now()) {
          return await this.refreshToken(userId, data.refreshToken);
      }
      
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt
      };
    }
    
    throw new Error('No Spotify tokens found');
  } catch (error) {
      // Don't log permission errors during initial setup
    if (!(error instanceof Error && error.message.includes('Missing or insufficient permissions'))) {
      console.error('Error getting Spotify tokens:', error);
    }
    throw error;
  }
  }

/**
 * Refresh Spotify access token
 */
  static async refreshToken(userId: string, refreshToken: string): Promise<SpotifyTokens> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
  });
    
    const authString = btoa(`${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`);
  
  try {
      const response = await fetch(ENDPOINTS.TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authString}`
      },
      body: params.toString()
    });
    
    if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
    }
    
    const data = await response.json();
    
      // Maintain the previous refresh token if a new one isn't provided
      const newRefreshToken = data.refresh_token || refreshToken;
      
      // Calculate the expiration time
      const expiresAt = Date.now() + data.expires_in * 1000;
      
      // Store in localStorage for getSpotifyTokenSync
      localStorage.setItem(CACHE.KEYS.TOKEN, data.access_token);
      localStorage.setItem(CACHE.KEYS.TOKEN_EXPIRES, expiresAt.toString());
      
      // Save to Firestore
    await setDoc(doc(db, 'users', userId, 'tokens', 'spotify'), {
      accessToken: data.access_token,
        refreshToken: newRefreshToken,
        expiresAt
    });
    
    return {
      accessToken: data.access_token,
        refreshToken: newRefreshToken,
        expiresAt
    };
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    throw error;
  }
  }
}

/**
 * Spotify API service for user data and playlists
 */
export class SpotifyService {
/**
 * Get user's Spotify profile
 */
  static async getProfile(): Promise<any> {
    return SpotifyApiClient.request(`${ENDPOINTS.BASE}/me`);
  }

  /**
   * Get user's Spotify playlists with caching
   */
  static async getPlaylists(forceRefresh = false): Promise<any> {
    // Use cache if available and not forcing refresh
    if (!forceRefresh) {
      const cached = CacheManager.getCached<any>(
        CACHE.KEYS.PLAYLISTS, 
        CACHE.KEYS.PLAYLISTS_TTL
      );
      
      if (cached) {
        console.log('Using cached Spotify playlists');
        return cached;
      }
    }
    
    console.log('Fetching Spotify playlists from API');
    const data = await SpotifyApiClient.request<any>(
      `${ENDPOINTS.BASE}/me/playlists?limit=50`
    );
    
    // Cache successful results
    CacheManager.setWithTtl(
      CACHE.KEYS.PLAYLISTS,
      CACHE.KEYS.PLAYLISTS_TTL,
      data,
      CACHE.DURATION.PLAYLISTS
    );
    
    return data;
  }

/**
 * Get tracks from a Spotify playlist
 */
  static async getPlaylistTracks(playlistId: string, forceRefresh = false): Promise<any[]> {
    // Check input
    if (!playlistId || typeof playlistId !== 'string') {
      throw new Error('Invalid playlist ID');
    }
    
    // Sanitize playlist ID (remove any URL parts)
    const cleanPlaylistId = playlistId.split(/[/?#]/)[0];
    
    // Use cache if available and not forcing refresh
    const cacheKey = `${CACHE.KEYS.TRACKS_PREFIX}${cleanPlaylistId}`;
    const cacheTtlKey = `${CACHE.KEYS.TRACKS_TTL_PREFIX}${cleanPlaylistId}`;
    
    if (!forceRefresh) {
      const cached = CacheManager.getCached<any[]>(cacheKey, cacheTtlKey);
      if (cached) {
        console.log('Using cached Spotify tracks for playlist:', cleanPlaylistId);
        return cached;
      }
    }
    
    // Use pagination helper to get all tracks
    const tracksEndpoint = `${ENDPOINTS.BASE}/playlists/${cleanPlaylistId}/tracks?limit=100`;
    const allTracks = await SpotifyApiClient.getPaginated<any>(tracksEndpoint);
    
    if (allTracks.length === 0) {
      throw new Error('No tracks found in this playlist. It might be empty or you may not have access to it.');
    }
    
    // Cache valid results
    CacheManager.setWithTtl(cacheKey, cacheTtlKey, allTracks, CACHE.DURATION.TRACKS);
    
    return allTracks;
  }

  /**
   * Extract and enrich track data for matching and insights
   */
  static async extractTrackData(spotifyTracks: any[]): Promise<SpotifyTrack[]> {
    // Process in parallel with limit (to avoid rate limiting)
    const BATCH_SIZE = 5;
    const results: SpotifyTrack[] = [];
    
    for (let i = 0; i < spotifyTracks.length; i += BATCH_SIZE) {
      const batch = spotifyTracks.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (item) => {
        try {
          const track = item.track;
          if (!track || !track.id) {
            console.warn('Invalid track data:', item);
            return null;
          }
          
          // Create basic track data first
          const basicTrack: SpotifyTrack = {
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist: any) => artist.name),
            artistIds: track.artists.map((artist: any) => artist.id),
            artistImages: [],
            genres: [],
            album: track.album.name,
            duration_ms: track.duration_ms,
            popularity: track.popularity,
            explicit: track.explicit,
            releaseYear: track.album && track.album.release_date ? track.album.release_date.slice(0, 4) : '',
            searchQuery: `${track.name} ${track.artists.map((a: any) => a.name).join(' ')}`
          };
          
          // Try to enrich with artist details, but don't fail if it doesn't work
          try {
            const artistIds = track.artists.map((artist: any) => artist.id);
            const artistPromises = artistIds.map((id: string) => 
              SpotifyApiClient.getArtistDetails(id).catch(err => {
                console.warn(`Failed to get artist details for ${id}:`, err);
                return null;
              })
            );
            
            // Process artists in parallel with timeout
            const timeoutPromise = new Promise<any[]>((_, reject) => 
              setTimeout(() => reject(new Error('Artist details request timed out')), 10000)
            );
            
            const artistsData = await Promise.race([
              Promise.all(artistPromises),
              timeoutPromise
            ]);
            
            // Collect genres and images from artist data
            const genres: string[] = [];
            const artistImages: string[] = [];
            
            artistsData.forEach(artist => {
              if (artist) {
                if (artist.genres && artist.genres.length) {
                  genres.push(...artist.genres);
                }
                if (artist.images && artist.images.length) {
                  artistImages.push(artist.images[0].url);
                }
              }
            });
            
            // Update the track with enriched data
            basicTrack.artistImages = artistImages;
            basicTrack.genres = Array.from(new Set(genres)); // Remove duplicates
          } catch (artistError) {
            console.warn('Failed to enrich track with artist details:', artistError);
            // Continue with basic track data
          }
          
          return basicTrack;
        } catch (error) {
          console.error('Error processing track:', error);
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(Boolean) as SpotifyTrack[]);
    }
    
    return results;
  }

  /**
   * Get a single Spotify playlist by ID
   */
  static async getPlaylistById(playlistId: string): Promise<SpotifyPlaylist> {
    const data = await SpotifyApiClient.request<any>(
      `${ENDPOINTS.BASE}/playlists/${playlistId}`
    );
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      imageUrl: data.images && data.images[0] ? data.images[0].url : '',
      trackCount: data.tracks ? data.tracks.total : 0,
      owner: data.owner ? data.owner.display_name : '',
      url: data.external_urls?.spotify
    };
  }

  /**
   * Create a new Spotify playlist
   */
  static async createPlaylist(
    name: string, 
    description: string = '', 
    isPublic: boolean = false
  ): Promise<SpotifyPlaylist> {
    // Get the user's Spotify ID
    const profile = await SpotifyService.getProfile();
    const userId = profile.id;
    
    const response = await SpotifyApiClient.request<SpotifyPlaylist>(
      `${ENDPOINTS.BASE}/users/${userId}/playlists`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          public: isPublic
        })
      }
    );
    
    return response;
  }

  /**
   * Search for tracks on Spotify
   */
  static async searchTracks(query: string, limit: number = 5): Promise<any> {
    const params = new URLSearchParams({
      q: query,
      type: 'track',
      limit: limit.toString(),
      market: 'US' // You might want to make this configurable
    });
    
    const response = await SpotifyApiClient.request<any>(
      `${ENDPOINTS.BASE}/search?${params.toString()}`
    );
    
    return response;
  }

  /**
   * Add tracks to a Spotify playlist in optimized batches
   */
  static async addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<boolean> {
    // Validate inputs
    if (!playlistId) {
      throw new Error('Invalid playlist ID');
    }
    
    if (!trackUris || !trackUris.length) {
      console.warn('No tracks to add');
      return true;
    }
    
    // Add tracks in batches of 100 (Spotify API limit)
    const batchSize = 100;
    const totalBatches = Math.ceil(trackUris.length / batchSize);
    
    for (let i = 0; i < trackUris.length; i += batchSize) {
      const batchNumber = Math.floor(i / batchSize) + 1;
      console.log(`Adding tracks batch ${batchNumber}/${totalBatches}`);
      
      const batch = trackUris.slice(i, i + batchSize);
      
      await SpotifyApiClient.request(
        `${ENDPOINTS.BASE}/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: batch
          })
        }
      );
      
      // Add a small delay between batches to avoid rate limits
      if (batchNumber < totalBatches) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return true;
  }
  
  /**
   * Clear cache for this service
   */
  static clearCache(): void {
    // Clear playlist cache
    CacheManager.invalidate(CACHE.KEYS.PLAYLISTS, CACHE.KEYS.PLAYLISTS_TTL);
    
    // Clear track caches (using prefix pattern matching)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE.KEYS.TRACKS_PREFIX) || 
          key.startsWith(CACHE.KEYS.TRACKS_TTL_PREFIX) ||
          key.startsWith(CACHE.KEYS.ARTISTS_PREFIX) ||
          key.startsWith(CACHE.KEYS.ARTISTS_TTL_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear in-memory artist cache
    (SpotifyApiClient as any).artistCache = {};
    
    console.log('Spotify caches cleared');
  }
}

// Backward compatibility exports
export const getSpotifyAuthUrl = async (): Promise<string> => {
  return SpotifyAuth.getAuthUrl();
};

export const getSpotifyAccessToken = SpotifyAuth.getAccessToken;
export const saveSpotifyTokens = SpotifyAuth.saveTokens;
export const getSpotifyTokens = SpotifyAuth.getTokens;
export const refreshSpotifyToken = SpotifyAuth.refreshToken;
export const getSpotifyProfile = SpotifyService.getProfile;
export const getSpotifyPlaylists = async (accessToken: string): Promise<SpotifyPlaylist[]> => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.log('Spotify token expired in getSpotifyPlaylists, attempting refresh...');
        
        // Try to refresh the token
        const tokens = await TokenManager.getTokens('spotify');
        if (tokens) {
          const refreshedTokens = await TokenManager.refreshTokensPublic('spotify', tokens.refreshToken);
          if (refreshedTokens) {
            // Retry with refreshed token
            const retryResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
              headers: {
                'Authorization': `Bearer ${refreshedTokens.accessToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!retryResponse.ok) {
              if (retryResponse.status === 401) {
                // Refresh failed, clear tokens
                await TokenManager.removeTokens('spotify');
                throw new Error('Your Spotify session has expired. Please reconnect your Spotify account.');
              } else if (retryResponse.status === 403) {
                throw new Error('You do not have permission to access Spotify playlists. Please check your account settings and try reconnecting.');
              } else {
                throw new Error(`Failed to fetch playlists: ${retryResponse.status} ${retryResponse.statusText}`);
              }
            }
            
            const data = await retryResponse.json();
            return data.items || [];
          } else {
            // Refresh failed, clear tokens
            await TokenManager.removeTokens('spotify');
            throw new Error('Your Spotify session has expired. Please reconnect your Spotify account.');
          }
        } else {
          throw new Error('Your Spotify session has expired. Please reconnect your Spotify account.');
        }
      } else if (response.status === 403) {
        throw new Error('You do not have permission to access Spotify playlists. Please check your account settings and try reconnecting.');
      } else {
        throw new Error(`Failed to fetch playlists: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching Spotify playlists:', error);
    throw error;
  }
};
export const getSpotifyPlaylistTracks = SpotifyService.getPlaylistTracks;
export const extractTrackData = SpotifyService.extractTrackData;
export const createSpotifyPlaylist = SpotifyService.createPlaylist;
export const addTracksToSpotifyPlaylist = SpotifyService.addTracksToPlaylist;
export const getSpotifyPlaylistById = SpotifyService.getPlaylistById;
export const searchSpotifyTracks = SpotifyService.searchTracks;
export const generateCodeVerifier = CryptoHelper.generateCodeVerifier.bind(CryptoHelper);
export const generateCodeChallenge = CryptoHelper.generateCodeChallenge.bind(CryptoHelper);
export const saveCodeVerifier = (codeVerifier: string): void => {
  localStorage.setItem(CACHE.KEYS.CODE_VERIFIER, codeVerifier);
};
export const getCodeVerifier = (): string | null => {
  return localStorage.getItem(CACHE.KEYS.CODE_VERIFIER);
}; 