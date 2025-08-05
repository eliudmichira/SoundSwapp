import { useState, useEffect, useCallback } from 'react';
import TokenManager from '../lib/tokenManager';

interface TokenStatus {
  isValid: boolean;
  expiresIn: number; // seconds until expiration
  needsRefresh: boolean;
}

interface UseTokenStatusReturn {
  status: TokenStatus | null;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  isConnected: boolean;
  timeUntilExpiry: string;
  shouldReconnect: boolean;
}

export const useTokenStatus = (service: 'spotify' | 'youtube'): UseTokenStatusReturn => {
  const [status, setStatus] = useState<TokenStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format time until expiry for display
  const formatTimeUntilExpiry = useCallback((seconds: number): string => {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  }, []);

  // Check if user should reconnect (token expired or refresh failed)
  const shouldReconnect = status ? !status.isValid && status.expiresIn <= 0 : false;

  // Get current token status
  const checkTokenStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentStatus = await TokenManager.getCurrentTokenStatus(service);
      setStatus(currentStatus);
      
      console.log(`[useTokenStatus] ${service} token status:`, currentStatus);
    } catch (err) {
      console.error(`[useTokenStatus] Error checking ${service} token status:`, err);
      setError(err instanceof Error ? err.message : 'Failed to check token status');
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  // Manual token refresh
  const refreshToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`[useTokenStatus] Manually refreshing ${service} token`);
      
      // Force a fresh token check which will trigger refresh if needed
      await checkTokenStatus();
    } catch (err) {
      console.error(`[useTokenStatus] Error refreshing ${service} token:`, err);
      setError(err instanceof Error ? err.message : 'Failed to refresh token');
    } finally {
      setIsLoading(false);
    }
  }, [service, checkTokenStatus]);

  // Set up token status listener
  useEffect(() => {
    console.log(`[useTokenStatus] Setting up listener for ${service}`);
    
    // Initial status check
    checkTokenStatus();
    
    // Subscribe to token status updates
    const unsubscribe = TokenManager.addTokenListener(service, (newStatus) => {
      console.log(`[useTokenStatus] Received ${service} token status update:`, newStatus);
      setStatus(newStatus);
      setError(null);
    });

    return () => {
      console.log(`[useTokenStatus] Cleaning up listener for ${service}`);
      unsubscribe();
    };
  }, [service, checkTokenStatus]);

  // Periodic status check (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        checkTokenStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [checkTokenStatus, isLoading]);

  return {
    status,
    isLoading,
    error,
    refreshToken,
    isConnected: status?.isValid ?? false,
    timeUntilExpiry: status ? formatTimeUntilExpiry(status.expiresIn) : 'Unknown',
    shouldReconnect
  };
}; 