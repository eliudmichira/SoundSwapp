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

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (initializationError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Error</h3>
          <p className="text-sm text-gray-600 mb-4">{initializationError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default TokenManagerInitializer; 