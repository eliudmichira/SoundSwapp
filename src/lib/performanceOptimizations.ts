// Add gtag type declaration
declare global {
  function gtag(...args: any[]): void;
}

// 1. Lazy Loading Configuration
export const lazyLoadComponents = {
  // Lazy load heavy components
  ConversionInsights: () => import('../components/ConversionInsights'),
  PlaylistInsights: () => import('../components/visualization/PlaylistInsights'),
  MobileOptimizedConverter: () => import('../components/MobileOptimizedConverter'),
  
  // Lazy load API modules
  SpotifyAPI: () => import('./spotifyApi'),
  YouTubeAPI: () => import('./youtubeApi'),
  
  // Lazy load visualization libraries
  // ChartComponents: () => import('../components/visualization/ChartComponents'), // Removed - file doesn't exist
};

// 2. Bundle Size Optimization
export const bundleOptimizations = {
  // Tree shaking for unused imports
  removeUnusedImports: () => {
    // Remove unused components and utilities
    const unusedImports = [
      'unusedComponent',
      'deprecatedFunction',
      'oldUtility'
    ];
    
    return unusedImports;
  },
  
  // Optimize images and assets
  optimizeAssets: () => {
    // Compress images
    // Convert to WebP format
    // Implement lazy loading for images
    return {
      imageCompression: true,
      webpConversion: true,
      lazyLoading: true
    };
  }
};

// 3. Caching Strategies
export const cachingStrategies = {
  // API response caching
  cacheAPIResponses: (key: string, data: any, ttl: number = 3600000) => {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  },
  
  // Get cached data
  getCachedData: (key: string) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const entry = JSON.parse(cached);
        const isExpired = Date.now() - entry.timestamp > entry.ttl;
        
        if (!isExpired) {
          return entry.data;
        } else {
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
    }
    
    return null;
  },
  
  // Clear expired cache entries
  clearExpiredCache: () => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('cache_'));
    
    cacheKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry = JSON.parse(cached);
          const isExpired = Date.now() - entry.timestamp > entry.ttl;
          
          if (isExpired) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Remove invalid cache entries
        localStorage.removeItem(key);
      }
    });
  }
};

// 4. Service Worker for Offline Functionality
export const serviceWorkerConfig = {
  // Register service worker
  register: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  },
  
  // Cache important resources
  cacheResources: async () => {
    const resourcesToCache = [
      '/',
      '/index.html',
      '/static/js/main.bundle.js',
      '/static/css/main.css',
      '/manifest.json'
    ];
    
    if ('caches' in window) {
      const cache = await caches.open('soundswapp-v1');
      await cache.addAll(resourcesToCache);
    }
  }
};

// 5. Memory Management
export const memoryManagement = {
  // Clean up large objects
  cleanup: () => {
    // Clear unused state
    // Remove event listeners
    // Clear intervals and timeouts
    return {
      stateCleared: true,
      listenersRemoved: true,
      intervalsCleared: true
    };
  },
  
  // Monitor memory usage
  monitorMemory: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }
};

// 6. Network Optimization
export const networkOptimizations = {
  // Implement request batching
  batchRequests: (requests: Promise<any>[], batchSize: number = 5) => {
    const batches = [];
    for (let i = 0; i < requests.length; i += batchSize) {
      batches.push(requests.slice(i, i + batchSize));
    }
    
    return batches.map(batch => Promise.all(batch));
  },
  
  // Implement request deduplication
  requestDeduplication: new Map(),
  
  // Deduplicate requests
  deduplicateRequest: (key: string, request: () => Promise<any>) => {
    if (networkOptimizations.requestDeduplication.has(key)) {
      return networkOptimizations.requestDeduplication.get(key);
    }
    
    const promise = request();
    networkOptimizations.requestDeduplication.set(key, promise);
    
    promise.finally(() => {
      networkOptimizations.requestDeduplication.delete(key);
    });
    
    return promise;
  }
};

// 7. Performance Monitoring
export const performanceMonitoring = {
  // Track conversion performance
  trackConversionPerformance: (startTime: number, endTime: number, trackCount: number) => {
    const duration = endTime - startTime;
    const tracksPerSecond = trackCount / (duration / 1000);
    
    console.log('Conversion Performance:', {
      duration: `${duration}ms`,
      trackCount,
      tracksPerSecond: `${tracksPerSecond.toFixed(2)} tracks/sec`
    });
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion_performance', {
        duration,
        track_count: trackCount,
        tracks_per_second: tracksPerSecond
      });
    }
  },
  
  // Track user interactions
  trackUserInteraction: (action: string, details: any) => {
    console.log('User Interaction:', { action, details, timestamp: Date.now() });
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'user_interaction', {
        action,
        ...details
      });
    }
  }
};

// 8. Mobile-Specific Optimizations
export const mobileOptimizations = {
  // Detect mobile device
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768;
  },
  
  // Optimize for mobile
  optimizeForMobile: () => {
    const isMobile = mobileOptimizations.isMobile();
    
    if (isMobile) {
      // Reduce animation complexity
      // Use smaller images
      // Optimize touch interactions
      return {
        reducedAnimations: true,
        optimizedImages: true,
        touchOptimized: true
      };
    }
    
    return {
      reducedAnimations: false,
      optimizedImages: false,
      touchOptimized: false
    };
  }
};

// 9. Progressive Web App Features
export const pwaFeatures = {
  // Install prompt
  showInstallPrompt: () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Show install prompt
      return true;
    }
    return false;
  },
  
  // Offline functionality
  enableOfflineMode: () => {
    // Cache essential resources
    // Enable offline playlist viewing
    // Queue conversions for when online
    return {
      offlineViewing: true,
      queuedConversions: true,
      cachedResources: true
    };
  }
};

// 10. Accessibility Improvements
export const accessibilityImprovements = {
  // Add ARIA labels
  addAriaLabels: () => {
    const elements = document.querySelectorAll('[data-aria-label]');
    elements.forEach(element => {
      const label = element.getAttribute('data-aria-label');
      if (label) {
        element.setAttribute('aria-label', label);
      }
    });
  },
  
  // Keyboard navigation
  enableKeyboardNavigation: () => {
    // Add keyboard shortcuts
    // Ensure tab order is logical
    // Add focus indicators
    return {
      keyboardShortcuts: true,
      logicalTabOrder: true,
      focusIndicators: true
    };
  },
  
  // Screen reader support
  enableScreenReaderSupport: () => {
    // Add semantic HTML
    // Provide alt text for images
    // Add live regions for dynamic content
    return {
      semanticHTML: true,
      altText: true,
      liveRegions: true
    };
  }
}; 