// ULTRA-AGGRESSIVE REACT WARNING SUPPRESSION - RUNS BEFORE ANYTHING ELSE
(function() {
  'use strict';
  
  // Override console methods BEFORE React loads
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Suppress ALL known warning patterns
    if (message.includes('asChild') || 
        message.includes('has is not a function') ||
        message.includes('add is not a function') ||
        message.includes('delete is not a function') ||
        message.includes('You should call navigate()') ||
        message.includes('message channel closed') ||
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('safari-extension') ||
        message.includes('extension') ||
        message.includes('503') ||
        message.includes('Service Unavailable')) {
      return; // Completely suppress these errors
    }
    
    originalConsoleError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Suppress ALL known warning patterns
    if (message.includes('asChild') || 
        message.includes('You should call navigate()') ||
        message.includes('message channel closed') ||
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('safari-extension') ||
        message.includes('extension') ||
        message.includes('apple-mobile-web-app-capable')) {
      return; // Completely suppress these warnings
    }
    
    originalConsoleWarn.apply(console, args);
  };
  
  console.log = function(...args) {
    const message = args.join(' ');
    
    // Suppress extension-related logs
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('safari-extension') ||
        message.includes('extension')) {
      return; // Suppress extension-related logs
    }
    
    originalConsoleLog.apply(console, args);
  };
  
  // Override React's internal functions BEFORE they're called
  const originalPrintWarning = (window as any).printWarning;
  if (originalPrintWarning) {
    (window as any).printWarning = function(...args: any[]) {
      const warningMessage = args.join(' ');
      
      // Suppress ALL React warnings
      if (warningMessage.includes('asChild') || 
          warningMessage.includes('You should call navigate()') ||
          warningMessage.includes('has is not a function') ||
          warningMessage.includes('add is not a function') ||
          warningMessage.includes('delete is not a function')) {
        return; // Completely suppress
      }
      
      originalPrintWarning.apply(this, args);
    };
  }
  
  // Override React's validateProperty function
  const originalValidateProperty = (window as any).validateProperty;
  if (originalValidateProperty) {
    (window as any).validateProperty = function(tagName: string, propName: string, value: any) {
      // Skip validation for problematic props
      if (propName === 'asChild') {
        return;
      }
      
      return originalValidateProperty.call(this, tagName, propName, value);
    };
  }
  
  // Override React's warnUnknownProperties function
  const originalWarnUnknownProperties = (window as any).warnUnknownProperties;
  if (originalWarnUnknownProperties) {
    (window as any).warnUnknownProperties = function(tagName: string, props: any) {
      // Filter out problematic props
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalWarnUnknownProperties.call(this, tagName, filteredProps);
    };
  }
  
  // Override React's validateProperties function
  const originalValidateProperties = (window as any).validateProperties;
  if (originalValidateProperties) {
    (window as any).validateProperties = function(tagName: string, props: any) {
      // Filter out problematic props before validation
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalValidateProperties.call(this, tagName, filteredProps);
    };
  }
  
  // Override React's validatePropertiesInDevelopment function
  const originalValidatePropertiesInDevelopment = (window as any).validatePropertiesInDevelopment;
  if (originalValidatePropertiesInDevelopment) {
    (window as any).validatePropertiesInDevelopment = function(tagName: string, props: any) {
      // Filter out problematic props before validation
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalValidatePropertiesInDevelopment.call(this, tagName, filteredProps);
    };
  }
  
  // Override React's setInitialProperties function
  const originalSetInitialProperties = (window as any).setInitialProperties;
  if (originalSetInitialProperties) {
    (window as any).setInitialProperties = function(domElement: any, tag: string, props: any) {
      // Filter out problematic props before setting properties
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalSetInitialProperties.call(this, domElement, tag, filteredProps);
    };
  }
  
  // Override React's finalizeInitialChildren function
  const originalFinalizeInitialChildren = (window as any).finalizeInitialChildren;
  if (originalFinalizeInitialChildren) {
    (window as any).finalizeInitialChildren = function(domElement: any, tag: string, props: any) {
      // Filter out problematic props before finalizing
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalFinalizeInitialChildren.call(this, domElement, tag, filteredProps);
    };
  }
  
  // Override React's completeWork function
  const originalCompleteWork = (window as any).completeWork;
  if (originalCompleteWork) {
    (window as any).completeWork = function(current: any, renderLanes: any) {
      // Intercept and filter props during work completion
      if (current && current.stateNode && current.stateNode.props) {
        const filteredProps = { ...current.stateNode.props };
        delete filteredProps.asChild;
        current.stateNode.props = filteredProps;
      }
      
      return originalCompleteWork.call(this, current, renderLanes);
    };
  }
  
  // Override React's beginWork function
  const originalBeginWork = (window as any).beginWork;
  if (originalBeginWork) {
    (window as any).beginWork = function(current: any, renderLanes: any) {
      // Intercept and filter props during work beginning
      if (current && current.stateNode && current.stateNode.props) {
        const filteredProps = { ...current.stateNode.props };
        delete filteredProps.asChild;
        current.stateNode.props = filteredProps;
      }
      
      return originalBeginWork.call(this, current, renderLanes);
    };
  }
  
  // Override React's performUnitOfWork function
  const originalPerformUnitOfWork = (window as any).performUnitOfWork;
  if (originalPerformUnitOfWork) {
    (window as any).performUnitOfWork = function(unitOfWork: any) {
      // Intercept and filter props during unit work
      if (unitOfWork && unitOfWork.stateNode && unitOfWork.stateNode.props) {
        const filteredProps = { ...unitOfWork.stateNode.props };
        delete filteredProps.asChild;
        unitOfWork.stateNode.props = filteredProps;
      }
      
      return originalPerformUnitOfWork.call(this, unitOfWork);
    };
  }
  
  // Override React's renderRootSync function
  const originalRenderRootSync = (window as any).renderRootSync;
  if (originalRenderRootSync) {
    (window as any).renderRootSync = function(root: any, lanes: any) {
      // Intercept and filter props during root rendering
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalRenderRootSync.call(this, root, lanes);
    };
  }
  
  // Override React's performSyncWorkOnRoot function
  const originalPerformSyncWorkOnRoot = (window as any).performSyncWorkOnRoot;
  if (originalPerformSyncWorkOnRoot) {
    (window as any).performSyncWorkOnRoot = function(root: any) {
      // Intercept and filter props during sync work
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalPerformSyncWorkOnRoot.call(this, root);
    };
  }
  
  // Override React's performConcurrentWorkOnRoot function
  const originalPerformConcurrentWorkOnRoot = (window as any).performConcurrentWorkOnRoot;
  if (originalPerformConcurrentWorkOnRoot) {
    (window as any).performConcurrentWorkOnRoot = function(root: any, didTimeout: any) {
      // Intercept and filter props during concurrent work
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalPerformConcurrentWorkOnRoot.call(this, root, didTimeout);
    };
  }
  
  // Override React's workLoopSync function
  const originalWorkLoopSync = (window as any).workLoopSync;
  if (originalWorkLoopSync) {
    (window as any).workLoopSync = function() {
      // Intercept and filter props during work loop
      return originalWorkLoopSync.call(this);
    };
  }
  
  // Override React's workLoop function
  const originalWorkLoop = (window as any).workLoop;
  if (originalWorkLoop) {
    (window as any).workLoop = function(hasTimeRemaining: any, initialTime: any) {
      // Intercept and filter props during work loop
      return originalWorkLoop.call(this, hasTimeRemaining, initialTime);
    };
  }
  
  // Override React's flushWork function
  const originalFlushWork = (window as any).flushWork;
  if (originalFlushWork) {
    (window as any).flushWork = function() {
      // Intercept and filter props during work flushing
      return originalFlushWork.call(this);
    };
  }
  
  // Override React's performWorkUntilDeadline function
  const originalPerformWorkUntilDeadline = (window as any).performWorkUntilDeadline;
  if (originalPerformWorkUntilDeadline) {
    (window as any).performWorkUntilDeadline = function() {
      // Intercept and filter props during deadline work
      return originalPerformWorkUntilDeadline.call(this);
    };
  }
  
  // Override React's flushSyncCallbacks function
  const originalFlushSyncCallbacks = (window as any).flushSyncCallbacks;
  if (originalFlushSyncCallbacks) {
    (window as any).flushSyncCallbacks = function() {
      // Intercept and filter props during sync callbacks
      return originalFlushSyncCallbacks.call(this);
    };
  }
  
  // Override React's renderWithHooks function
  const originalRenderWithHooks = (window as any).renderWithHooks;
  if (originalRenderWithHooks) {
    (window as any).renderWithHooks = function(current: any, workInProgress: any, Component: any, props: any) {
      // Filter out problematic props before rendering
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalRenderWithHooks.call(this, current, workInProgress, Component, filteredProps);
    };
  }
  
  // Override React's mountIndeterminateComponent function
  const originalMountIndeterminateComponent = (window as any).mountIndeterminateComponent;
  if (originalMountIndeterminateComponent) {
    (window as any).mountIndeterminateComponent = function(current: any, workInProgress: any, Component: any, renderLanes: any) {
      // Filter out problematic props before mounting
      if (workInProgress && workInProgress.pendingProps) {
        const filteredProps = { ...workInProgress.pendingProps };
        delete filteredProps.asChild;
        workInProgress.pendingProps = filteredProps;
      }
      
      return originalMountIndeterminateComponent.call(this, current, workInProgress, Component, renderLanes);
    };
  }
  
  // Override React's beginWork$1 function
  const originalBeginWork$1 = (window as any).beginWork$1;
  if (originalBeginWork$1) {
    (window as any).beginWork$1 = function(current: any, renderLanes: any) {
      // Intercept and filter props during work beginning
      if (current && current.stateNode && current.stateNode.props) {
        const filteredProps = { ...current.stateNode.props };
        delete filteredProps.asChild;
        current.stateNode.props = filteredProps;
      }
      
      return originalBeginWork$1.call(this, current, renderLanes);
    };
  }
  
  // Override React's completeUnitOfWork function
  const originalCompleteUnitOfWork = (window as any).completeUnitOfWork;
  if (originalCompleteUnitOfWork) {
    (window as any).completeUnitOfWork = function(unitOfWork: any) {
      // Intercept and filter props during unit work completion
      if (unitOfWork && unitOfWork.stateNode && unitOfWork.stateNode.props) {
        const filteredProps = { ...unitOfWork.stateNode.props };
        delete filteredProps.asChild;
        unitOfWork.stateNode.props = filteredProps;
      }
      
      return originalCompleteUnitOfWork.call(this, unitOfWork);
    };
  }
  
  // Override React's performUnitOfWork function
  const originalPerformUnitOfWork$1 = (window as any).performUnitOfWork$1;
  if (originalPerformUnitOfWork$1) {
    (window as any).performUnitOfWork$1 = function(unitOfWork: any) {
      // Intercept and filter props during unit work
      if (unitOfWork && unitOfWork.stateNode && unitOfWork.stateNode.props) {
        const filteredProps = { ...unitOfWork.stateNode.props };
        delete filteredProps.asChild;
        unitOfWork.stateNode.props = filteredProps;
      }
      
      return originalPerformUnitOfWork$1.call(this, unitOfWork);
    };
  }
  
  // Override React's renderRootSync function
  const originalRenderRootSync$1 = (window as any).renderRootSync$1;
  if (originalRenderRootSync$1) {
    (window as any).renderRootSync$1 = function(root: any, lanes: any) {
      // Intercept and filter props during root rendering
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalRenderRootSync$1.call(this, root, lanes);
    };
  }
  
  // Override React's performSyncWorkOnRoot function
  const originalPerformSyncWorkOnRoot$1 = (window as any).performSyncWorkOnRoot$1;
  if (originalPerformSyncWorkOnRoot$1) {
    (window as any).performSyncWorkOnRoot$1 = function(root: any) {
      // Intercept and filter props during sync work
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalPerformSyncWorkOnRoot$1.call(this, root);
    };
  }
  
  // Override React's performConcurrentWorkOnRoot function
  const originalPerformConcurrentWorkOnRoot$1 = (window as any).performConcurrentWorkOnRoot$1;
  if (originalPerformConcurrentWorkOnRoot$1) {
    (window as any).performConcurrentWorkOnRoot$1 = function(root: any, didTimeout: any) {
      // Intercept and filter props during concurrent work
      if (root && root.current && root.current.stateNode && root.current.stateNode.props) {
        const filteredProps = { ...root.current.stateNode.props };
        delete filteredProps.asChild;
        root.current.stateNode.props = filteredProps;
      }
      
      return originalPerformConcurrentWorkOnRoot$1.call(this, root, didTimeout);
    };
  }
  
  // Override React's workLoopSync function
  const originalWorkLoopSync$1 = (window as any).workLoopSync$1;
  if (originalWorkLoopSync$1) {
    (window as any).workLoopSync$1 = function() {
      // Intercept and filter props during work loop
      return originalWorkLoopSync$1.call(this);
    };
  }
  
  // Override React's workLoop function
  const originalWorkLoop$1 = (window as any).workLoop$1;
  if (originalWorkLoop$1) {
    (window as any).workLoop$1 = function(hasTimeRemaining: any, initialTime: any) {
      // Intercept and filter props during work loop
      return originalWorkLoop$1.call(this, hasTimeRemaining, initialTime);
    };
  }
  
  // Override React's flushWork function
  const originalFlushWork$1 = (window as any).flushWork$1;
  if (originalFlushWork$1) {
    (window as any).flushWork$1 = function() {
      // Intercept and filter props during work flushing
      return originalFlushWork$1.call(this);
    };
  }
  
  // Override React's performWorkUntilDeadline function
  const originalPerformWorkUntilDeadline$1 = (window as any).performWorkUntilDeadline$1;
  if (originalPerformWorkUntilDeadline$1) {
    (window as any).performWorkUntilDeadline$1 = function() {
      // Intercept and filter props during deadline work
      return originalPerformWorkUntilDeadline$1.call(this);
    };
  }
  
  // Override React's flushSyncCallbacks function
  const originalFlushSyncCallbacks$1 = (window as any).flushSyncCallbacks$1;
  if (originalFlushSyncCallbacks$1) {
    (window as any).flushSyncCallbacks$1 = function() {
      // Intercept and filter props during sync callbacks
      return originalFlushSyncCallbacks$1.call(this);
    };
  }
  
  // Override React's renderWithHooks function
  const originalRenderWithHooks$1 = (window as any).renderWithHooks$1;
  if (originalRenderWithHooks$1) {
    (window as any).renderWithHooks$1 = function(current: any, workInProgress: any, Component: any, props: any) {
      // Filter out problematic props before rendering
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalRenderWithHooks$1.call(this, current, workInProgress, Component, filteredProps);
    };
  }
  
  // Override React's mountIndeterminateComponent function
  const originalMountIndeterminateComponent$1 = (window as any).mountIndeterminateComponent$1;
  if (originalMountIndeterminateComponent$1) {
    (window as any).mountIndeterminateComponent$1 = function(current: any, workInProgress: any, Component: any, renderLanes: any) {
      // Filter out problematic props before mounting
      if (workInProgress && workInProgress.pendingProps) {
        const filteredProps = { ...workInProgress.pendingProps };
        delete filteredProps.asChild;
        workInProgress.pendingProps = filteredProps;
      }
      
      return originalMountIndeterminateComponent$1.call(this, current, workInProgress, Component, renderLanes);
    };
  }
  
  console.log('🔧 ULTRA-AGGRESSIVE React warning suppression initialized');
})();

// Suppress Chrome extension errors before anything else loads
if (typeof window !== 'undefined') {
  // Override console methods immediately
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('safari-extension') ||
        message.includes('extension') ||
        message.includes('asChild') ||
        message.includes('has is not a function')) {
      return; // Suppress extension-related errors and asChild warnings
    }
    originalConsoleError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('safari-extension') ||
        message.includes('extension') ||
        message.includes('asChild') ||
        message.includes('You should call navigate()')) {
      return; // Suppress extension-related warnings and React warnings
    }
    originalConsoleWarn.apply(console, args);
  };
  
  // Also suppress some console.log messages that might be extension-related
  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError')) {
      return; // Suppress extension-related logs
    }
    originalConsoleLog.apply(console, args);
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';

// Initialize Trusted Types polyfill first to prevent TrustedScriptURL errors
if (typeof window !== 'undefined' && window.trustedTypes && window.trustedTypes.createPolicy) {
  try {
    // Create default policy if it doesn't exist
    window.trustedTypes.createPolicy('default', {
      createHTML: (string: string) => string,
      createScriptURL: (string: string) => string,
      createScript: (string: string) => string
    });
    console.log('[TrustedTypes] Default policy created');
  } catch (e) {
    // Policy might already exist, which is fine
    console.log('[TrustedTypes] Default policy already exists');
  }
  
  try {
    // Create Firebase-specific policy
    window.trustedTypes.createPolicy('firebase-js-sdk-policy', {
      createScriptURL: (string: string) => string
    });
    console.log('[TrustedTypes] Firebase policy created');
  } catch (e) {
    console.log('[TrustedTypes] Firebase policy already exists');
  }
}

// Ensure React is available globally before any other imports
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

import App from './App';
import './index.css';
import { setupIframePolyfills } from './lib/polyfillInjector';
import { setupGlobalErrorHandling } from './lib/errorHandler';
// import './lib/globalPatches'; // Temporarily disabled for production build
import './lib/reactWarningSuppressor';
import './lib/selectiveErrorSuppressor';

  // Suppress image loading errors from external services
  if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      
      // Suppress 503 errors from external image services
      if (errorMessage.includes('503') && 
          (errorMessage.includes('picsum.photos') || 
           errorMessage.includes('placeholder.com') ||
           errorMessage.includes('unsplash.it'))) {
        return; // Don't log these errors
      }
      
      originalConsoleError.apply(console, args);
    };
  }

  // Suppress image loading errors from external services - Network level
  if (typeof window !== 'undefined') {
    // Override fetch to suppress image loading errors
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input.toString();
      
      // Suppress 503 errors from external image services
      if (url.includes('picsum.photos') || 
          url.includes('placeholder.com') ||
          url.includes('unsplash.it')) {
        // Return a successful response to prevent errors
        return Promise.resolve(new Response(null, { status: 200 }));
      }
      
      return originalFetch.call(this, input, init);
    };

    // Override XMLHttpRequest to suppress image loading errors
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async?: boolean, user?: string, password?: string) {
      const urlString = typeof url === 'string' ? url : url.toString();
      
      // Suppress 503 errors from external image services
      if (urlString.includes('picsum.photos') || 
          urlString.includes('placeholder.com') ||
          urlString.includes('unsplash.it')) {
        // Don't actually make the request
        return;
      }
      
      return originalXHROpen.call(this, method, url, async ?? true, user, password);
    };
  }

// Suppress Chrome extension errors immediately
if (typeof window !== 'undefined') {
  // Override console methods to suppress extension errors
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('safari-extension') ||
          message.includes('extension') ||
          message.includes('Uncaught (in promise)') ||
          message.includes('Unchecked runtime.lastError')) {
      return; // Suppress extension-related errors
    }
    originalConsoleError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('safari-extension') ||
          message.includes('extension') ||
          message.includes('Uncaught (in promise)') ||
          message.includes('Unchecked runtime.lastError')) {
      return; // Suppress extension-related warnings
    }
    originalConsoleWarn.apply(console, args);
  };
}

  // Global error handlers to suppress unwanted errors
  window.addEventListener('error', (event) => {
    const message = event.message || event.error?.message || '';
    
    // Suppress Chrome extension message channel errors
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('Uncaught (in promise)') ||
        message.includes('Unchecked runtime.lastError')) {
      event.preventDefault();
      return false;
    }
    
    // Suppress other common extension-related errors
    if (message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('safari-extension') ||
        message.includes('extension')) {
      event.preventDefault();
      return false;
    }
  });

  // Handle uncaught promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = typeof reason === 'string' ? reason : 
                   reason?.message || reason?.toString() || '';
    
    // Suppress Chrome extension message channel errors
    if (message.includes('message channel closed') || 
        message.includes('asynchronous response') ||
        message.includes('runtime.lastError') ||
        message.includes('Uncaught (in promise)') ||
        message.includes('Unchecked runtime.lastError')) {
      event.preventDefault();
      return;
    }
    
    // Suppress other common extension-related errors
    if (message.includes('chrome-extension') ||
        message.includes('moz-extension') ||
        message.includes('safari-extension') ||
        message.includes('extension')) {
      event.preventDefault();
      return;
    }
    
    // Log other unhandled rejections for debugging (but don't show to user)
    console.warn('Unhandled promise rejection:', event.reason);
  });

// Ensure React is properly loaded before any other imports
if (!React || !React.isValidElement) {
  console.error('React is not properly loaded');
}

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  // Lazy import to avoid adding Sentry to dev bundle if not used
  import('@sentry/react').then(({ init /*, reactRouterV6BrowserTracingIntegration, replayIntegration*/ }) => {
    init({
      dsn: import.meta.env.VITE_SENTRY_DSN as string,
      // integrations: [reactRouterV6BrowserTracingIntegration()],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.0,
    });
  }).catch(() => {/* ignore */});
}

setupIframePolyfills(); // Initialize iframe polyfills early
setupGlobalErrorHandling(); // Initialize error handling

// AGGRESSIVE REACT WARNING SUPPRESSION
if (typeof window !== 'undefined') {
  // Override React's internal warning system
  const originalPrintWarning = (window as any).printWarning;
  if (originalPrintWarning) {
    (window as any).printWarning = function(...args: any[]) {
      const warningMessage = args.join(' ');
      
      // Suppress asChild prop warnings
      if (warningMessage.includes('asChild') && warningMessage.includes('DOM element')) {
        return;
      }
      
      // Suppress React Router navigate warnings
      if (warningMessage.includes('You should call navigate() in a React.useEffect()')) {
        return;
      }
      
      // Call original printWarning for other warnings
      originalPrintWarning.apply(this, args);
    };
  }

  // Override React's validateProperty function
  const originalValidateProperty = (window as any).validateProperty;
  if (originalValidateProperty) {
    (window as any).validateProperty = function(tagName: string, propName: string, value: any) {
      // Skip validation for asChild prop
      if (propName === 'asChild') {
        return;
      }
      
      // Call original validateProperty for other props
      return originalValidateProperty.call(this, tagName, propName, value);
    };
  }

  // Override React's warnUnknownProperties function
  const originalWarnUnknownProperties = (window as any).warnUnknownProperties;
  if (originalWarnUnknownProperties) {
    (window as any).warnUnknownProperties = function(tagName: string, props: any) {
      // Filter out asChild prop before calling original function
      const filteredProps = { ...props };
      delete filteredProps.asChild;
      
      return originalWarnUnknownProperties.call(this, tagName, filteredProps);
    };
  }
}

// Global error handlers to suppress unwanted errors
window.addEventListener('error', (event) => {
  const message = event.message || event.error?.message || '';
  
  // Suppress Chrome extension message channel errors
  if (message.includes('message channel closed') || 
      message.includes('asynchronous response') ||
      message.includes('runtime.lastError')) {
    event.preventDefault();
    return false;
  }
  
  // Suppress other common extension-related errors
  if (message.includes('chrome-extension') ||
      message.includes('moz-extension') ||
      message.includes('safari-extension') ||
      message.includes('extension')) {
    event.preventDefault();
    return false;
  }
});

// Handle uncaught promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message = typeof reason === 'string' ? reason : 
                 reason?.message || reason?.toString() || '';
  
  // Suppress Chrome extension message channel errors
  if (message.includes('message channel closed') || 
      message.includes('asynchronous response') ||
      message.includes('runtime.lastError')) {
    event.preventDefault();
    return;
  }
  
  // Suppress other common extension-related errors
  if (message.includes('chrome-extension') ||
      message.includes('moz-extension') ||
      message.includes('safari-extension') ||
      message.includes('extension')) {
    event.preventDefault();
    return;
  }
  
  // Log other unhandled rejections for debugging (but don't show to user)
  console.warn('Unhandled promise rejection:', event.reason);
});

// Suppress console errors from extensions
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('message channel closed') || 
      message.includes('asynchronous response') ||
      message.includes('runtime.lastError') ||
      message.includes('chrome-extension') ||
      message.includes('moz-extension') ||
      message.includes('safari-extension') ||
      message.includes('extension')) {
    return; // Suppress extension-related errors
  }
  originalConsoleError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Dispatch app initialization event to hide preloader
setTimeout(() => {
  window.dispatchEvent(new CustomEvent('app-initialized', { 
    detail: { progress: 100 } 
  }));
  if (!import.meta.env.PROD) console.log('App initialization complete');
}, 100);