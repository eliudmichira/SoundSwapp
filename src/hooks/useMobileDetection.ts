import { useState, useEffect } from 'react';
import { isMobileDevice, isIOSDevice, isAndroidDevice } from '../lib/utils';

/**
 * Hook to detect mobile devices and provide responsive information
 */
export const useMobileDetection = () => {
  // Initialize with immediate detection to avoid flash
  const initialMobile = isMobileDevice() || window.innerWidth < 768;
  const initialPortrait = window.innerHeight > window.innerWidth;
  const initialIOS = isIOSDevice();
  const initialAndroid = isAndroidDevice();
  
  console.log('useMobileDetection: Initial detection:', {
    isMobileDevice: isMobileDevice(),
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    initialMobile,
    initialPortrait,
    initialIOS,
    initialAndroid,
    userAgent: navigator.userAgent
  });
  
  const [isMobile, setIsMobile] = useState(initialMobile);
  const [isPortrait, setIsPortrait] = useState(initialPortrait);
  const [isIOS, setIsIOS] = useState(initialIOS);
  const [isAndroid, setIsAndroid] = useState(initialAndroid);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    // Initial detection
    const detectMobile = () => {
      const mobile = isMobileDevice() || window.innerWidth < 768;
      console.log('useMobileDetection: Detecting mobile:', { 
        isMobileDevice: isMobileDevice(), 
        windowWidth: window.innerWidth, 
        mobile, 
        userAgent: navigator.userAgent 
      });
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