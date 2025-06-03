/**
 * Utility to inject polyfills into iframes
 * This helps with Google authentication iframes that may need polyfills
 */

// Browser API polyfill script
const browserPolyfillScript = `
  if (typeof browser === 'undefined') {
    window.browser = {
      runtime: { 
        sendMessage: () => Promise.resolve(),
        onMessage: {
          addListener: () => {},
          removeListener: () => {}
        },
        getURL: (path) => path
      },
      tabs: {
        query: () => Promise.resolve([]),
        sendMessage: () => Promise.resolve(),
        create: () => Promise.resolve({}),
        update: () => Promise.resolve()
      },
      storage: {
        local: {
          get: () => Promise.resolve({}),
          set: () => Promise.resolve()
        },
        sync: {
          get: () => Promise.resolve({}),
          set: () => Promise.resolve()
        }
      },
      i18n: {
        getMessage: () => ''
      }
    };
    console.log('[Polyfill] Browser API polyfilled');
  }
`;

// Trusted Types polyfill script
const trustedTypesPolyfillScript = `
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    try {
      window.trustedTypes.createPolicy('default', {
        createHTML: (string) => string,
        createScriptURL: (string) => string,
        createScript: (string) => string
      });
      console.log('[Polyfill] Default TrustedTypes policy created');
    } catch (e) {
      console.log('[Polyfill] Default policy already exists');
    }
    
    try {
      window.trustedTypes.createPolicy('firebase-js-sdk-policy', {
        createScriptURL: (string) => string
      });
      console.log('[Polyfill] Firebase TrustedTypes policy created');
    } catch (e) {
      console.log('[Polyfill] Firebase policy already exists');
    }
  }
`;

/**
 * Observes and injects polyfills into any iframes added to the document
 */
export function setupIframePolyfills() {
  // Inject into existing iframes
  const existingIframes = document.querySelectorAll('iframe');
  existingIframes.forEach(injectPolyfillsIntoIframe);
  
  // Set up observer for future iframes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // Check if any iframes were added
        if (node.nodeName === 'IFRAME') {
          injectPolyfillsIntoIframe(node as HTMLIFrameElement);
        } else if (node.nodeType === 1) {
          // Check for iframes inside added DOM nodes
          const iframes = (node as Element).querySelectorAll('iframe');
          iframes.forEach(injectPolyfillsIntoIframe);
        }
      });
    });
  });
  
  // Start observing document for iframe additions
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  console.log('[Polyfill] Iframe observer started');
  
  return () => observer.disconnect();
}

/**
 * Injects polyfills into an iframe
 */
function injectPolyfillsIntoIframe(iframe: HTMLIFrameElement) {
  // Wait for iframe to load
  iframe.addEventListener('load', () => {
    try {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (!iframeDocument) {
        console.log('[Polyfill] Cannot access iframe content (likely cross-origin)');
        return;
      }
      
      // Create and inject browser polyfill script
      const browserScript = iframeDocument.createElement('script');
      browserScript.textContent = browserPolyfillScript;
      iframeDocument.head.appendChild(browserScript);
      
      // Create and inject trusted types polyfill script
      const trustedTypesScript = iframeDocument.createElement('script');
      trustedTypesScript.textContent = trustedTypesPolyfillScript;
      iframeDocument.head.appendChild(trustedTypesScript);
      
      console.log('[Polyfill] Injected polyfills into iframe:', iframe.src);
    } catch (error) {
      console.log('[Polyfill] Error injecting into iframe:', error);
    }
  });
} 