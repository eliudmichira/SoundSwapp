import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 

/**
 * Check if the current device is a mobile device
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if the device is specifically Android
 */
export const isAndroidDevice = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

/**
 * Check if the device is iOS
 */
export const isIOSDevice = (): boolean => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Detect connection quality for better mobile experience
 */
export const detectConnectionQuality = (): 'good' | 'slow' | 'limited' | 'offline' => {
  if (!navigator.onLine) {
    return 'offline';
  }
  
  // Use Navigator Connection API if available
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    
    if (conn) {
      // Data saver mode
      if (conn.saveData) {
        return 'limited';
      }
      
      // Detect slow connection
      if (conn.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) {
        return 'slow';
      }
    }
  }
  
  return 'good';
};

// optimizeForMobile is temporarily disabled for debugging mobile rendering issues.
// export const optimizeForMobile = () => {
//   const isMobile = isMobileDevice() || window.innerWidth < 768;
  
//   if (isMobile) {
//     // 1. Add mobile class to body
//     document.body.classList.add('is-mobile');
//     document.documentElement.classList.add('is-mobile-device');
    
//     // 2. Set viewport based on device
//     if (isIOSDevice()) {
//       // iOS-specific optimizations
//       const viewportMeta = document.querySelector('meta[name="viewport"]');
//       if (viewportMeta) {
//         viewportMeta.setAttribute('content', 
//           'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
//       }
//     }
    
//     // 3. Reduce animation complexity
//     // Reduce animation frame rate for complex animations
//     const originalRequestAnimationFrame = window.requestAnimationFrame;
//     window.requestAnimationFrame = (callback) => {
//       // Only throttle if explicitly marked as complex
//       if (document.documentElement.classList.contains('complex-animation-running')) {
//         return window.setTimeout(() => callback(performance.now()), 33); // ~30fps
//       }
//       return originalRequestAnimationFrame(callback);
//     };
    
//     // 4. Listen for orientation changes
//     const updateOrientation = () => {
//       const isPortrait = window.innerHeight > window.innerWidth;
//       document.body.classList.toggle('portrait', isPortrait);
//       document.body.classList.toggle('landscape', !isPortrait);
      
//       // Dispatch a custom event for components to react
//       window.dispatchEvent(new CustomEvent('orientationchange', {
//         detail: { isPortrait }
//       }));
//     };
    
//     // 5. Setup listeners
//     window.addEventListener('resize', updateOrientation, { passive: true });
//     updateOrientation();
    
//     // 6. Fix common mobile browser bugs
//     // Fix for delayed focus on inputs
//     document.addEventListener('touchend', (e) => {
//       const target = e.target as HTMLElement;
//       if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
//         // Small delay to prevent conflicts with other handlers
//         setTimeout(() => {
//           (target as HTMLInputElement).focus();
//         }, 100);
//       }
//     }, { passive: true });
    
//     // 7. Optimize scroll performance
//     document.documentElement.classList.add('smooth-scroll');
    
//     return {
//       isMobile: true,
//       cleanupFunction: () => {
//         window.removeEventListener('resize', updateOrientation);
//         // Restore original RAF
//         window.requestAnimationFrame = originalRequestAnimationFrame;
//       }
//     };
//   }
  
//   return { isMobile: false, cleanupFunction: () => {} };
// };

/**
 * Comprehensive mobile device detection and information
 */
export const getMobileInfo = () => {
  const isMobile = isMobileDevice();
  const isAndroid = isAndroidDevice();
  const isIOS = isIOSDevice();
  const isTablet = /iPad/i.test(navigator.userAgent) || 
                   (isAndroid && !/Mobile/i.test(navigator.userAgent));
  
  // Get orientation information
  const isPortrait = window.innerHeight > window.innerWidth;
  
  // Check for specific mobile browser
  const isMobileSafari = /iPhone|iPad|iPod/i.test(navigator.userAgent) && 
                         /WebKit/i.test(navigator.userAgent) && 
                         !/(CriOS|FxiOS)/i.test(navigator.userAgent);
  const isMobileChrome = /Android/i.test(navigator.userAgent) && 
                         /Chrome/i.test(navigator.userAgent);
  
  // Viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get touch support info
  const hasTouchSupport = 'ontouchstart' in window || 
                         navigator.maxTouchPoints > 0 || 
                         (navigator as any).msMaxTouchPoints > 0;
  
  return {
    isMobile,
    isAndroid,
    isIOS,
    isTablet,
    isPortrait,
    isMobileSafari,
    isMobileChrome,
    viewportWidth,
    viewportHeight,
    hasTouchSupport,
    connectionQuality: detectConnectionQuality()
  };
};

/**
 * Check if the browser has support for passive event listeners 
 * (important for touch performance)
 */
export const supportsPassiveEvents = (): boolean => {
  let supportsPassive = false;
  try {
    // Test via a getter in the options object to see if the passive property is accessed
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });

    window.addEventListener('testPassive', null as any, opts);
    window.removeEventListener('testPassive', null as any, opts);
  } catch (e) {}
  
  return supportsPassive;
};

/**
 * Register events with passive listeners for better touch performance
 */
export const addPassiveEventListener = (
  element: Element | Window | Document,
  eventName: string,
  handler: EventListener,
  options: boolean | AddEventListenerOptions = {}
) => {
  try {
    // Test if passive is supported
    let supportsPassive = false;
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    window.addEventListener('testPassive', null as any, opts);
    window.removeEventListener('testPassive', null as any, opts);

    // Add event listener with passive option if supported
    const listenerOptions = typeof options === 'boolean' ? { capture: options } : options;
    element.addEventListener(eventName, handler, {
      ...listenerOptions,
      passive: supportsPassive && (listenerOptions.passive !== false)
    });

    // Return cleanup function
    return () => {
      element.removeEventListener(eventName, handler, typeof options === 'boolean' ? options : options.capture);
    };
  } catch (e) {
    // Fallback to normal event listener if something goes wrong
    element.addEventListener(eventName, handler, options);
    return () => {
      element.removeEventListener(eventName, handler, options);
    };
  }
};

/**
 * Helper to properly handle both touch and mouse events
 */
export const addTouchAndMouseEvent = (
  element: HTMLElement,
  eventType: 'start' | 'move' | 'end',
  handler: (e: Event) => void
): () => void => {
  const touchMap = {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend'
  };
  
  const mouseMap = {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup'
  };
  
  // For touch events, we want passive by default for better scrolling performance
  // except for touchmove which might need to prevent default for custom gestures
  const isPassive = eventType !== 'move';
  
  // Use proper typing for event listeners
  addPassiveEventListener(element, touchMap[eventType], handler, isPassive);
  element.addEventListener(mouseMap[eventType], handler);
  
  // Return a cleanup function
  return () => {
    element.removeEventListener(touchMap[eventType], handler);
    element.removeEventListener(mouseMap[eventType], handler);
  };
};

/**
 * Helper to check if touch is supported
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Helper to check if an element is scrollable
 */
export const isScrollable = (element: HTMLElement) => {
  return element.scrollHeight > element.clientHeight;
}; 

/**
 * Safely filters out props that shouldn't be passed to DOM elements
 * This prevents warnings like "React does not recognize the `asChild` prop"
 */
export const filterDOMProps = (props: Record<string, any>): Record<string, any> => {
  const domProps = { ...props };
  
  // Remove Radix UI specific props that shouldn't be on DOM elements
  const radixProps = ['asChild', 'data-radix-collection-item'];
  radixProps.forEach(prop => {
    delete domProps[prop];
  });
  
  return domProps;
};

/**
 * Safe array operations to prevent "includes is not a function" errors
 */
export const safeArrayIncludes = (array: any, item: any): boolean => {
  return Array.isArray(array) && array.includes(item);
};

export const safeArrayMap = <T, R>(array: any, mapper: (item: T, index: number) => R): R[] => {
  return Array.isArray(array) ? array.map(mapper) : [];
};

export const safeArrayFilter = <T>(array: any, predicate: (item: T, index: number) => boolean): T[] => {
  return Array.isArray(array) ? array.filter(predicate) : [];
}; 

/**
 * Safe Set operations to prevent "has is not a function" errors
 */
export const safeSetOperations = {
  has: (set: any, item: any): boolean => {
    return set instanceof Set && set.has(item);
  },
  
  add: (set: any, item: any): Set<any> => {
    if (set instanceof Set) {
      set.add(item);
      return set;
    }
    return new Set([item]);
  },
  
  delete: (set: any, item: any): boolean => {
    return set instanceof Set ? set.delete(item) : false;
  },
  
  size: (set: any): number => {
    return set instanceof Set ? set.size : 0;
  },
  
  forEach: (set: any, callback: (item: any, index: number) => void): void => {
    if (set instanceof Set) {
      set.forEach(callback);
    }
  },
  
  toArray: (set: any): any[] => {
    return set instanceof Set ? Array.from(set) : [];
  },
  
  fromArray: (array: any): Set<any> => {
    return Array.isArray(array) ? new Set(array) : new Set();
  }
};

/**
 * Universal safe collection operations that work with both Arrays and Sets
 */
export const safeCollectionOperations = {
  has: (collection: any, item: any): boolean => {
    if (collection instanceof Set) {
      return collection.has(item);
    }
    if (Array.isArray(collection)) {
      return collection.includes(item);
    }
    return false;
  },
  
  add: (collection: any, item: any): any => {
    if (collection instanceof Set) {
      collection.add(item);
      return collection;
    }
    if (Array.isArray(collection)) {
      return [...collection, item];
    }
    return [item];
  },
  
  remove: (collection: any, item: any): any => {
    if (collection instanceof Set) {
      collection.delete(item);
      return collection;
    }
    if (Array.isArray(collection)) {
      return collection.filter(i => i !== item);
    }
    return [];
  },
  
  size: (collection: any): number => {
    if (collection instanceof Set) {
      return collection.size;
    }
    if (Array.isArray(collection)) {
      return collection.length;
    }
    return 0;
  }
}; 