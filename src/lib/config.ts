export const config = {
  youtube: {
    clientId: process.env.VITE_GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.VITE_GOOGLE_CLIENT_SECRET || '',
    apiKey: process.env.VITE_YOUTUBE_API_KEY || '',
    scope: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ].join(' '),
    redirectUri: typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback/youtube`
      : '',
  },
  spotify: {
    clientId: process.env.VITE_SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.VITE_SPOTIFY_CLIENT_SECRET || '',
    redirectUri: typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback/spotify`
      : '',
  }
}; 