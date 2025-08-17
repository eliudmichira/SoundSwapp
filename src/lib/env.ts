/// <reference types="vite/client" />
/// <reference path="../vite-env.d.ts" />
import { z } from 'zod';

// Helper: read from both import.meta.env and process.env, with VITE_ and non-VITE fallbacks
function readEnv(name: string, fallbackNames: string[] = []): string | undefined {
  let viteEnv: any = {};
  try {
    // @ts-ignore - import.meta may not exist in Node
    viteEnv = (typeof window !== 'undefined' && import.meta?.env) || {};
  } catch (e) {
    // ignore if import.meta is not available
  }
  
  const nodeEnv = (typeof process !== 'undefined' && process.env) ? process.env : {};

  const candidates = [name, ...fallbackNames];
  for (const key of candidates) {
    if (viteEnv?.[key]) return viteEnv[key];
    if (nodeEnv?.[key]) return nodeEnv[key];
  }
  return undefined;
}

// Environment configuration for SoundSwapp
export const getAppUrl = (): string => {
  const envUrl = readEnv('VITE_APP_URL', ['APP_URL', 'BASE_URL']);
  
  console.log('[env] getAppUrl() debug:', {
    envUrl,
    hasWindow: typeof window !== 'undefined',
    windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'N/A',
    fallback: 'https://soundswapp.firebaseapp.com'
  });
  
  if (envUrl && envUrl.length > 0) {
    console.log('[env] Using environment app URL:', envUrl);
    return envUrl;
  }
  
  // Use current window location if available (for both firebaseapp.com and web.app domains)
  if (typeof window !== 'undefined' && window.location.origin) {
    console.log('[env] Using window location origin:', window.location.origin);
    return window.location.origin;
  }
  
  // Fallback to firebaseapp.com to match the actual deployment
  console.log('[env] Using fallback app URL: https://soundswapp.firebaseapp.com');
  return 'https://soundswapp.firebaseapp.com';
};

export const getCallbackUrl = (): string => {
  const envCallback = readEnv('VITE_CALLBACK_URL', ['CALLBACK_URL']);
  if (envCallback) {
    return envCallback;
  }
  
  // Use the exact callback URL specified in environment
  return `${getAppUrl()}/callback`;
};

export const getSpotifyCallbackUrl = (): string => {
  const envRedirect = readEnv('VITE_SPOTIFY_REDIRECT_URI', ['SPOTIFY_REDIRECT_URI']);
  if (envRedirect) {
    console.log('[env] Using environment Spotify redirect URI:', envRedirect);
    return envRedirect;
  }
  
  // Get the app URL and construct callback
  const appUrl = getAppUrl();
  const callbackUrl = `${appUrl}/callback`;
  
  console.log('[env] Constructed Spotify callback URL:', {
    appUrl,
    callbackUrl,
    currentLocation: typeof window !== 'undefined' ? window.location.href : 'N/A'
  });
  
  // Ensure we have a valid URL
  if (!appUrl || appUrl === 'undefined' || callbackUrl.includes('undefined')) {
    const fallbackUrl = 'https://soundswapp.firebaseapp.com/callback';
    console.warn('[env] Invalid app URL detected, using fallback:', fallbackUrl);
    return fallbackUrl;
  }
  
  return callbackUrl;
};

export const getYouTubeCallbackUrl = (): string => {
  const envRedirect = readEnv('VITE_YOUTUBE_REDIRECT_URI', ['YOUTUBE_REDIRECT_URI']);
  if (envRedirect) {
    return envRedirect;
  }
  // Default to the specific URL format you're using
  return `${getAppUrl()}/youtube-callback`;
};

// Zod schema for env validation (optional to support Node and various builds)
const EnvSchema = z.object({
  VITE_SPOTIFY_CLIENT_ID: z.string().optional(),
  VITE_SPOTIFY_CLIENT_SECRET: z.string().optional(),
  VITE_YOUTUBE_CLIENT_ID: z.string().optional(),
  VITE_YOUTUBE_CLIENT_SECRET: z.string().optional(),
  VITE_YOUTUBE_REDIRECT_URI: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_APP_URL: z.string().optional(),
});

let envToValidate: any = {};
try {
  // @ts-ignore - import.meta may not exist in Node
  envToValidate = import.meta?.env || {};
} catch (e) {
  // ignore if import.meta is not available
}

const parsedEnv = EnvSchema.safeParse(envToValidate);
if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map((i: z.ZodIssue) => i.message).join('; ');
  const isProduction = envToValidate.PROD || process.env.NODE_ENV === 'production';
  if (isProduction) {
    console.warn(`Env validation warnings: ${issues}`);
  }
}

// Firebase configuration (temporarily hardcoded to ensure it works)
export const firebaseConfig = {
  apiKey: 'AIzaSyCSjfXh6sHtx1rr1-WLR4ffFHf5lB8gFEA',
  authDomain: 'soundswapp.firebaseapp.com',
  projectId: 'soundswapp',
  storageBucket: 'soundswapp.firebasestorage.app',
  messagingSenderId: '968024909043',
  appId: '1:968024909043:web:9509472d462be5d3e70386',
  measurementId: 'G-F3T0GDR2ZV'
};

// Spotify configuration (with fallback for redirect URI to ensure it's always valid)
export const spotifyConfig = {
  clientId: '7a6f0eca3eb64dd49809a47d19d0cd13',
  clientSecret: '9e88e567c0104528a76b31bf4d8b067b',
  redirectUri: (() => {
    const envRedirect = readEnv('VITE_SPOTIFY_REDIRECT_URI', ['SPOTIFY_REDIRECT_URI']);
    if (envRedirect) {
      console.log('[Spotify Config] Using environment redirect URI:', envRedirect);
      return envRedirect;
    }
    
    // Use Firebase domain for consistency with YouTube
    const callbackUrl = 'https://soundswapp.firebaseapp.com/callback';
    console.log('[Spotify Config] Using Firebase domain callback URL:', callbackUrl);
    return callbackUrl;
  })(),
  scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private'
};

// YouTube fallback configuration
const YOUTUBE_FALLBACK_CONFIG = {
  clientId: '968024909043-qv0sceqajnebc6m3088eoq519n3epbua.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'https://soundswapp.firebaseapp.com/youtube-callback'
};

// YouTube configuration
export const youtubeConfig = {
  clientId: readEnv('VITE_YOUTUBE_CLIENT_ID', ['YOUTUBE_CLIENT_ID', 'VITE_GOOGLE_CLIENT_ID']) || YOUTUBE_FALLBACK_CONFIG.clientId,
  clientSecret: readEnv('VITE_YOUTUBE_CLIENT_SECRET', ['YOUTUBE_CLIENT_SECRET', 'VITE_GOOGLE_CLIENT_SECRET']) || YOUTUBE_FALLBACK_CONFIG.clientSecret,
  redirectUri: getYouTubeCallbackUrl(),
  scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl'
};

// Debug YouTube configuration loading
console.log('[YouTube Config] Environment variables debug:', {
  VITE_YOUTUBE_CLIENT_ID: import.meta.env?.VITE_YOUTUBE_CLIENT_ID ? 'SET' : 'MISSING',
  VITE_GOOGLE_CLIENT_ID: import.meta.env?.VITE_GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
  VITE_YOUTUBE_CLIENT_SECRET: import.meta.env?.VITE_YOUTUBE_CLIENT_SECRET ? 'SET' : 'MISSING',
  VITE_GOOGLE_CLIENT_SECRET: import.meta.env?.VITE_GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
  VITE_YOUTUBE_REDIRECT_URI: import.meta.env?.VITE_YOUTUBE_REDIRECT_URI ? 'SET' : 'MISSING',
  resolved_clientId: youtubeConfig.clientId ? `${youtubeConfig.clientId.substring(0, 10)}...` : 'MISSING',
  resolved_clientSecret: youtubeConfig.clientSecret ? 'SET' : 'MISSING',
  resolved_redirectUri: youtubeConfig.redirectUri
});