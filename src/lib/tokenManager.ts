import { auth, db } from './firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

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

class TokenManager {
  private static readonly REFRESH_BUFFER = 5 * 60; // 5 minutes before expiration
  private static readonly CHECK_INTERVAL = 60 * 1000; // Check every minute
  private static refreshTimers: Map<string, NodeJS.Timeout> = new Map();
  private static listeners: Map<string, Set<(status: TokenStatus) => void>> = new Map();

  // Enhanced token storage with better error handling
  static async storeTokens(service: 'spotify' | 'youtube', tokens: ServiceTokens): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('[TokenManager] No authenticated user, storing in localStorage only');
        localStorage.setItem(`${service}_tokens`, JSON.stringify(tokens));
        return;
      }

      // Store in both localStorage and Firestore for redundancy
      localStorage.setItem(`${service}_tokens`, JSON.stringify(tokens));
      
      const tokenRef = doc(db, 'users', user.uid, 'tokens', service);
      await setDoc(tokenRef, {
        ...tokens,
        updatedAt: Date.now(),
        userId: user.uid
      });

      console.log(`[TokenManager] Tokens stored for ${service}`);
      
      // Start automatic refresh monitoring
      this.startTokenMonitoring(service, tokens);
      
    } catch (error) {
      console.error(`[TokenManager] Failed to store tokens for ${service}:`, error);
      // Fallback to localStorage only
      localStorage.setItem(`${service}_tokens`, JSON.stringify(tokens));
    }
  }

  // Enhanced token retrieval with automatic refresh
  static async getTokens(service: 'spotify' | 'youtube'): Promise<ServiceTokens | null> {
    try {
      const user = auth.currentUser;
      let tokens: ServiceTokens | null = null;

      // Try Firestore first, then localStorage
      if (user) {
        try {
          const tokenRef = doc(db, 'users', user.uid, 'tokens', service);
          const tokenDoc = await getDoc(tokenRef);
          if (tokenDoc.exists()) {
            tokens = tokenDoc.data() as ServiceTokens;
          }
        } catch (error) {
          console.warn(`[TokenManager] Firestore retrieval failed for ${service}, trying localStorage`);
        }
      }

      // Fallback to localStorage
      if (!tokens) {
        const localTokens = localStorage.getItem(`${service}_tokens`);
        if (localTokens) {
          tokens = JSON.parse(localTokens);
        }
      }

      if (!tokens) {
        return null;
      }

      // Check if token needs refresh
      const status = this.getTokenStatus(tokens);
      
      if (status.needsRefresh) {
        console.log(`[TokenManager] Token for ${service} needs refresh, attempting automatic refresh`);
        const refreshedTokens = await this.refreshTokens(service, tokens.refreshToken);
        if (refreshedTokens) {
          await this.storeTokens(service, refreshedTokens);
          return refreshedTokens;
        } else {
          console.warn(`[TokenManager] Failed to refresh tokens for ${service}`);
          return null;
        }
      }

      return tokens;
    } catch (error) {
      console.error(`[TokenManager] Error getting tokens for ${service}:`, error);
      return null;
    }
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
        
        const response = await fetch(`/api/auth/${service}/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (response.ok) {
          const data = await response.json();
          const newTokens: ServiceTokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token || refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
            scope: data.scope
          };

          console.log(`[TokenManager] Successfully refreshed ${service} tokens`);
          return newTokens;
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP ${response.status}: ${errorData.error || 'Unknown error'}`);
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

  // Cleanup and token removal
  static async removeTokens(service: 'spotify' | 'youtube'): Promise<void> {
    try {
      // Clear timers
      const timer = this.refreshTimers.get(service);
      if (timer) {
        clearTimeout(timer);
        this.refreshTimers.delete(service);
      }

      // Remove from storage
      localStorage.removeItem(`${service}_tokens`);
      
      const user = auth.currentUser;
      if (user) {
        const tokenRef = doc(db, 'users', user.uid, 'tokens', service);
        await deleteDoc(tokenRef);
      }

      // Notify listeners
      this.notifyListeners(service, { isValid: false, expiresIn: 0, needsRefresh: false });
      
      console.log(`[TokenManager] Tokens removed for ${service}`);
    } catch (error) {
      console.error(`[TokenManager] Error removing tokens for ${service}:`, error);
    }
  }

  // Legacy method for backward compatibility
  static clearTokens(service: 'spotify' | 'youtube'): void {
    console.warn(`[TokenManager] clearTokens is deprecated, use removeTokens instead`);
    this.removeTokens(service).catch(error => {
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

export default TokenManager; 