import { useState, useEffect } from 'react';

interface PageLifecycleState {
  isLoading: boolean;
  isRefreshing: boolean;
  isNavigating: boolean;
  previousUrl: string | null;
}

/**
 * A custom hook that tracks page lifecycle events
 * This helps determine when a page is refreshing vs initial load
 */
export function usePageLifecycle(): PageLifecycleState {
  const [state, setState] = useState<PageLifecycleState>({
    isLoading: true,
    isRefreshing: false,
    isNavigating: false,
    previousUrl: null
  });

  useEffect(() => {
    let pageLoadTimestamp = Date.now();
    const storageKey = 'playlist_converter_page_state';
    
    // Check if this is a refresh or initial load
    const checkForRefresh = () => {
      try {
        // Try to get previous navigation state from sessionStorage
        const savedState = sessionStorage.getItem(storageKey);
        
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          const currentUrl = window.location.href;
          const isRefresh = parsedState.lastUrl === currentUrl;
          
          setState({
            isLoading: true,
            isRefreshing: isRefresh,
            isNavigating: !isRefresh,
            previousUrl: parsedState.lastUrl
          });
        }
      } catch (e) {
        console.error('Error reading page state:', e);
      }
    };
    
    // Save current state for future checks
    const saveCurrentState = () => {
      try {
        const stateToSave = {
          lastUrl: window.location.href,
          timestamp: Date.now()
        };
        sessionStorage.setItem(storageKey, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Error saving page state:', e);
      }
    };
    
    // Complete loading after a reasonable delay
    const finishLoading = () => {
      // Ensure the preloader shows for at least 1 second for better UX
      const timeElapsed = Date.now() - pageLoadTimestamp;
      const minLoadingTime = 1000; // 1 second minimum
      
      const delay = timeElapsed < minLoadingTime 
        ? minLoadingTime - timeElapsed 
        : 0;
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          isNavigating: false
        }));
      }, delay);
    };
    
    // Check if this is a refresh
    checkForRefresh();
    
    // Run when page is fully loaded
    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading);
    }
    
    // Handle browser refresh
    window.addEventListener('beforeunload', saveCurrentState);
    
    return () => {
      window.removeEventListener('load', finishLoading);
      window.removeEventListener('beforeunload', saveCurrentState);
    };
  }, []); // Empty dependency array to run only once on mount

  return state;
}

export default usePageLifecycle; 