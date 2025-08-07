import { useEffect, useState } from 'react';
import TokenManager from '../lib/tokenManager';
import { useAuth } from '../lib/AuthContext';

interface TokenManagerInitializerProps {
  children: React.ReactNode;
}

const TokenManagerInitializer: React.FC<TokenManagerInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const initializeTokenManager = async () => {
      try {
        console.log('[TokenManagerInitializer] Starting token manager initialization');
        
        // Initialize monitoring for all services
        await TokenManager.initializeMonitoring();
        
        console.log('[TokenManagerInitializer] Token manager initialized successfully');
        setIsInitialized(true);
        setInitializationError(null);
      } catch (error) {
        console.error('[TokenManagerInitializer] Failed to initialize token manager:', error);
        setInitializationError(error instanceof Error ? error.message : 'Failed to initialize token manager');
        // Still set as initialized to not block the app
        setIsInitialized(true);
      }
    };

    // Only initialize when user is authenticated
    if (user) {
      initializeTokenManager();
    } else {
      // Reset state when user logs out
      setIsInitialized(false);
      setInitializationError(null);
    }
  }, [user]);

  // Always render children, don't show loading screen
  // The token manager will initialize in the background
  return <>{children}</>;
};

export default TokenManagerInitializer; 