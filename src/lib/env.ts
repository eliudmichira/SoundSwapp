/// <reference types="vite/client" />
/// <reference path="../vite-env.d.ts" />

// Helper to get the base URL dynamically
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // For client-side, use current domain
    return window.location.origin;
  }
  // For server-side or default to production URL
  return import.meta.env.VITE_APP_URL || 'https://soundswapp.firebaseapp.com';
};

// Get all valid redirect URIs
const getValidRedirectUris = () => [
  'https://soundswapp.firebaseapp.com/callback',
  'https://soundswapp.web.app/callback'
];

// Get the appropriate redirect URI based on current domain
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    const currentDomain = window.location.origin;
    return `${currentDomain}/callback`;
  }
  // Default to firebaseapp.com domain
  return 'https://soundswapp.firebaseapp.com/callback';
};

// Validate required environment variables
const validateEnvVar = (name: string, value?: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Firebase configuration with validation
export const firebaseConfig = {
  apiKey: 'AIzaSyCSjfXh6sHtx1rr1-WLR4ffFHf5lB8gFEA',
  authDomain: 'soundswapp.firebaseapp.com',
  projectId: 'soundswapp',
  storageBucket: 'soundswapp.firebasestorage.app',
  messagingSenderId: '968024909043',
  appId: '1:968024909043:web:a581b572e9dca32ee70386',
  measurementId: 'G-8X2N0XJKLT'
};

// Spotify API credentials
export const spotifyConfig = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '',
  redirectUri: getRedirectUri(),
  validRedirectUris: getValidRedirectUris()
};

// YouTube API credentials
export const youtubeConfig = {
  clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_YOUTUBE_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_YOUTUBE_REDIRECT_URI || `${getBaseUrl()}/youtube-callback`
};