export interface ServiceTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export class TokenManager {
  private static readonly STORAGE_PREFIX = 'soundswapp_';
  
  // Store tokens with consistent format for all services
  static storeTokens(service: 'spotify' | 'youtube', tokens: ServiceTokens): void {
    try {
      console.log(`[DEBUG] TokenManager.storeTokens(${service}):`, {
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        expiresAt: new Date(tokens.expiresAt).toISOString(),
        expiresIn: Math.round((tokens.expiresAt - Date.now()) / 1000) + 's'
      });
      
      // Store in localStorage with consistent naming
      localStorage.setItem(`${this.STORAGE_PREFIX}${service}_access_token`, tokens.accessToken);
      localStorage.setItem(`${this.STORAGE_PREFIX}${service}_expires_at`, tokens.expiresAt.toString());
      
      if (tokens.refreshToken) {
        localStorage.setItem(`${this.STORAGE_PREFIX}${service}_refresh_token`, tokens.refreshToken);
      }
      
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent(`${service}-token-updated`, { 
        detail: { hasToken: true } 
      }));
      
      console.log(`[DEBUG] ${service} tokens stored successfully`);
    } catch (error) {
      console.error(`[DEBUG] Error storing ${service} tokens:`, error);
    }
  }
  
  // Get tokens with validation and consistent format
  static getTokens(service: 'spotify' | 'youtube'): ServiceTokens | null {
    try {
      console.log(`[DEBUG] TokenManager.getTokens(${service}) called`);
      
      const accessToken = localStorage.getItem(`${this.STORAGE_PREFIX}${service}_access_token`);
      const expiresAtStr = localStorage.getItem(`${this.STORAGE_PREFIX}${service}_expires_at`);
      const refreshToken = localStorage.getItem(`${this.STORAGE_PREFIX}${service}_refresh_token`);
      
      console.log(`[DEBUG] Raw localStorage values:`, {
        hasAccessToken: !!accessToken,
        hasExpiresAt: !!expiresAtStr,
        hasRefreshToken: !!refreshToken,
        expiresAtStr
      });
      
      if (!accessToken || !expiresAtStr) {
        console.log(`[DEBUG] Missing required token data for ${service}`);
        return null;
      }
      
      const expiresAt = parseInt(expiresAtStr, 10);
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
      console.log(`[DEBUG] Token expiration check:`, {
        expiresAt: new Date(expiresAt).toISOString(),
        now: new Date(now).toISOString(),
        timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + 's',
        bufferTime: 5 * 60 * 1000 // 5 minutes
      });
      
      // Add 5-minute buffer to expiration time
      const isValid = now < (expiresAt - 5 * 60 * 1000);
      
      console.log(`[DEBUG] Token validity:`, { isValid });
      
      if (!isValid) {
        console.log(`[DEBUG] Token expired or expiring soon for ${service}`);
        return null;
      }
      
      console.log(`[DEBUG] Returning valid tokens for ${service}`);
      return {
        accessToken,
        refreshToken: refreshToken || undefined,
        expiresAt
      };
    } catch (error) {
      console.error(`[DEBUG] Error retrieving ${service} tokens:`, error);
      return null;
    }
  }
  
  // Check if tokens are valid
  static hasValidTokens(service: 'spotify' | 'youtube'): boolean {
    return this.getTokens(service) !== null;
  }
  
  // Clear tokens for a service
  static clearTokens(service: 'spotify' | 'youtube'): void {
    localStorage.removeItem(`${this.STORAGE_PREFIX}${service}_access_token`);
    localStorage.removeItem(`${this.STORAGE_PREFIX}${service}_expires_at`);
    localStorage.removeItem(`${this.STORAGE_PREFIX}${service}_refresh_token`);
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent(`${service}-token-updated`, { 
      detail: { hasToken: false } 
    }));
  }
} 