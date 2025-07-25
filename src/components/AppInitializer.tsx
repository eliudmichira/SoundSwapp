import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import Preloader from './ui/Preloader';
import usePageLifecycle from '../hooks/usePageLifecycle';

// Add import for mobile utilities
import { isMobileDevice } from '../lib/utils';

// Declare global window interface
declare global {
  interface Window {
    APP_INITIALIZED?: boolean;
    HTML_PRELOADER_PROGRESS?: number;
  }
}

interface AppInitializerProps {
  children: React.ReactNode;
}

// Get the progress value from HTML preloader if available
const getInitialProgress = (): number => {
  if (typeof window !== 'undefined' && (window as any).HTML_PRELOADER_PROGRESS) {
    return (window as any).HTML_PRELOADER_PROGRESS;
  }
  return 60; // Default value if not available
};

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { loading: authLoading } = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { isLoading, isRefreshing } = usePageLifecycle();
  const [progress, setProgress] = useState(getInitialProgress());
  // Add mobile detection state and handling
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOptimized, setMobileOptimized] = useState(false);
  
  // Initialize mobile detection (debug only, no optimization)
  useEffect(() => {
    const mobile = isMobileDevice() || window.innerWidth < 768;
    setIsMobile(mobile);
    console.log('[AppInitializer] Mobile detected:', mobile);
    // Disabled optimizeForMobile for debugging
  }, []);
  
  // Fallback: Dispatch app-initialized event after a reasonable timeout
  // This ensures the HTML preloader doesn't timeout even if React takes too long
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (!window.APP_INITIALIZED) {
        console.log('[AppInitializer] Fallback timeout - dispatching app-initialized event');
        window.dispatchEvent(new CustomEvent('app-initialized', {
          detail: { progress: 100 }
        }));
        window.APP_INITIALIZED = true;
      }
    }, 5000); // 5 second fallback timeout
    return () => clearTimeout(fallbackTimeout);
  }, []);
  
  // Simulate loading progress for better UX
  useEffect(() => {
    if (isLoading || authLoading) {
      let progressInterval: NodeJS.Timeout;
      
      // Continue progress from where HTML preloader left off
      
      // Define custom timing points for a realistic loading feeling
      const simulateProgress = () => {
        progressInterval = setInterval(() => {
          setProgress(prev => {
            // Move slower as we approach 100% to give time for auth and data loading
            if (prev < 85) return prev + 0.7;
            if (prev < 95) return prev + 0.3;
            
            // Hold at 95% if still loading (waiting for actual completion)
            // This prevents the progress from reaching 100% before the app is ready
            if (isLoading || authLoading) return 95;
            
            // Complete to 100% and clear interval
            clearInterval(progressInterval);
            return 100;
          });
        }, 50);
      };
      
      simulateProgress();
      
      return () => {
        if (progressInterval) clearInterval(progressInterval);
      };
    } else if (progress < 100) {
      // When loading is complete but progress isn't at 100%, 
      // quickly complete the progress bar
      const completeProgress = setTimeout(() => {
        setProgress(100);
      }, 100);
      
      return () => clearTimeout(completeProgress);
    }
  }, [isLoading, authLoading, progress]);
  
  // Complete initialization after progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && !initialLoadComplete) {
      const completeTimer = setTimeout(() => {
        setInitialLoadComplete(true);
        
        // Dispatch app-initialized event for HTML preloader
        window.dispatchEvent(new CustomEvent('app-initialized', {
          detail: { progress: 100 }
        }));
        console.log('App initialization complete - dispatched app-initialized event');
        
        // Set global flag to indicate app is initialized
        window.APP_INITIALIZED = true;
      }, 500); // Small delay after reaching 100% for smooth transition
      
      return () => clearTimeout(completeTimer);
    }
  }, [progress, initialLoadComplete]);

  // Add mobile-specific safety timeout
  useEffect(() => {
    // Safety timeout for mobile - ensure we don't get stuck in loading state
    if (isMobile) {
      const safetyTimeout = setTimeout(() => {
        if (!initialLoadComplete) {
          console.warn('[AppInitializer] Mobile safety timeout triggered - forcing app to load');
          setProgress(100);
          setInitialLoadComplete(true);
          // Dispatch app-initialized event even on safety timeout
          window.dispatchEvent(new CustomEvent('app-initialized', {
            detail: { progress: 100 }
          }));
          console.log('[AppInitializer] Mobile safety timeout - dispatched app-initialized event');
          window.APP_INITIALIZED = true;
        }
      }, 10000); // 10 second safety timeout for mobile devices
      return () => clearTimeout(safetyTimeout);
    }
  }, [isMobile, initialLoadComplete]);
  
  // Set custom loading messages based on state
    /* Unused function  const getLoadingMessage = () => {    if (authLoading) return "Authenticating...";    if (isRefreshing) return "Refreshing your music universe...";    if (progress < 75) return "Connecting to your music...";    if (progress < 90) return "Preparing your experience...";    return "Almost ready...";  };*/
  
  // Show preloader if app is still initializing, refreshing, or auth is loading
  if (!initialLoadComplete || isLoading || authLoading) {
    console.log('[AppInitializer] Showing Preloader', { initialLoadComplete, isLoading, authLoading, progress });
    return (
      <Preloader 
        onComplete={() => {
          setInitialLoadComplete(true);
          console.log('[AppInitializer] Preloader onComplete called');
        }}
        theme={authLoading ? "spotify" : "default"}
        showProgressText={true}
        size="lg"
        initialProgress={progress}
      />
    );
  }
  
  console.log('[AppInitializer] Rendering children');
  return <>{children}</>;
};

export default AppInitializer; 