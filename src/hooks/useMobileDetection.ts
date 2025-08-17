import { useState, useEffect } from 'react';

// Utility functions for device detection
const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isIOSDevice = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isAndroidDevice = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

const isTabletDevice = (): boolean => {
  return /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);
};

/**
 * Hook to detect mobile devices and provide responsive information
 */
export const useMobileDetection = () => {
  // Initialize with immediate detection to avoid flash
  const initialMobile = isMobileDevice() || window.innerWidth < 768;
  const initialPortrait = window.innerHeight > window.innerWidth;
  const initialIOS = isIOSDevice();
  const initialAndroid = isAndroidDevice();
  const initialTablet = isTabletDevice();
  
  const [isMobile, setIsMobile] = useState(initialMobile);
  const [isPortrait, setIsPortrait] = useState(initialPortrait);
  const [isIOS, setIsIOS] = useState(initialIOS);
  const [isAndroid, setIsAndroid] = useState(initialAndroid);
  const [isTablet, setIsTablet] = useState(initialTablet);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1
  });
  
  useEffect(() => {
    // Initial detection
    const detectDevice = () => {
      const mobile = isMobileDevice() || window.innerWidth < 768;
      const portrait = window.innerHeight > window.innerWidth;
      const ios = isIOSDevice();
      const android = isAndroidDevice();
      const tablet = isTabletDevice();
      
      setIsMobile(mobile);
      setIsIOS(ios);
      setIsAndroid(android);
      setIsTablet(tablet);
      setIsPortrait(portrait);
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1
      });
    };
    
    // Call initially
    detectDevice();
    
    // Add listeners for window resizing
    const handleResize = () => {
      detectDevice();
    };
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      // Add delay for iOS orientation change
      setTimeout(() => {
        detectDevice();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
  
  return {
    isMobile,
    isPortrait,
    isLandscape: !isPortrait,
    isIOS,
    isAndroid,
    isTablet,
    viewport,
    // Helper functions
    isSmallScreen: viewport.width < 640,
    isMediumScreen: viewport.width >= 640 && viewport.width < 1024,
    isLargeScreen: viewport.width >= 1024,
    // Device-specific helpers
    isMobileOrTablet: isMobile || isTablet,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true
  };
};

export default useMobileDetection; 