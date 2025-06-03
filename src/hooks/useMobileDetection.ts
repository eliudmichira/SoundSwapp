import { useState, useEffect } from 'react';
import { isMobileDevice, isIOSDevice, isAndroidDevice } from '../lib/utils';

/**
 * Hook to detect mobile devices and provide responsive information
 */
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    // Initial detection
    const detectMobile = () => {
      const mobile = isMobileDevice() || window.innerWidth < 768;
      setIsMobile(mobile);
      setIsIOS(isIOSDevice());
      setIsAndroid(isAndroidDevice());
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    // Call initially
    detectMobile();
    
    // Add listeners for window resizing
    const handleResize = () => {
      detectMobile();
    };
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
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
    viewport
  };
};

export default useMobileDetection; 