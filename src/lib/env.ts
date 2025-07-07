/// <reference types="vite/client" />
/// <reference path="../vite-env.d.ts" />

// Helper to get the base URL dynamically
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // For client-side, prefer firebaseapp.com domain for consistency
    const host = window.location.host;
    if (host.includes('web.app')) {
      return 'https://soundswapp.firebaseapp.com';
    }
    return window.location.origin;
  }
  // For server-side or default to production URL
  return import.meta.env.VITE_APP_URL || 'https://soundswapp.firebaseapp.com';
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
  apiKey: validateEnvVar('VITE_FIREBASE_API_KEY', import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: validateEnvVar('VITE_FIREBASE_AUTH_DOMAIN', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: validateEnvVar('VITE_FIREBASE_PROJECT_ID', import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: validateEnvVar('VITE_FIREBASE_STORAGE_BUCKET', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: validateEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: validateEnvVar('VITE_FIREBASE_APP_ID', import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional
};

// Spotify API credentials
export const spotifyConfig = {
  clientId: validateEnvVar('VITE_SPOTIFY_CLIENT_ID', import.meta.env.VITE_SPOTIFY_CLIENT_ID),
  clientSecret: validateEnvVar('VITE_SPOTIFY_CLIENT_SECRET', import.meta.env.VITE_SPOTIFY_CLIENT_SECRET),
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${getBaseUrl()}/callback`
};

// YouTube API credentials
export const youtubeConfig = {
  clientId: validateEnvVar('VITE_YOUTUBE_CLIENT_ID', import.meta.env.VITE_YOUTUBE_CLIENT_ID),
  clientSecret: validateEnvVar('VITE_YOUTUBE_CLIENT_SECRET', import.meta.env.VITE_YOUTUBE_CLIENT_SECRET),
  redirectUri: import.meta.env.VITE_YOUTUBE_REDIRECT_URI || `${getBaseUrl()}/youtube-callback`
};