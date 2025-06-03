// Add TypeScript declarations for Trusted Types
interface TrustedTypePolicyOptions {
  createHTML?: (html: string) => TrustedHTML;
  createScriptURL?: (url: string) => TrustedScriptURL;
  createScript?: (script: string) => TrustedScript;
}

interface TrustedTypePolicy {
  createHTML: (html: string) => TrustedHTML;
  createScriptURL: (url: string) => TrustedScriptURL;
  createScript: (script: string) => TrustedScript;
}

// Declare the window.trustedTypes property separately instead of extending Window
declare global {
  interface Window {
    trustedTypes?: {
      createPolicy: (
        policyName: string, 
        policyOptions: TrustedTypePolicyOptions
      ) => TrustedTypePolicy;
    };
  }
}

// Add missing TrustedHTML and TrustedScriptURL interfaces
interface TrustedHTML {}
interface TrustedScriptURL {}
interface TrustedScript {}

import DOMPurify from 'dompurify';

// Create a DOMPurify instance with Trusted Types support
export const createDOMPurify = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const purify = DOMPurify(window as any);

  // Add trusted types support if available
  if (window.trustedTypes && typeof window.trustedTypes.createPolicy === 'function') {
    purify.setConfig({
      RETURN_TRUSTED_TYPE: true
    });
  }

  return purify;
};

// Initialize DOMPurify
const purify = createDOMPurify();

/**
 * Sanitize HTML and return a trusted HTML string
 */
export const sanitizeHTML = (html: string): string | TrustedHTML => {
  if (!purify) {
    return '';
  }
  return purify.sanitize(html, { USE_PROFILES: { html: true } });
};

/**
 * Create a trusted script URL
 */
export const sanitizeScriptURL = (url: string): string | TrustedScriptURL => {
  if (!purify) {
    return '';
  }
  
  // Validate URL is from allowed domains
  const allowedDomains = [
    'accounts.spotify.com',
    'api.spotify.com',
    'accounts.google.com',
    'oauth2.googleapis.com',
    'www.googleapis.com'
  ];
  
  try {
    const urlObj = new URL(url);
    if (!allowedDomains.some(domain => urlObj.hostname === domain)) {
      console.error(`URL domain not allowed: ${urlObj.hostname}`);
      return '';
    }
  } catch (e) {
    console.error('Invalid URL:', url);
    return '';
  }
  
  // Create a specific Trusted Types policy for script URLs if supported
  if (window.trustedTypes && typeof window.trustedTypes.createPolicy === 'function') {
    try {
      const scriptURLPolicy = window.trustedTypes.createPolicy('scriptURLPolicy', {
        createScriptURL: (scriptUrl: string) => {
          // Additional validation can be done here
          return scriptUrl;
        }
      });
      return scriptURLPolicy.createScriptURL(url);
    } catch (e) {
      console.error('Error creating scriptURL policy:', e);
      return '';
    }
  }
  
  // Fall back to string if Trusted Types not supported
  return url;
};

export default purify; 