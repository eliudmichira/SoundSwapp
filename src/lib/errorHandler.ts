/**
 * Comprehensive error handling utilities for development
 */

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandling = () => {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    // Handle console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Log the error
      originalConsoleError.apply(console, args);
      
      // Check for specific error patterns
      const errorMessage = args.join(' ');
      
      // Handle asChild prop warnings
      if (errorMessage.includes('asChild') && errorMessage.includes('DOM element')) {
        console.warn('🔧 asChild prop warning detected. Consider using filterDOMProps utility.');
      }
      
      // Handle array method errors
      if (errorMessage.includes('includes is not a function') || 
          errorMessage.includes('map is not a function') ||
          errorMessage.includes('filter is not a function')) {
        console.warn('🔧 Array method error detected. Consider using safeArray* utilities.');
      }
      
      // Handle Set method errors
      if (errorMessage.includes('has is not a function') ||
          errorMessage.includes('add is not a function') ||
          errorMessage.includes('delete is not a function')) {
        console.warn('🔧 Set method error detected. Consider using safeSetOperations or safeCollectionOperations utilities.');
      }
    };
  }
};

// Safe array operations
export const safeArrayOperations = {
  includes: (array: any, item: any): boolean => {
    return Array.isArray(array) && array.includes(item);
  },
  
  map: <T, R>(array: any, mapper: (item: T, index: number) => R): R[] => {
    return Array.isArray(array) ? array.map(mapper) : [];
  },
  
  filter: <T>(array: any, predicate: (item: T, index: number) => boolean): T[] => {
    return Array.isArray(array) ? array.filter(predicate) : [];
  },
  
  find: <T>(array: any, predicate: (item: T, index: number) => boolean): T | undefined => {
    return Array.isArray(array) ? array.find(predicate) : undefined;
  },
  
  forEach: <T>(array: any, callback: (item: T, index: number) => void): void => {
    if (Array.isArray(array)) {
      array.forEach(callback);
    }
  }
};

// Safe Set operations
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

// Safe object operations
export const safeObjectOperations = {
  get: (obj: any, path: string, defaultValue: any = undefined) => {
    try {
      return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (obj: any, path: string, value: any) => {
    try {
      const keys = path.split('.');
      const lastKey = keys.pop()!;
      const target = keys.reduce((current, key) => {
        if (!(key in current)) {
          current[key] = {};
        }
        return current[key];
      }, obj);
      target[lastKey] = value;
      return true;
    } catch {
      return false;
    }
  }
};

// Development-only error reporting
export const reportError = (error: Error, context?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error Report${context ? ` - ${context}` : ''}`);
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('Context:', context);
    console.groupEnd();
  }
};

// Initialize error handling
if (process.env.NODE_ENV === 'development') {
  setupGlobalErrorHandling();
} 