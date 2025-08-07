import { useCallback, useRef, useEffect } from 'react';

interface PerformanceConfig {
  throttleMs?: number;
  debounceMs?: number;
  maxFPS?: number;
  enableRAF?: boolean;
}

interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const {
    throttleMs = 16, // ~60fps
    debounceMs = 300,
    maxFPS = 60,
    enableRAF = true
  } = config;

  const rafIdRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  const frameIntervalRef = useRef<number>(1000 / maxFPS);

  // Throttle function for performance
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    limit: number = throttleMs
  ): ThrottledFunction<T> => {
    let inThrottle: boolean;
    let timeoutId: NodeJS.Timeout;

    const throttled = (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        timeoutId = setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };

    throttled.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      inThrottle = false;
    };

    return throttled;
  }, [throttleMs]);

  // Debounce function for performance
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    wait: number = debounceMs
  ): DebouncedFunction<T> => {
    let timeoutId: NodeJS.Timeout;
    let lastArgs: Parameters<T> | null = null;

    const debounced = (...args: Parameters<T>) => {
      lastArgs = args;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, wait);
    };

    debounced.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      lastArgs = null;
    };

    debounced.flush = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (lastArgs) {
        func(...lastArgs);
        lastArgs = null;
      }
    };

    return debounced;
  }, [debounceMs]);

  // RequestAnimationFrame wrapper with FPS limiting
  const requestAnimationFrame = useCallback((callback: FrameRequestCallback): number => {
    if (!enableRAF) {
      return window.setTimeout(callback, frameIntervalRef.current);
    }

    const now = performance.now();
    const timeSinceLastFrame = now - lastFrameTimeRef.current;

    if (timeSinceLastFrame >= frameIntervalRef.current) {
      lastFrameTimeRef.current = now;
      return window.requestAnimationFrame(callback);
    } else {
      const delay = frameIntervalRef.current - timeSinceLastFrame;
      return window.setTimeout(() => {
        lastFrameTimeRef.current = performance.now();
        callback(lastFrameTimeRef.current);
      }, delay);
    }
  }, [enableRAF]);

  // Cancel animation frame wrapper
  const cancelAnimationFrame = useCallback((id: number) => {
    if (enableRAF) {
      window.cancelAnimationFrame(id);
    } else {
      window.clearTimeout(id);
    }
  }, [enableRAF]);

  // Memory leak prevention
  const cleanup = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = undefined;
    }
  }, [cancelAnimationFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Performance monitoring
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
  }, []);

  // Batch state updates
  const batchUpdates = useCallback((updates: (() => void)[]) => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    rafIdRef.current = requestAnimationFrame(() => {
      updates.forEach(update => update());
      rafIdRef.current = undefined;
    });
  }, [requestAnimationFrame, cancelAnimationFrame]);

  return {
    throttle,
    debounce,
    requestAnimationFrame,
    cancelAnimationFrame,
    cleanup,
    measurePerformance,
    batchUpdates
  };
};

// Hook for reducing re-renders
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList = []
): T => {
  const callbackRef = useRef<T>(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, deps) as T;
};

// Hook for preventing unnecessary re-renders
export const useStableValue = <T>(value: T, deps: React.DependencyList = []): T => {
  const valueRef = useRef<T>(value);
  
  useEffect(() => {
    valueRef.current = value;
  }, deps);
  
  return valueRef.current;
};

// Hook for animation performance
export const useAnimationPerformance = (config: {
  maxFPS?: number;
  enableThrottling?: boolean;
} = {}) => {
  const { maxFPS = 60, enableThrottling = true } = config;
  const frameInterval = 1000 / maxFPS;
  const lastFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number>();

  const throttledRAF = useCallback((callback: FrameRequestCallback) => {
    if (!enableThrottling) {
      return window.requestAnimationFrame(callback);
    }

    const now = performance.now();
    const timeSinceLastFrame = now - lastFrameRef.current;

    if (timeSinceLastFrame >= frameInterval) {
      lastFrameRef.current = now;
      return window.requestAnimationFrame(callback);
    } else {
      const delay = frameInterval - timeSinceLastFrame;
      return window.setTimeout(() => {
        lastFrameRef.current = performance.now();
        callback(lastFrameRef.current);
      }, delay);
    }
  }, [enableThrottling, frameInterval]);

  const cancelRAF = useCallback((id: number) => {
    window.cancelAnimationFrame(id);
    window.clearTimeout(id);
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelRAF(rafIdRef.current);
      }
    };
  }, [cancelRAF]);

  return {
    requestAnimationFrame: throttledRAF,
    cancelAnimationFrame: cancelRAF
  };
}; 