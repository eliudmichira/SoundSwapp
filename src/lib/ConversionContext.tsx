import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getSpotifyPlaylists, getSpotifyPlaylistTracks, extractTrackData, getSpotifyPlaylistById } from './spotifyApi';
import { getYouTubePlaylists, searchYouTube } from './youtubeApi';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, Firestore, QuerySnapshot, doc, setDoc } from 'firebase/firestore';
import { db as firebaseDb, auth, reconnectFirestore } from './firebase';
import { isSpotifyAuthenticated } from './spotifyAuth';

// Type assertion for the Firestore db
const db = firebaseDb as Firestore;

// Extend Window interface to add our custom property
declare global {
  interface Window {
    _firebaseErrorLogged?: boolean;
    _firestoreUsingOfflineMode?: boolean;
  }
}

// === TYPES ===
export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  trackCount: number;
  owner: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  duration_ms: number;
  popularity: number;
  explicit: boolean;
  searchQuery: string;
}

export interface YouTubeMatch {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  score: number;
  matchDetails: {
    titleMatch: number;
    artistMatch: number;
    lengthScore: number;
  };
  isMockData?: boolean;
}

export interface ConversionResult {
  id: string;
  spotifyPlaylistId: string;
  spotifyPlaylistName: string;
  spotifyPlaylistUrl?: string;
  youtubePlaylistId: string;
  youtubePlaylistUrl: string;
  tracksMatched: number;
  tracksFailed: number;
  totalTracks: number;
  convertedAt: Date;
  isMockData: boolean;
}

// === STATE MANAGEMENT ===
export enum ConversionStatus {
  IDLE = 'idle',
  LOADING_PLAYLISTS = 'loading_playlists',
  SELECTING_PLAYLIST = 'selecting_playlist',
  LOADING_TRACKS = 'loading_tracks',
  MATCHING_TRACKS = 'matching_tracks',
  CREATING_PLAYLIST = 'creating_playlist',
  SUCCESS = 'success',
  ERROR = 'error',
}

type ConversionState = {
  status: ConversionStatus;
  error: string | null;
  spotifyPlaylists: SpotifyPlaylist[];
  youtubePlaylists: any[];
  selectedPlaylistId: string | null;
  tracks: SpotifyTrack[];
  matches: Map<string, YouTubeMatch | null>;
  currentStep: number;
  totalSteps: number;
  youtubePlaylistId: string | null;
  youtubePlaylistUrl: string | null;
  spotifyPlaylistId: string | null;
  spotifyPlaylistUrl: string | null;
  conversionHistory: ConversionResult[];
  matchingProgress: number;
};

type ConversionAction =
  | { type: 'SET_STATUS'; payload: ConversionStatus }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SPOTIFY_PLAYLISTS'; payload: SpotifyPlaylist[] }
  | { type: 'SET_YOUTUBE_PLAYLISTS'; payload: any[] }
  | { type: 'SELECT_PLAYLIST'; payload: string }
  | { type: 'SET_TRACKS'; payload: SpotifyTrack[] }
  | { type: 'SET_MATCHES'; payload: Map<string, YouTubeMatch | null> }
  | { type: 'UPDATE_MATCHING_PROGRESS'; payload: number }
  | { type: 'SET_YOUTUBE_PLAYLIST'; payload: { id: string; url: string } }
  | { type: 'SET_SPOTIFY_PLAYLIST'; payload: { id: string; url: string } }
  | { type: 'SET_CONVERSION_HISTORY'; payload: ConversionResult[] }
  | { type: 'RESET' };

const initialState: ConversionState = {
  status: ConversionStatus.IDLE,
  error: null,
  spotifyPlaylists: [],
  youtubePlaylists: [],
  selectedPlaylistId: null,
  tracks: [],
  matches: new Map(),
  currentStep: 0,
  totalSteps: 4, // Connect to Spotify, Process Tracks, Match on YouTube, Create Playlist
  youtubePlaylistId: null,
  youtubePlaylistUrl: null,
  spotifyPlaylistId: null,
  spotifyPlaylistUrl: null,
  conversionHistory: [],
  matchingProgress: 0,
};

const conversionReducer = (state: ConversionState, action: ConversionAction): ConversionState => {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, status: action.payload ? ConversionStatus.ERROR : state.status };
    case 'SET_SPOTIFY_PLAYLISTS':
      return { ...state, spotifyPlaylists: action.payload };
    case 'SET_YOUTUBE_PLAYLISTS':
      return { ...state, youtubePlaylists: action.payload };
    case 'SELECT_PLAYLIST':
      return { ...state, selectedPlaylistId: action.payload };
    case 'SET_TRACKS':
      return { ...state, tracks: action.payload };
    case 'SET_MATCHES':
      return { ...state, matches: action.payload };
    case 'UPDATE_MATCHING_PROGRESS':
      return { ...state, matchingProgress: action.payload };
    case 'SET_YOUTUBE_PLAYLIST':
      return { 
        ...state, 
        youtubePlaylistId: action.payload.id, 
        youtubePlaylistUrl: action.payload.url 
      };
    case 'SET_SPOTIFY_PLAYLIST':
      return { 
        ...state, 
        spotifyPlaylistId: action.payload.id, 
        spotifyPlaylistUrl: action.payload.url 
      };
    case 'SET_CONVERSION_HISTORY':
      return { ...state, conversionHistory: action.payload };
    case 'RESET':
      return { 
        ...initialState,
        // Preserve the conversion history
        conversionHistory: state.conversionHistory 
      };
    default:
      return state;
  }
};

// === CONTEXT ===
interface ConversionContextType {
  state: ConversionState;
  fetchSpotifyPlaylists: () => Promise<void>;
  fetchYouTubePlaylists: () => Promise<void>;
  selectPlaylist: (playlistId: string) => void;
  startConversion: () => Promise<void>;
  resetConversion: () => void;
  fetchConversionHistory: () => Promise<void>;
  toggleMockDataMode: (enabled: boolean) => void;
  dispatch: React.Dispatch<ConversionAction>;
}

const ConversionContext = createContext<ConversionContextType>({
  state: initialState,
  fetchSpotifyPlaylists: async () => {},
  fetchYouTubePlaylists: async () => {},
  selectPlaylist: () => {},
  startConversion: async () => {},
  resetConversion: () => {},
  fetchConversionHistory: async () => {},
  toggleMockDataMode: () => {},
  dispatch: () => {},
});

export const useConversion = () => useContext(ConversionContext);

// Storage key for conversion history
const CONVERSION_HISTORY_KEY = 'playlist_converter_history';

// Helper function to save conversion history to localStorage
const saveConversionHistoryToLocalStorage = (userId: string, history: ConversionResult[]) => {
  try {
    localStorage.setItem(`${CONVERSION_HISTORY_KEY}_${userId}`, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving conversion history to localStorage:', error);
  }
};

// Helper function to get conversion history from localStorage
const getConversionHistoryFromLocalStorage = (userId: string): ConversionResult[] => {
  try {
    const storedHistory = localStorage.getItem(`${CONVERSION_HISTORY_KEY}_${userId}`);
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      // Convert date strings back to Date objects
      return parsedHistory.map((item: any) => ({
        ...item,
        convertedAt: new Date(item.convertedAt)
      }));
    }
  } catch (error) {
    console.error('Error retrieving conversion history from localStorage:', error);
  }
  return [];
};

// Helper function to check if error is a Firestore permissions error
const isFirestorePermissionError = (error: any): boolean => {
  if (!error) return false;
  
  // Check for different ways permission errors might be represented
  if (typeof error === 'object') {
    // Direct code check
    if (error.code === 'permission-denied') return true;
    
    // Message content check
    if (typeof error.message === 'string') {
      const message = error.message.toLowerCase();
      return (
        message.includes('missing or insufficient permissions') ||
        message.includes('permission denied') ||
        message.includes('unauthorized') ||
        message.includes('access denied')
      );
    }
  } else if (typeof error === 'string') {
    const message = error.toLowerCase();
    return (
      message.includes('missing or insufficient permissions') ||
      message.includes('permission denied') ||
      message.includes('unauthorized') ||
      message.includes('access denied')
    );
  }
  
  return false;
};

// New helper function to log detailed information about Firestore errors for debugging
const logFirestoreError = (context: string, error: any, userId?: string) => {
  console.error(`[Firestore Error in ${context}]`, {
    message: error?.message || 'Unknown error',
    code: error?.code || 'No error code',
    name: error?.name || 'No error name',
    userId: userId || 'No user ID',
    timestamp: new Date().toISOString(),
    // Add any other useful debugging information
    userAuth: auth?.currentUser ? 'User is authenticated' : 'No authenticated user',
    firestoreConnected: typeof db !== 'undefined' ? 'Firestore is initialized' : 'Firestore not initialized'
  });
  
  // Add special handling for permission errors
  if (isFirestorePermissionError(error)) {
    console.warn('[PERMISSION ERROR DETECTED] This is likely a Firestore security rules issue');
    console.warn('Rules should allow access to collections: users/{userId}/conversions, users/{userId}/tokens, users/{userId}/history');
    
    // Attempt to help recovery by reconnecting
    try {
      reconnectFirestore().catch((error: Error | unknown) => console.warn('Failed to reconnect after permission error:', error));
    } catch (error: unknown) {
      // Ignore reconnect errors
    }
  }
};

// Helper function to check if error is a Firestore channel termination error
const isFirestoreChannelTerminationError = (error: any): boolean => {
  return error && 
    typeof error.message === 'string' && 
    (error.message.includes('Listen/channel') || 
     error.message.includes('terminated') || 
     error.message.includes('Failed to load resource: the server responded with a status of 400'));
};

// Add this function to handle Firestore recovery
const handleFirestoreRecovery = async (error: any): Promise<boolean> => {
  if (isFirestoreChannelTerminationError(error)) {
    console.log('Attempting to recover from Firestore channel termination error');
    try {
      // Attempt to reconnect Firestore
      await reconnectFirestore();
      return true;
    } catch (reconnectError) {
      console.error('Error recovering Firestore connection:', reconnectError);
    }
  }
  return false;
};

export const ConversionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(conversionReducer, initialState);
  const { user } = useAuth();
  
  // Add a function to toggle mock data mode for development and testing
  const toggleMockDataMode = useCallback((enabled: boolean) => {
    if (enabled) {
      localStorage.setItem('use_mock_youtube_data', 'true');
      console.log('Mock data mode ENABLED for YouTube API');
      showToast('info', 'Mock data mode enabled - using fake YouTube data');
    } else {
      localStorage.removeItem('use_mock_youtube_data');
      console.log('Mock data mode DISABLED for YouTube API');
      showToast('info', 'Mock data mode disabled - using live YouTube API');
    }
  }, []);
  
  // Helper function for showing toasts
  const showToast = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // In a real app, you would show a toast notification here
  };
  
  // Helper function to refresh authentication state
  const refreshAuthState = useCallback(() => {
    const isSpotifyAuthed = isSpotifyAuthenticated();
    console.log('Refreshing auth state:', { 
      user: user?.uid, 
      isSpotifyAuthed,
      hasSpotifyAuth: isSpotifyAuthed
    });
    
    // Dispatch event to notify auth state change
    if (isSpotifyAuthed) {
      window.dispatchEvent(new CustomEvent('spotify-auth-changed', { 
        detail: { authenticated: true } 
      }));
    }
  }, [user]);
  
  const fetchSpotifyPlaylists = useCallback(async () => {
    // First check if user is authenticated
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'You need to sign in to access Spotify playlists' });
      return;
    }
    
    // Check Spotify authentication with detailed logging
    const isAuthed = isSpotifyAuthenticated();
    console.log('Spotify auth check:', { 
      user: user.uid, 
      isAuthed, 
      hasAccessToken: !!localStorage.getItem('soundswapp_spotify_access_token'),
      hasExpiresAt: !!localStorage.getItem('soundswapp_spotify_expires_at')
    });
    
    if (!isAuthed) {
      dispatch({ type: 'SET_ERROR', payload: 'You need to authenticate with Spotify first. Please reconnect your Spotify account.' });
      return;
    }
    
    try {
      dispatch({ type: 'SET_STATUS', payload: ConversionStatus.LOADING_PLAYLISTS });
      
      const response = await getSpotifyPlaylists();
      
      const playlists: SpotifyPlaylist[] = response.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.images?.[0]?.url || '',
        trackCount: item.tracks.total,
        owner: item.owner.display_name,
      }));
      
      dispatch({ type: 'SET_SPOTIFY_PLAYLISTS', payload: playlists });
      dispatch({ type: 'SET_STATUS', payload: ConversionStatus.SELECTING_PLAYLIST });
    } catch (error) {
      console.error('Error fetching Spotify playlists:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to fetch Spotify playlists';
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Authentication')) {
          errorMessage = 'Spotify authentication expired. Please reconnect your Spotify account.';
        } else if (error.message.includes('403')) {
          errorMessage = 'You do not have permission to access Spotify playlists.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, [user, dispatch]);
  
  // Fetch YouTube playlists
  const fetchYouTubePlaylists = useCallback(async () => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'You need to authenticate with YouTube first' });
      return;
    }
    dispatch({ type: 'SET_STATUS', payload: ConversionStatus.LOADING_PLAYLISTS });
    
    try {
      // Call the YouTube API to get playlists
      const response = await getYouTubePlaylists();
      
      if (response && response.items) {
        // Store the playlists directly in state, preserving the YouTube API structure
        dispatch({ type: 'SET_YOUTUBE_PLAYLISTS', payload: response.items });
      } else {
        dispatch({ type: 'SET_YOUTUBE_PLAYLISTS', payload: [] });
      }
      
      dispatch({ type: 'SET_STATUS', payload: ConversionStatus.IDLE });
    } catch (error) {
      console.error('Error fetching YouTube playlists:', error);
      // Simplified error handling
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load YouTube playlists'
      });
    }
  }, [user, dispatch]);
  
  const selectPlaylist = useCallback(async (playlistId: string) => {
    console.log('[selectPlaylist] Called with playlistId:', playlistId); // Debug log
    // Try to find the playlist in the user's library first
    let playlist = state.spotifyPlaylists.find(p => p.id === playlistId);
    if (!playlist) {
      // If not found, try to fetch it directly (public playlist)
      try {
        playlist = await getSpotifyPlaylistById(playlistId);
        // Add it to the list if not already present
        dispatch({ type: 'SET_SPOTIFY_PLAYLISTS', payload: [...state.spotifyPlaylists, playlist] });
      } catch (error) {
        console.error('[selectPlaylist] Could not fetch playlist details:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Could not fetch playlist details. It may be private, unavailable, or you do not have access.' });
        return;
      }
    }
    dispatch({ type: 'SELECT_PLAYLIST', payload: playlistId });

    // Fetch tracks immediately after selecting playlist
    try {
      console.log('[selectPlaylist] Fetching tracks for playlistId:', playlistId);
      const tracksData = await getSpotifyPlaylistTracks(playlistId);
      console.log('[selectPlaylist] Tracks API response:', tracksData);
      const tracks = await extractTrackData(tracksData);
      dispatch({ type: 'SET_TRACKS', payload: tracks });
    } catch (error) {
      console.error('[selectPlaylist] Could not fetch playlist tracks:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Could not fetch playlist tracks. The playlist may be private, unavailable, or you do not have access.' });
    }
  }, [state.spotifyPlaylists, dispatch]);
  
  // Add safe URL creation functions
  const createYouTubePlaylistUrl = (playlistId: string | undefined): string => {
    if (!playlistId) {
      return '';
    }
    return `https://www.youtube.com/playlist?list=${playlistId}`;
  };

  const startConversion = async () => {
    if (!state.selectedPlaylistId) {
      dispatch({ type: 'SET_ERROR', payload: 'No playlist selected' });
      return;
    }
    
    try {
      if (!user) {
        throw new Error('You must be logged in to convert playlists');
      }

      const playlistId = state.selectedPlaylistId;
      if (!playlistId) {
        throw new Error('Please select a playlist to convert');
      }

      // Reset state for the new conversion
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_STATUS', payload: ConversionStatus.LOADING_TRACKS });
      dispatch({ type: 'UPDATE_MATCHING_PROGRESS', payload: 0 });

      // Determine source and destination platforms
      const sourcePlatform = localStorage.getItem('source_platform') || 'spotify';
      const destinationPlatform = localStorage.getItem('destination_platform') || 'youtube';

      let tracks: SpotifyTrack[] = [];
      let matches = new Map();

      // ---- OPTIMIZATION 1: Use cached data when possible ----
      const cacheKey = `${sourcePlatform}_${playlistId}_tracks`;
      const cachedTracks = sessionStorage.getItem(cacheKey);
      
      if (cachedTracks && state.tracks.length > 0) {
        console.log('Using cached tracks data');
        tracks = state.tracks;
      } else {
        // Fetch fresh tracks if not cached
        if (sourcePlatform === 'spotify') {
          try {
            // Add a timeout promise for getting tracks
            const tracksPromise = getSpotifyPlaylistTracks(playlistId);
            const timeoutPromise = new Promise<any>((_, reject) => 
              setTimeout(() => reject(new Error('Spotify tracks request timed out')), 15000)
            );
            
            const tracksData = await Promise.race([tracksPromise, timeoutPromise]);
            tracks = await extractTrackData(tracksData);
            // Cache for future use
            sessionStorage.setItem(cacheKey, JSON.stringify(tracks));
          } catch (error: any) {
        let errorMessage = 'Failed to load tracks from Spotify';
        if (error instanceof Error) {
          errorMessage = `Spotify error: ${error.message}`;
          if (error.message.includes('Authentication') || error.message.includes('token')) {
            errorMessage += '. Try reconnecting to Spotify.';
              } else if (error.message.includes('timed out')) {
                errorMessage = 'Spotify request timed out. Please try again with a better connection.';
          }
        }
        throw new Error(errorMessage);
          }
        } else if (sourcePlatform === 'youtube') {
          // YouTube tracks loading logic
          // ... existing code ...
        }
      }

      if (!tracks || tracks.length === 0) {
        throw new Error('No tracks found in the selected playlist.');
      }

      // Always update UI with tracks
      dispatch({ type: 'SET_TRACKS', payload: tracks });
      dispatch({ type: 'SET_STATUS', payload: ConversionStatus.MATCHING_TRACKS });
      
      // ---- OPTIMIZATION 2: Parallel processing for matching ----
      if (destinationPlatform === 'youtube') {
        // Spotify → YouTube conversion
        const BATCH_SIZE = 5; // Process 5 tracks at once
        const batchCount = Math.ceil(tracks.length / BATCH_SIZE);
        
        for (let batchIndex = 0; batchIndex < batchCount; batchIndex++) {
          const batchStart = batchIndex * BATCH_SIZE;
          const batchEnd = Math.min(batchStart + BATCH_SIZE, tracks.length);
          const currentBatch = tracks.slice(batchStart, batchEnd);
          
          // Process batch in parallel
          const batchPromises = currentBatch.map(async (track) => {
            try {
              const query = `${track.artists[0]} ${track.name}`;
              const videoSearchResults = await searchYouTube(user.uid, query);
              
              if (videoSearchResults && videoSearchResults.items && videoSearchResults.items.length > 0) {
                const bestMatch = videoSearchResults.items[0];
                return { 
                  trackId: track.id, 
                  match: {
                    videoId: bestMatch.id.videoId,
                    title: bestMatch.snippet.title,
                    channelTitle: bestMatch.snippet.channelTitle,
                    thumbnailUrl: bestMatch.snippet.thumbnails?.default?.url || '',
                    score: 100, // Simplified score
              matchDetails: {
                      titleMatch: 100,
                      artistMatch: 100,
                      lengthScore: 100
                    },
                    isMockData: videoSearchResults._isMock || false
                  }
                };
              }
              return { trackId: track.id, match: null };
            } catch (err) {
              console.warn('Error matching track:', track.name, err);
              return { trackId: track.id, match: null };
            }
          });
          
          // Wait for all tracks in this batch to be processed
          const batchResults = await Promise.all(batchPromises);
          
          // Update matches with batch results
          batchResults.forEach(({ trackId, match }) => {
            matches.set(trackId, match);
          });
          
          // Update progress after each batch
          const progress = Math.min(((batchIndex + 1) * BATCH_SIZE / tracks.length) * 100, 100);
          dispatch({ type: 'UPDATE_MATCHING_PROGRESS', payload: progress });
          
          // Small delay to allow UI updates
          await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      dispatch({ type: 'SET_MATCHES', payload: matches });
      
        // ---- Move to creating playlist with better progress indication ----
      dispatch({ type: 'SET_STATUS', payload: ConversionStatus.CREATING_PLAYLIST });
      
        // Get the selected playlist details
        const selectedPlaylist = state.spotifyPlaylists.find(p => p.id === playlistId);
      if (!selectedPlaylist) {
          throw new Error('Selected playlist details not found');
        }
        
        // Create a more descriptive YouTube playlist name
        const youtubePlaylistName = `${selectedPlaylist.name} (Converted)`;
        const youtubePlaylistDescription = `Converted from spotify using Playlist Converter`;
        
        try {
          // Set a timeout for the YouTube playlist creation
          const createPlaylistPromise = await import('./youtubeApi').then(module => 
            module.findOrCreatePlaylist(user.uid, youtubePlaylistName, youtubePlaylistDescription)
          );
          
          const timeoutPromise = new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('YouTube playlist creation timed out')), 20000)
          );
          
          // Race the playlist creation against a timeout
          const newPlaylist = await Promise.race([createPlaylistPromise, timeoutPromise]);
          
          if (!newPlaylist || !newPlaylist.id) {
            throw new Error('Failed to create YouTube playlist');
          }
          
          const youtubePlaylistId = newPlaylist.id;
          const youtubePlaylistUrl = createYouTubePlaylistUrl(youtubePlaylistId);
          
          console.log(`Created YouTube playlist: ${youtubePlaylistId}`);
          
          // Save the YouTube playlist ID to state
      dispatch({ 
        type: 'SET_YOUTUBE_PLAYLIST', 
        payload: { 
              id: youtubePlaylistId, 
              url: youtubePlaylistUrl
            } 
          });
          
          // Add videos to the playlist with improved error handling and progress updates
          let successCount = 0;
          let failureCount = 0;
          let totalVideos = 0;
          
          // Count how many videos we'll be adding (excluding null matches)
          for (const match of matches.values()) {
            if (match && match.videoId) {
              totalVideos++;
            }
          }
          
          if (totalVideos === 0) {
            throw new Error('No matching videos found for the tracks in this playlist');
          }
          
          let processedVideos = 0;
          const matchEntries = Array.from(matches.entries());
          
          console.log(`Starting to add ${totalVideos} videos to YouTube playlist ${youtubePlaylistId}`);
          
          // Process videos one at a time with delays to avoid rate limits
          for (let i = 0; i < matchEntries.length; i++) {
            const [_, match] = matchEntries[i];
            
            if (!match || !match.videoId) {
              processedVideos++;
              continue;
            }
            
            try {
              // Add retry mechanism with exponential backoff
              let attempts = 0;
              let success = false;
              let lastError = null;
              
              while (attempts < 3 && !success) {
                try {
                  console.log(`Adding video ${match.videoId} to YouTube playlist (attempt ${attempts + 1}/3)`);
                  
                  // Add a significant delay between each video addition
                  await new Promise(resolve => setTimeout(resolve, 1000 + (attempts * 1000)));
                  
                  const { addToYouTubePlaylist } = await import('./youtubeApi');
                  await addToYouTubePlaylist(user.uid, youtubePlaylistId, match.videoId);
                  
                  success = true;
                  successCount++;
                  console.log(`Successfully added video ${match.videoId} to YouTube playlist`);
                } catch (err) {
                  attempts++;
                  lastError = err;
                  console.warn(`Attempt ${attempts} failed for video ${match.videoId}:`, err);
                  
                  // Add longer delay before retrying
                  if (attempts < 3) {
                    await new Promise(resolve => setTimeout(resolve, attempts * 2000));
                  }
                }
              }
              
              if (!success) {
                failureCount++;
                console.error(`Failed to add video ${match.videoId} after multiple attempts:`, lastError);
              }
            } catch (error) {
              failureCount++;
              console.error(`Error adding video ${match.videoId} to playlist:`, error);
            }
            
            // Update progress after each video
            processedVideos++;
            dispatch({
              type: 'UPDATE_MATCHING_PROGRESS', 
              payload: Math.min((processedVideos / matchEntries.length) * 100, 100)
            });
            
            // Check if we need to update the user that we're still working
            if (i % 5 === 0 && i > 0) {
              console.log(`Progress update: Added ${successCount} videos, ${failureCount} failed, ${processedVideos}/${matchEntries.length} processed`);
            }
          }
          
          // Update state to indicate success
          dispatch({ type: 'SET_STATUS', payload: ConversionStatus.SUCCESS });
          
          // Save the conversion to history
          const conversionResult: ConversionResult = {
            id: `conversion_${Date.now()}`,
            spotifyPlaylistId: playlistId,
            spotifyPlaylistName: selectedPlaylist.name,
            spotifyPlaylistUrl: `https://open.spotify.com/playlist/${playlistId}`,
            youtubePlaylistId,
            youtubePlaylistUrl,
            tracksMatched: successCount,
            tracksFailed: failureCount,
            totalTracks: tracks.length,
            convertedAt: new Date(),
            isMockData: false
          };

          // Update conversion history in state
          dispatch({
            type: 'SET_CONVERSION_HISTORY',
            payload: [conversionResult, ...state.conversionHistory]
          });

          // Save to local storage
          saveConversionHistoryToLocalStorage(user.uid, [conversionResult, ...state.conversionHistory]);

          // Try to save to Firestore with enhanced error handling
          try {
            console.log('Attempting to save conversion to Firestore:', {
              userId: user.uid,
              conversionId: conversionResult.id,
              playlistName: conversionResult.spotifyPlaylistName
            });

            const conversionsRef = collection(db, 'users', user.uid, 'conversions');
            
            // Use the same ID for Firestore document
            const docRef = doc(conversionsRef, conversionResult.id);
            
            // Add retry logic for Firestore save
            let attempts = 0;
            const maxAttempts = 3;
            let success = false;

            while (attempts < maxAttempts && !success) {
              try {
                await setDoc(docRef, {
                  ...conversionResult,
                  convertedAt: Timestamp.fromDate(conversionResult.convertedAt),
                  userId: user.uid,
                  tracks: tracks.map(track => ({
                    name: track.name,
                    artists: track.artists,
                    album: track.album,
                    duration_ms: track.duration_ms
                  }))
                });

                console.log('Successfully saved conversion to Firestore:', docRef.id);
                success = true;
                break;
              } catch (saveError) {
                attempts++;
                console.warn(`Failed to save conversion (attempt ${attempts}/${maxAttempts}):`, saveError);
                
                if (attempts < maxAttempts) {
                  // Wait before retrying with exponential backoff
                  await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
                } else {
                  throw saveError;
                }
              }
            }
          } catch (firestoreError) {
            console.error('Failed to save conversion history to Firestore:', firestoreError);
            
            // Log detailed error information
            logFirestoreError('saveConversion', firestoreError, user.uid);
            
            // Show a toast notification to the user
            if (typeof window !== 'undefined' && window.dispatchEvent) {
              window.dispatchEvent(new CustomEvent('show-toast', {
                detail: {
                  type: 'warning',
                  title: 'Backup Save Only',
                  message: 'Your conversion was successful but could not be saved online. It is saved locally only.',
                  duration: 5000
                }
              }));
            }
          }
          
        } catch (playlistError) {
          console.error('Error during YouTube playlist creation or population:', playlistError);
          let errorMessage = 'Failed to create or update YouTube playlist';
          
          if (playlistError instanceof Error) {
            if (playlistError.message.includes('timed out')) {
              errorMessage = 'YouTube request timed out. Your playlist may have been created but not fully populated. Please check your YouTube account.';
            } else if (playlistError.message.includes('quota')) {
              errorMessage = 'YouTube API quota exceeded. Please try again later.';
            } else {
              errorMessage = `YouTube error: ${playlistError.message}`;
            }
          }
          
          throw new Error(errorMessage);
        }
      } else if (destinationPlatform === 'spotify') {
        // YouTube → Spotify conversion
        // Similar optimizations would be applied here
        // ... Rest of the code ...
      }
      } catch (error) {
      console.error('Conversion error:', error);
      
      // Provide a helpful error message based on the error type
      let userErrorMessage = 'An error occurred during conversion';
      
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          userErrorMessage = 'The request timed out. Your connection may be slow or unstable. The playlist may have been partially created.';
        } else if (error.message.includes('quota')) {
          userErrorMessage = 'YouTube API quota exceeded. Please try again later (usually after 24 hours).';
        } else if (error.message.includes('Authentication') || error.message.includes('token')) {
          userErrorMessage = 'Authentication issue. Please try reconnecting your accounts.';
        } else {
          // Use the error message directly if it's user-friendly
          userErrorMessage = error.message;
        }
      }
      
      dispatch({ 
        type: 'SET_ERROR', 
        payload: userErrorMessage
      });
      dispatch({ type: 'SET_STATUS', payload: ConversionStatus.ERROR });
    }
  };
  
  const resetConversion = () => {
    dispatch({ type: 'RESET' });
  };
  
  const fetchConversionHistory = async () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    
    if (!user) {
      console.log('No authenticated user found, cannot fetch conversion history');
      return;
    }
    
    try {
      // Try getting history from localStorage first
      const localHistory = getConversionHistoryFromLocalStorage(user.uid);
      if (localHistory.length > 0) {
        dispatch({ type: 'SET_CONVERSION_HISTORY', payload: localHistory });
      }
      
      // Then try to get from Firestore and update if available
      try {
        console.log('Fetching conversion history from Firestore for user:', user.uid);
        // Ensure db is defined and user is fully authenticated
        if (!db) {
          console.error('Firestore database not initialized');
          throw new Error('Database not available');
        }
        
        // Wait a moment to ensure auth token has propagated
        await new Promise(resolve => setTimeout(resolve, 500));
        
      const conversionsRef = collection(db, 'users', user.uid, 'conversions');
      const q = query(conversionsRef, orderBy('convertedAt', 'desc'));
        
        // Add timeout to the getDocs call
        const queryPromise = getDocs(q);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore query timeout')), 10000)
        );
        
        const querySnapshot = await Promise.race([queryPromise, timeoutPromise]) as QuerySnapshot;
        
      if (!querySnapshot.empty) {
        const history: ConversionResult[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          history.push({
            id: doc.id,
            spotifyPlaylistId: data.spotifyPlaylistId,
            spotifyPlaylistName: data.spotifyPlaylistName,
              spotifyPlaylistUrl: data.spotifyPlaylistUrl,
            youtubePlaylistId: data.youtubePlaylistId,
            youtubePlaylistUrl: data.youtubePlaylistUrl,
            tracksMatched: data.tracksMatched,
            tracksFailed: data.tracksFailed,
            totalTracks: data.totalTracks,
            convertedAt: data.convertedAt.toDate(),
              isMockData: data.isMockData || false
            });
          });
          
          // Update the state with the Firestore history
          dispatch({ type: 'SET_CONVERSION_HISTORY', payload: history });
          
          // Also update localStorage for offline access
          saveConversionHistoryToLocalStorage(user.uid, history);
        } else {
          console.log('No conversion history found in Firestore');
        }
      } catch (firestoreError) {
        // Use our enhanced error logging helper
        logFirestoreError('fetchConversionHistory', firestoreError, user.uid);
        
        // Try to recover from Firestore channel termination error
        if (await handleFirestoreRecovery(firestoreError)) {
          // If recovery was successful, try to fetch again after a short delay
          console.log('Firestore connection recovered, retrying fetch...');
          setTimeout(() => fetchConversionHistory(), 1500);
          return;
        }
        
        // If we have local history, don't show an error to the user
        if (localHistory.length === 0) {
          if (isFirestorePermissionError(firestoreError)) {
            console.log('Using offline mode for conversion history due to permission error');
            
            // Store this information so the UI can show an appropriate message
            window._firestoreUsingOfflineMode = true;
            
            // Try to reconnect Firestore one more time
            try {
              const reconnected = await reconnectFirestore();
              if (reconnected) {
                console.log('Successfully reconnected Firestore after permission error');
              }
            } catch (e) {
              console.log('Failed to reconnect Firestore:', e);
        }
      } else {
            dispatch({ 
              type: 'SET_ERROR', 
              payload: 'Unable to retrieve conversion history. Using offline mode.' 
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchConversionHistory:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to load conversion history. Please try again later.' 
      });
    }
  };
  
  const value = {
    state,
    fetchSpotifyPlaylists,
    fetchYouTubePlaylists,
    selectPlaylist,
    startConversion,
    resetConversion,
    fetchConversionHistory,
    toggleMockDataMode,
    dispatch,
  };
  
  return (
    <ConversionContext.Provider value={value}>
      {children}
    </ConversionContext.Provider>
  );
}; 