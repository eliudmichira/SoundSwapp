/// <reference types="vite/client" />
/// <reference path="../vite-env.d.ts" />

// Helper to get the base URL dynamically
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // For client-side
    return window.location.origin;
  }
  // For server-side or default to production URL
  return import.meta.env.VITE_APP_URL;
};

// Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Spotify API credentials
export const spotifyConfig = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${getBaseUrl()}/callback`
};

// YouTube API credentials
export const youtubeConfig = {
  clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_YOUTUBE_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_YOUTUBE_REDIRECT_URI || `${getBaseUrl()}/youtube-callback`
};