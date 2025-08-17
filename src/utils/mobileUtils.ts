/**
 * Mobile-specific URL handling utilities
 */

/**
 * Opens a URL with mobile-optimized handling
 * @param url The URL to open
 * @param fallbackToSameWindow Whether to fallback to same window if popup is blocked
 */
export const openUrlOnMobile = (url: string, fallbackToSameWindow: boolean = true): boolean => {
  if (!url) {
    console.error('[mobileUtils] No URL provided');
    return false;
  }

  console.log('[mobileUtils] Attempting to open URL:', url);

  try {
    // First, try to open in a new window/tab
    const newWindow = window.open(url, '_blank');
    
    // Check if popup was blocked
    if (!newWindow) {
      console.warn('[mobileUtils] Popup blocked, trying alternative methods');
      
      if (fallbackToSameWindow) {
        // Fallback: navigate in the same window
        console.log('[mobileUtils] Falling back to same window navigation');
        window.location.href = url;
        return true;
      } else {
        // Try to create a temporary link and click it
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      }
    } else {
      console.log('[mobileUtils] Successfully opened URL in new window');
      return true;
    }
  } catch (error) {
    console.error('[mobileUtils] Error opening URL:', error);
    
    if (fallbackToSameWindow) {
      try {
        window.location.href = url;
        return true;
      } catch (fallbackError) {
        console.error('[mobileUtils] Fallback navigation also failed:', fallbackError);
        return false;
      }
    }
    return false;
  }
};

/**
 * Alternative mobile URL opening method that might work better on some mobile browsers
 * @param url The URL to open
 */
export const openUrlOnMobileAlternative = (url: string): boolean => {
  if (!url) {
    console.error('[mobileUtils] No URL provided for alternative method');
    return false;
  }

  console.log('[mobileUtils] Using alternative method to open URL:', url);

  try {
    // Method 1: Try using location.assign
    window.location.assign(url);
    return true;
  } catch (error) {
    console.error('[mobileUtils] Alternative method 1 failed:', error);
    
    try {
      // Method 2: Try using location.replace
      window.location.replace(url);
      return true;
    } catch (error2) {
      console.error('[mobileUtils] Alternative method 2 failed:', error2);
      
      try {
        // Method 3: Try creating and clicking a link with specific attributes
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Trigger click event
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        link.dispatchEvent(clickEvent);
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
        
        return true;
      } catch (error3) {
        console.error('[mobileUtils] Alternative method 3 failed:', error3);
        return false;
      }
    }
  }
};

/**
 * Opens a Spotify playlist URL with mobile optimization
 * @param playlistId The Spotify playlist ID
 */
export const openSpotifyPlaylist = (playlistId: string): boolean => {
  const url = `https://open.spotify.com/playlist/${playlistId}`;
  console.log('[mobileUtils] Opening Spotify playlist:', url);
  return openUrlOnMobile(url);
};

/**
 * Opens a YouTube playlist URL with mobile optimization
 * @param playlistId The YouTube playlist ID
 */
export const openYouTubePlaylist = (playlistId: string): boolean => {
  const url = `https://www.youtube.com/playlist?list=${playlistId}`;
  console.log('[mobileUtils] Opening YouTube playlist:', url);
  return openUrlOnMobile(url);
};

/**
 * Detects if the current device is mobile
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Detects if the current device is iOS
 */
export const isIOSDevice = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Detects if the current device is Android
 */
export const isAndroidDevice = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Gets mobile device information for debugging
 */
export const getMobileInfo = () => {
  return {
    isMobile: isMobileDevice(),
    isIOS: isIOSDevice(),
    isAndroid: isAndroidDevice(),
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1
    },
    hasTouchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true
  };
}; 