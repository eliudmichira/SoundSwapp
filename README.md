# Modern React Playlist Converter

A TypeScript-based web application that allows users to convert playlists between Spotify and YouTube.

## Features

- Seamless authentication with Google
- Convert Spotify playlists to YouTube and vice versa
- Interactive UI with visual playlist insights
- Support for large playlists
- Offline support with localStorage fallback

## Prerequisites

- Node.js (v14 or later)
- npm (v7 or later)
- Firebase account
- Spotify Developer account
- YouTube/Google Developer account

## Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/modern-react-playlist-converter.git
   cd modern-react-playlist-converter
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

   # Spotify API Configuration
   VITE_SPOTIFY_CLIENT_ID=your-spotify-client-id
   VITE_SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback

   # YouTube API Configuration  
   VITE_YOUTUBE_CLIENT_ID=your-youtube-client-id
   VITE_YOUTUBE_CLIENT_SECRET=your-youtube-client-secret
   VITE_YOUTUBE_REDIRECT_URI=http://localhost:5173/youtube-callback

   # Application URL
   VITE_APP_URL=http://localhost:5173
   ```

4. Set up Firebase:
   - Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password and Google provider
   - Create a Firestore database
   - Register your app to get the Firebase config values

5. Set up Spotify API:
   - Create a Spotify Developer account at [https://developer.spotify.com/](https://developer.spotify.com/)
   - Create a new application to get your Client ID and Client Secret
   - Add `http://localhost:5173/callback` to your Redirect URIs

6. Set up YouTube API:
   - Create a new project in the Google Cloud Console
   - Enable the YouTube Data API v3
   - Create OAuth credentials for a Web Application
   - Add `http://localhost:5173/youtube-callback` to your Authorized Redirect URIs

### Spotify API Configuration
For the Spotify integration to work correctly, you need to register the following redirect URIs in the Spotify Developer Dashboard:
- `http://localhost:5173/callback` (for Vite's default development port)
- Your production domain's callback URL: `https://your-domain.com/callback`

Make sure these URLs match exactly what's being used in the application, including the protocol, domain, and path.

## Development

Start the development server:

```
npm run dev
```

## Firebase Deployment

1. Install the Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```
   firebase init
   ```
   - Select Firestore and Hosting
   - Choose your Firebase project
   - Accept the default Firestore rules location
   - Choose "dist" as your public directory
   - Configure as a single-page app
   - Don't overwrite index.html

4. Update your `.env` file with production URLs:
   ```
   VITE_SPOTIFY_REDIRECT_URI=https://your-domain.web.app/callback
   VITE_YOUTUBE_REDIRECT_URI=https://your-domain.web.app/youtube-callback
   VITE_APP_URL=https://your-domain.web.app
   ```

5. Deploy to Firebase:
   ```
   npm run deploy
   ```

## Firestore Rules

The application uses the following Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Explicitly allow access to conversions subcollection
    match /users/{userId}/conversions/{conversionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## License

[MIT License](LICENSE)