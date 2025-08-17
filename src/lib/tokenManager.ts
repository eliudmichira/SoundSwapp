import { auth, db } from './firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { spotifyConfig, youtubeConfig } from './env';

interface ServiceTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope?: string;
}

interface TokenStatus {
  isValid: boolean;
  expiresIn: number; // seconds until expiration
  needsRefresh: boolean;
}

export class TokenManager {
  private static readonly REFRESH_BUFFER = 5 * 60; // 5 minutes before expiration
  private static readonly CHECK_INTERVAL = 60 * 1000; // Check every minute
  private static refreshTimers: Map<string, NodeJS.Timeout> = new Map();
  private static listeners: Map<string, Set<(status: TokenStatus) => void>> = new Map();
  private static readonly LOCAL_STORAGE_PREFIX = 'soundswapp_tokens_';
  private static readonly FIRESTORE_RETRY_ATTEMPTS = 3;
  private static readonly FIRESTORE_RETRY_DELAY = 1000; // 1 second

  // Enhanced token storage with better error handling
  static async storeTokens(service: 'spotify' | 'youtube', tokens: ServiceTokens): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      console.error('[TokenManager] No authenticated user');
      throw new Error('No authenticated user');
    }

    console.log(`[TokenManager] Storing ${service} tokens for user:`, user.uid);
    
    // Always store in localStorage first as immediate fallback
    this.storeTokensLocally(service, tokens);
    console.log(`[TokenManager] ✅ Tokens stored locally for ${service}`);

    // Try Firestore with retries and graceful failure
    try {
      await this.storeTokensInFirestore(service, tokens, user.uid);
      console.log(`[TokenManager] ✅ Tokens stored in Firestore for ${service}`);
    } catch (error) {
      console.warn(`[TokenManager] ⚠️ Failed to store ${service} tokens in Firestore, using localStorage fallback:`, error);
      // Don't throw error - localStorage fallback is already in place
    }
  }

  /**
   * Store tokens in localStorage as fallback
   */
  private static storeTokensLocally(service: 'spotify' | 'youtube', tokens: ServiceTokens): void {
    try {
      const key = `${this.LOCAL_STORAGE_PREFIX}${service}`;
      const tokenData = {
        ...tokens,
        storedAt: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(tokenData));
      console.log(`[TokenManager] 🔍 localStorage storage test for ${service}:`, {
        key,
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        expiresAt: tokens.expiresAt
      });
    } catch (error) {
      console.error(`[TokenManager] Failed to store ${service} tokens in localStorage:`, error);
      throw error;
    }
  }

  /**
   * Store tokens in Firestore with retry logic
   */
  private static async storeTokensInFirestore(service: 'spotify' | 'youtube', tokens: ServiceTokens, userId: string): Promise<void> {
    for (let attempt = 1; attempt <= this.FIRESTORE_RETRY_ATTEMPTS; attempt++) {
      try {
        const tokenDoc = doc(db, 'users', userId, 'tokens', service);
        await setDoc(tokenDoc, {
          ...tokens,
          updatedAt: new Date().toISOString()
        });
        return; // Success
      } catch (error: any) {
        console.warn(`[TokenManager] Firestore attempt ${attempt}/${this.FIRESTORE_RETRY_ATTEMPTS} failed for ${service}:`, error);
        
        if (attempt === this.FIRESTORE_RETRY_ATTEMPTS) {
          throw error; // Final attempt failed
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, this.FIRESTORE_RETRY_DELAY * attempt));
      }
    }
  }

  // Enhanced token retrieval with automatic refresh
  static async getTokens(service: 'spotify' | 'youtube'): Promise<ServiceTokens | null> {
    const user = auth.currentUser;
    if (!user) {
      console.error('[TokenManager] No authenticated user');
      return null;
    }

    console.log(`[TokenManager] Getting ${service} tokens for user:`, user.uid);

    let tokens: ServiceTokens | null = null;

    // Try Firestore first
    try {
      tokens = await this.getTokensFromFirestore(service, user.uid);
      if (tokens) {
        console.log(`[TokenManager] ✅ Retrieved ${service} tokens from Firestore`);
      }
    } catch (error) {
      console.warn(`[TokenManager] ⚠️ Failed to get ${service} tokens from Firestore, trying localStorage:`, error);
    }

    // Fallback to localStorage
    if (!tokens) {
      try {
        tokens = this.getTokensFromLocalStorage(service);
        if (tokens) {
          console.log(`[TokenManager] ✅ Retrieved ${service} tokens from localStorage fallback`);
        }
      } catch (error) {
        console.warn(`[TokenManager] Failed to get ${service} tokens from localStorage:`, error);
      }
    }

    if (!tokens) {
      console.log(`[TokenManager] No ${service} tokens found in either Firestore or localStorage`);
      return null;
    }

    // Check if token needs refresh
    const status = this.getTokenStatus(tokens);
    if (status.needsRefresh && tokens.refreshToken) {
      console.log(`[TokenManager] Token for ${service} needs refresh, attempting automatic refresh`);
      try {
        const refreshedTokens = await this.refreshTokens(service, tokens.refreshToken);
        if (refreshedTokens) {
          // Store refreshed tokens (with fallback handling)
          await this.storeTokens(service, refreshedTokens);
          return refreshedTokens;
        }
      } catch (error) {
        console.warn(`[TokenManager] Failed to refresh tokens for ${service}:`, error);
        // Return existing tokens even if refresh failed
      }
    }

    return tokens;
  }

  /**
   * Get tokens from Firestore
   */
  private static async getTokensFromFirestore(service: 'spotify' | 'youtube', userId: string): Promise<ServiceTokens | null> {
    const tokenDoc = doc(db, 'users', userId, 'tokens', service);
    const docSnapshot = await getDoc(tokenDoc);
    return docSnapshot.exists() ? docSnapshot.data() as ServiceTokens : null;
  }

  /**
   * Get tokens from localStorage
   */
  private static getTokensFromLocalStorage(service: 'spotify' | 'youtube'): ServiceTokens | null {
    try {
      const key = `${this.LOCAL_STORAGE_PREFIX}${service}`;
      const stored = localStorage.getItem(key);
      console.log(`[TokenManager] 🔍 localStorage retrieval test for ${service}:`, {
        key,
        hasStoredData: !!stored,
        storedDataLength: stored?.length || 0
      });
      
      if (stored) {
        const data = JSON.parse(stored);
        console.log(`[TokenManager] 🔍 Retrieved token data for ${service}:`, {
          hasAccessToken: !!data.accessToken,
          hasRefreshToken: !!data.refreshToken,
          expiresAt: data.expiresAt,
          storedAt: data.storedAt
        });
        
        // Check if tokens are not too old (optional validation)
        if (data.storedAt && Date.now() - data.storedAt > 7 * 24 * 60 * 60 * 1000) { // 7 days
          console.warn(`[TokenManager] ${service} tokens in localStorage are older than 7 days`);
        }
        return data;
      }
    } catch (error) {
      console.error(`[TokenManager] Error reading ${service} tokens from localStorage:`, error);
    }
    return null;
  }

  // Proactive token status checking
  static getTokenStatus(tokens: ServiceTokens): TokenStatus {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = tokens.expiresAt - now;
    const needsRefresh = expiresIn <= this.REFRESH_BUFFER;

    return {
      isValid: expiresIn > 0,
      expiresIn,
      needsRefresh
    };
  }

  // Automatic background token monitoring
  private static startTokenMonitoring(service: 'spotify' | 'youtube', tokens: ServiceTokens): void {
    // Clear existing timer
    const existingTimer = this.refreshTimers.get(service);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const status = this.getTokenStatus(tokens);
    const timeUntilRefresh = Math.max(0, (status.expiresIn - this.REFRESH_BUFFER) * 1000);

    console.log(`[TokenManager] Starting monitoring for ${service}, refresh in ${Math.round(timeUntilRefresh / 1000)}s`);

    const timer = setTimeout(async () => {
      console.log(`[TokenManager] Auto-refreshing tokens for ${service}`);
      const refreshedTokens = await this.refreshTokens(service, tokens.refreshToken);
      if (refreshedTokens) {
        await this.storeTokens(service, refreshedTokens);
        this.notifyListeners(service, this.getTokenStatus(refreshedTokens));
      } else {
        console.error(`[TokenManager] Auto-refresh failed for ${service}`);
        this.notifyListeners(service, { isValid: false, expiresIn: 0, needsRefresh: false });
      }
    }, timeUntilRefresh);

    this.refreshTimers.set(service, timer);
  }

  // Enhanced token refresh with retry mechanism
  private static async refreshTokens(service: 'spotify' | 'youtube', refreshToken: string): Promise<ServiceTokens | null> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[TokenManager] Refreshing ${service} tokens, attempt ${attempt}/${maxRetries}`);
        
        let response: Response;
        
        if (service === 'spotify') {
          // Use direct Spotify API with correct credentials
          console.log('[TokenManager] Refreshing Spotify tokens with credentials:', {
            clientId: spotifyConfig.clientId ? `${spotifyConfig.clientId.substring(0, 10)}...` : 'MISSING',
            hasClientSecret: !!spotifyConfig.clientSecret
          });
          response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              client_id: spotifyConfig.clientId,
              client_secret: spotifyConfig.clientSecret
            }).toString()
          });
        } else if (service === 'youtube') {
          // Use direct Google API with correct credentials
          console.log('[TokenManager] Refreshing YouTube tokens with credentials:', {
            clientId: youtubeConfig.clientId ? `${youtubeConfig.clientId.substring(0, 10)}...` : 'MISSING',
            hasClientSecret: !!youtubeConfig.clientSecret
          });
          
          // Check for missing YouTube client secret
          if (!youtubeConfig.clientSecret) {
            throw new Error('YouTube client secret is missing from environment variables. Add VITE_YOUTUBE_CLIENT_SECRET to your .env file.');
          }
          
          response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              client_id: youtubeConfig.clientId,
              client_secret: youtubeConfig.clientSecret
            }).toString()
          });
        } else {
          throw new Error(`Unsupported service: ${service}`);
        }

        if (response.ok) {
          const data = await response.json();
          const newTokens: ServiceTokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token || refreshToken, // Keep old refresh token if new one not provided
            expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
            scope: data.scope
          };

          console.log(`[TokenManager] Successfully refreshed ${service} tokens`);
          return newTokens;
        } else {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || 'Unknown error';
          
          // Handle specific error cases
          if (response.status === 400 && errorMessage === 'invalid_grant') {
            console.log(`[TokenManager] Invalid grant for ${service}, tokens are permanently invalid`);
            // Clear tokens immediately for invalid_grant
            await this.deleteTokens(service);
            throw new Error(`HTTP ${response.status}: ${errorMessage} - Tokens are permanently invalid`);
          }
          
          if (response.status === 400 && errorMessage === 'invalid_client') {
            console.log(`[TokenManager] Invalid client error for ${service} - likely corrupted token format, clearing tokens`);
            // Clear tokens immediately for invalid_client (corrupted token format)
            await this.deleteTokens(service);
            throw new Error(`HTTP ${response.status}: ${errorMessage} - Tokens are corrupted and have been cleared`);
          }
          
          throw new Error(`HTTP ${response.status}: ${errorMessage}`);
        }
      } catch (error) {
        lastError = error as Error;
        console.warn(`[TokenManager] Refresh attempt ${attempt} failed for ${service}:`, error);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    console.error(`[TokenManager] All refresh attempts failed for ${service}:`, lastError);
    return null;
  }

  // Public method to refresh tokens
  static async refreshTokensPublic(service: 'spotify' | 'youtube', refreshToken: string): Promise<ServiceTokens | null> {
    return this.refreshTokens(service, refreshToken);
  }

  // Debug method to test token storage and retrieval
  static async testTokenStorage(service: 'spotify' | 'youtube'): Promise<void> {
    console.log(`[TokenManager] 🧪 Testing token storage and retrieval for ${service}`);
    
    const user = auth.currentUser;
    if (!user) {
      console.error('[TokenManager] No authenticated user for test');
      return;
    }

    // Test tokens
    const testTokens: ServiceTokens = {
      accessToken: 'test_access_token_123',
      refreshToken: 'test_refresh_token_456',
      expiresAt: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    };

    console.log(`[TokenManager] 🧪 Storing test tokens...`);
    await this.storeTokens(service, testTokens);

    console.log(`[TokenManager] 🧪 Retrieving test tokens...`);
    const retrieved = await this.getTokens(service);

    console.log(`[TokenManager] 🧪 Test results:`, {
      stored: testTokens,
      retrieved,
      matches: retrieved?.accessToken === testTokens.accessToken && 
               retrieved?.refreshToken === testTokens.refreshToken
    });
  }

  // Debug method to check current token storage state
  static async debugTokenStorage(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      console.log('[TokenManager] 🔍 No authenticated user');
      return;
    }

    console.log(`[TokenManager] 🔍 Debug token storage for user: ${user.uid}`);
    
    // Check localStorage
    const spotifyKey = `${this.LOCAL_STORAGE_PREFIX}spotify`;
    const youtubeKey = `${this.LOCAL_STORAGE_PREFIX}youtube`;
    
    const spotifyLocal = localStorage.getItem(spotifyKey);
    const youtubeLocal = localStorage.getItem(youtubeKey);
    
    console.log(`[TokenManager] 🔍 localStorage contents:`, {
      spotifyKey,
      hasSpotifyData: !!spotifyLocal,
      spotifyDataLength: spotifyLocal?.length || 0,
      youtubeKey,
      hasYoutubeData: !!youtubeLocal,
      youtubeDataLength: youtubeLocal?.length || 0
    });

    // Check Firestore
    try {
      const spotifyFirestore = await this.getTokensFromFirestore('spotify', user.uid);
      const youtubeFirestore = await this.getTokensFromFirestore('youtube', user.uid);
      
      console.log(`[TokenManager] 🔍 Firestore contents:`, {
        hasSpotifyTokens: !!spotifyFirestore,
        hasYoutubeTokens: !!youtubeFirestore,
        spotifyHasRefreshToken: !!spotifyFirestore?.refreshToken,
        youtubeHasRefreshToken: !!youtubeFirestore?.refreshToken
      });
    } catch (error) {
      console.error(`[TokenManager] 🔍 Error checking Firestore:`, error);
    }
  }

  // Manual cleanup function for corrupted tokens
  static async clearAllCorruptedTokens(): Promise<void> {
    console.log('[TokenManager] 🧹 Clearing all potentially corrupted tokens...');
    
    try {
      await this.deleteTokens('spotify');
      console.log('[TokenManager] ✅ Cleared Spotify tokens');
    } catch (error) {
      console.warn('[TokenManager] ⚠️ Failed to clear Spotify tokens:', error);
    }
    
    try {
      await this.deleteTokens('youtube');
      console.log('[TokenManager] ✅ Cleared YouTube tokens');
    } catch (error) {
      console.warn('[TokenManager] ⚠️ Failed to clear YouTube tokens:', error);
    }
    
    console.log('[TokenManager] 🎉 Token cleanup complete! Please reconnect your accounts.');
  }

  // Token status listeners for UI updates
  static addTokenListener(service: 'spotify' | 'youtube', callback: (status: TokenStatus) => void): () => void {
    if (!this.listeners.has(service)) {
      this.listeners.set(service, new Set());
    }
    
    this.listeners.get(service)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(service)?.delete(callback);
    };
  }

  private static notifyListeners(service: 'spotify' | 'youtube', status: TokenStatus): void {
    this.listeners.get(service)?.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error(`[TokenManager] Error in token listener for ${service}:`, error);
      }
    });
  }

  /**
   * Delete tokens with Firestore and localStorage cleanup
   */
  static async deleteTokens(service: 'spotify' | 'youtube'): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      console.error('[TokenManager] No authenticated user');
      return;
    }

    console.log(`[TokenManager] Deleting ${service} tokens for user:`, user.uid);

    // Delete from localStorage
    try {
      const key = `${this.LOCAL_STORAGE_PREFIX}${service}`;
      localStorage.removeItem(key);
      console.log(`[TokenManager] ✅ Deleted ${service} tokens from localStorage`);
    } catch (error) {
      console.warn(`[TokenManager] Failed to delete ${service} tokens from localStorage:`, error);
    }

    // Try to delete from Firestore (don't fail if Firestore is down)
    try {
      const tokenDoc = doc(db, 'users', user.uid, 'tokens', service);
      await deleteDoc(tokenDoc);
      console.log(`[TokenManager] ✅ Deleted ${service} tokens from Firestore`);
    } catch (error) {
      console.warn(`[TokenManager] ⚠️ Failed to delete ${service} tokens from Firestore (service may be down):`, error);
      // Don't throw - localStorage cleanup succeeded
    }
  }

  // Legacy method for backward compatibility
  static clearTokens(service: 'spotify' | 'youtube'): void {
    console.warn(`[TokenManager] clearTokens is deprecated, use deleteTokens instead`);
    this.deleteTokens(service).catch((error: any) => {
      console.error(`[TokenManager] Error in clearTokens for ${service}:`, error);
    });
  }

  // Get current token status for UI
  static async getCurrentTokenStatus(service: 'spotify' | 'youtube'): Promise<TokenStatus | null> {
    const tokens = await this.getTokens(service);
    if (!tokens) {
      return null;
    }
    return this.getTokenStatus(tokens);
  }

  // Check if valid tokens exist for a service
  static async hasValidTokens(service: 'spotify' | 'youtube'): Promise<boolean> {
    const tokens = await this.getTokens(service);
    if (!tokens) {
      return false;
    }
    const status = this.getTokenStatus(tokens);
    return status.isValid;
  }

  // Initialize monitoring for all services
  static async initializeMonitoring(): Promise<void> {
    const services: ('spotify' | 'youtube')[] = ['spotify', 'youtube'];
    
    for (const service of services) {
      const tokens = await this.getTokens(service);
      if (tokens) {
        this.startTokenMonitoring(service, tokens);
      }
    }
  }
}

// Expose debug methods globally for testing
if (typeof window !== 'undefined') {
  (window as any).TokenManagerDebug = {
    testStorage: TokenManager.testTokenStorage,
    debugStorage: TokenManager.debugTokenStorage,
    getTokens: TokenManager.getTokens,
    clearCorruptedTokens: TokenManager.clearAllCorruptedTokens
  };
}

export default TokenManager; 