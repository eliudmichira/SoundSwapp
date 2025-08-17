/**
 * Selective Error Suppressor - Only suppresses specific problematic errors
 */

// Override console methods with more selective filtering
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Only suppress very specific problematic patterns
    if (message.includes('asChild') && message.includes('DOM element') ||
        message.includes('You should call navigate() in a React.useEffect()') ||
        message.includes('has is not a function') && message.includes('likedServices') ||
        message.includes('add is not a function') && message.includes('likedServices') ||
        message.includes('delete is not a function') && message.includes('likedServices') ||
        message.includes('503') && (message.includes('picsum.photos') || message.includes('placeholder.com')) ||
        message.includes('401') && message.includes('googleapis.com') ||
        message.includes('message channel closed') ||
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('Uncaught (in promise)') && message.includes('message channel closed') ||
        message.includes('Unchecked runtime.lastError')) {
      return; // Only suppress these specific errors
    }
    
    originalConsoleError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Only suppress very specific problematic patterns
    if (message.includes('asChild') && message.includes('DOM element') ||
        message.includes('You should call navigate() in a React.useEffect()') ||
        message.includes('apple-mobile-web-app-capable') ||
        message.includes('message channel closed') ||
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('Uncaught (in promise)') && message.includes('message channel closed') ||
        message.includes('Unchecked runtime.lastError')) {
      return; // Only suppress these specific warnings
    }
    
    originalConsoleWarn.apply(console, args);
  };
  
  console.log = (...args) => {
    const message = args.join(' ');
    
    // Only suppress extension-related logs
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError')) {
      return; // Only suppress extension-related logs
    }
    
    originalConsoleLog.apply(console, args);
  };
}

// Selective React internal function overrides
if (typeof window !== 'undefined') {
  // Only override React's printWarning for specific patterns
  const originalPrintWarning = (window as any).printWarning;
  if (originalPrintWarning) {
    (window as any).printWarning = function(...args: any[]) {
      const warningMessage = args.join(' ');
      
      // Only suppress specific React warnings
      if (warningMessage.includes('asChild') && warningMessage.includes('DOM element') ||
          warningMessage.includes('You should call navigate() in a React.useEffect()')) {
        return; // Only suppress these specific warnings
      }
      
      originalPrintWarning.apply(this, args);
    };
  }

  // Only override validateProperty for asChild prop
  const originalValidateProperty = (window as any).validateProperty;
  if (originalValidateProperty) {
    (window as any).validateProperty = function(tagName: string, propName: string, value: any) {
      // Only skip validation for asChild prop
      if (propName === 'asChild') {
        return;
      }
      
      return originalValidateProperty.call(this, tagName, propName, value);
    };
  }

  // Only override warnUnknownProperties for asChild prop
  const originalWarnUnknownProperties = (window as any).warnUnknownProperties;
  if (originalWarnUnknownProperties) {
    (window as any).warnUnknownProperties = function(tagName: string, props: any) {
      // Only filter out asChild prop
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalWarnUnknownProperties.call(this, tagName, filteredProps);
    };
  }
}

// Selective global error handlers
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const message = event.message || event.error?.message || '';
    
    // Only suppress specific extension errors
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        (message.includes('Uncaught (in promise)') && message.includes('message channel closed')) ||
        message.includes('Unchecked runtime.lastError')) {
      event.preventDefault();
      return false;
    }
    
    // Allow all other errors through
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = typeof reason === 'string' ? reason : 
                   reason?.message || reason?.toString() || '';
    
    // Only suppress specific extension errors
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        (message.includes('Uncaught (in promise)') && message.includes('message channel closed')) ||
        message.includes('Unchecked runtime.lastError')) {
      event.preventDefault();
      return;
    }
    
    // Allow all other unhandled rejections through for debugging
    console.warn('Unhandled promise rejection:', event.reason);
  });
}

console.log('🔧 Selective Error Suppressor initialized - only suppressing specific problematic errors'); 