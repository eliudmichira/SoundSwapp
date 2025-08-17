// Custom toast function that matches the project's toast system
const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
  // Dispatch a custom event that the app can listen to
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: { type, message }
  }));
};

interface NetworkError {
  type: 'firebase' | 'analytics' | 'api' | 'general';
  message: string;
  retryable: boolean;
  retryCount?: number;
}

class NetworkResilienceService {
  private static instance: NetworkResilienceService;
  private retryDelays = [1000, 2000, 4000, 8000]; // Exponential backoff
  private maxRetries = 3;

  static getInstance(): NetworkResilienceService {
    if (!NetworkResilienceService.instance) {
      NetworkResilienceService.instance = new NetworkResilienceService();
    }
    return NetworkResilienceService.instance;
  }

  /**
   * Handle Firebase/Firestore connection errors gracefully
   */
  handleFirebaseError(error: any, context: string = 'Firebase operation'): NetworkError {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    // Check if it's a network-related error
    const isNetworkError = 
      errorMessage.includes('ERR_QUIC_PROTOCOL_ERROR') ||
      errorMessage.includes('ERR_CONNECTION_TIMED_OUT') ||
      errorMessage.includes('ERR_CONNECTION_ABORTED') ||
      errorMessage.includes('ERR_NETWORK_CHANGED') ||
      errorMessage.includes('firestore.googleapis.com') ||
      errorMessage.includes('firebaseapp.com');

    if (isNetworkError) {
      console.warn(`Network error in ${context}:`, errorMessage);
      
      // Don't show toast for network errors to avoid spam
      return {
        type: 'firebase',
        message: errorMessage,
        retryable: true
      };
    }

    // For other Firebase errors, show a user-friendly message
    console.error(`Firebase error in ${context}:`, error);
    
    return {
      type: 'firebase',
      message: 'Unable to connect to our servers. Please check your internet connection.',
      retryable: true
    };
  }

  /**
   * Handle API errors with retry logic
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    context: string = 'API operation',
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        const networkError = this.handleFirebaseError(error, context);
        
        if (!networkError.retryable || attempt === maxRetries) {
          // Final attempt failed or error is not retryable
          if (attempt > 0) {
            showToast('error', `Failed after ${attempt + 1} attempts. Please try again later.`);
          } else {
            showToast('error', networkError.message);
          }
          throw error;
        }

        // Wait before retrying
        const delay = this.retryDelays[Math.min(attempt, this.retryDelays.length - 1)];
        console.log(`Retrying ${context} in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Check if the user is online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Monitor network status and show appropriate messages
   */
  setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      console.log('Network connection restored');
      showToast('success', 'Connection restored!');
    });

    window.addEventListener('offline', () => {
      console.log('Network connection lost');
      showToast('error', 'No internet connection. Some features may be unavailable.');
    });
  }

  /**
   * Suppress specific console errors that are expected
   */
  suppressExpectedErrors(): void {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = function(...args) {
      const message = args.join(' ');
      
      // Suppress expected network errors
      if (message.includes('ERR_QUIC_PROTOCOL_ERROR') ||
          message.includes('ERR_CONNECTION_TIMED_OUT') ||
          message.includes('ERR_CONNECTION_ABORTED') ||
          message.includes('ERR_NETWORK_CHANGED') ||
          message.includes('firestore.googleapis.com') ||
          message.includes('google-analytics.com') ||
          message.includes('mp/collect?measurement_id=')) {
        return;
      }
      
      // Swallow noisy React element checks from third-party extensions
      if (message.includes("Cannot read properties of undefined (reading 'isElement')")) {
        return;
      }
      
      originalConsoleError.apply(console, args);
    };

    console.warn = function(...args) {
      const message = args.join(' ');
      
      // Suppress expected warnings
      if (message.includes('firestore.googleapis.com') ||
          message.includes('google-analytics.com') ||
          message.includes('mp/collect?measurement_id=')) {
        return;
      }
      
      originalConsoleWarn.apply(console, args);
    };

    // Also attach a window-level error handler to prevent bubbling
    window.addEventListener('error', (event) => {
      const msg = String(event?.error?.message || event?.message || '');
      if (msg.includes("Cannot read properties of undefined (reading 'isElement')")) {
        event.preventDefault();
      }
      if (msg.includes('google-analytics.com') || msg.includes('mp/collect?measurement_id=')) {
        event.preventDefault();
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      const reason = String((event as any)?.reason?.message || (event as any)?.reason || '');
      if (reason.includes("Cannot read properties of undefined (reading 'isElement')") ||
          reason.includes('google-analytics.com') ||
          reason.includes('mp/collect?measurement_id=')) {
        event.preventDefault();
      }
    });
  }

  /**
   * Initialize the network resilience service
   */
  initialize(): void {
    this.setupNetworkMonitoring();
    this.suppressExpectedErrors();
    console.log('Network resilience service initialized');
  }
}

export const networkResilience = NetworkResilienceService.getInstance();
export default networkResilience; 