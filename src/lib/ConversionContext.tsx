import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getSpotifyPlaylists, getSpotifyPlaylistTracks, extractTrackData, getSpotifyPlaylistById } from './spotifyApi';
import { getYouTubePlaylists, searchYouTube } from './youtubeApi';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, Firestore, QuerySnapshot, doc, setDoc } from 'firebase/firestore';
import { db as firebaseDb, auth, reconnectFirestore } from './firebase';
import { isSpotifyAuthenticated, getSpotifyToken } from './spotifyAuth';
import { checkForExistingPlaylist, generateUniquePlaylistName, ConversionLock } from './duplicatePrevention';
import { parseYouTubeTitle, calculateTrackSimilarity, generateSearchQueries } from './improvedConversion';

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
  releaseYear?: string;
  genres?: string[];
  artistImages?: string[];
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
  failedTracks?: FailedTrack[]; // Add failed tracks details
}

// New interface for tracking failed tracks
export interface FailedTrack {
  name: string;
  artists: string[];
  reason: string;
  searchQueries: string[];
  bestMatchScore?: number;
  bestMatchTitle?: string;
  bestMatchArtist?: string;
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
  selectYouTubePlaylist: (playlistId: string) => void;
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
  selectYouTubePlaylist: () => {},
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
  const refreshAuthState = useCallback(async () => {
    const isSpotifyAuthed = await isSpotifyAuthenticated();
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
    const isAuthed = await isSpotifyAuthenticated();
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
      
      const accessToken = await getSpotifyToken();
      if (!accessToken) {
        throw new Error('No Spotify access token available');
      }
      
      const response = await getSpotifyPlaylists(accessToken);
      
      const playlists: SpotifyPlaylist[] = response.map((item: any) => ({
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
      
      // Provide more specific error messages with helpful guidance
      let errorMessage = 'Failed to fetch Spotify playlists';
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Authentication')) {
          errorMessage = 'Spotify authentication expired. Please reconnect your Spotify account.';
        } else if (error.message.includes('403') || error.message.includes('permission')) {
          errorMessage = 'You do not have permission to access Spotify playlists. This could be because:\n\n• Your Spotify account type doesn\'t support playlist access\n• You need to upgrade to a Premium account\n• Your account has restrictions\n• You\'re using a family plan with limited permissions\n\nPlease try:\n1. Upgrading to Spotify Premium\n2. Checking your account settings\n3. Reconnecting your Spotify account';
        } else if (error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
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
  
  // Add YouTube playlist selection function
  const selectYouTubePlaylist = useCallback(async (playlistId: string) => {
    console.log('[selectYouTubePlaylist] Called with playlistId:', playlistId);
    
    // Find the playlist in YouTube playlists
    const playlist = state.youtubePlaylists.find((p: any) => p.id === playlistId);
    if (!playlist) {
      console.error('[selectYouTubePlaylist] Playlist not found in state');
      dispatch({ type: 'SET_ERROR', payload: 'Selected playlist not found. Please refresh and try again.' });
      return;
    }
    
    dispatch({ type: 'SELECT_PLAYLIST', payload: playlistId });
    
    // Update the playlist name in the UI
    const playlistName = playlist.snippet?.title || 'YouTube Playlist';
    console.log('[selectYouTubePlaylist] Selected playlist:', playlistName);
    
    // Fetch tracks immediately after selecting playlist
    try {
      console.log('[selectYouTubePlaylist] Fetching tracks for playlistId:', playlistId);
      
      // Get YouTube access token
      const accessToken = localStorage.getItem('soundswapp_youtube_access_token');
      if (!accessToken) {
        throw new Error('YouTube authentication token not found. Please reconnect to YouTube.');
      }
      
      // Import the YouTube API function dynamically
      const { fetchAllYouTubePlaylistItems } = await import('./youtubeApi');
      
      const allItems = await fetchAllYouTubePlaylistItems(playlistId, accessToken);
      
      if (!allItems || allItems.length === 0) {
        throw new Error('No tracks found in this YouTube playlist.');
      }
      
      // Get video details to fetch durations for preview
      const videoIds = allItems.map((item: any) => 
        item.snippet?.resourceId?.videoId || item.contentDetails?.videoId
      ).filter(Boolean);
      
      console.log('Fetching video details for preview:', videoIds.length, 'videos');
      
      // Fetch video details in batches to get durations
      const videoDetails: any[] = [];
      const BATCH_SIZE = 50; // YouTube API limit
      
      for (let i = 0; i < videoIds.length; i += BATCH_SIZE) {
        const batch = videoIds.slice(i, i + BATCH_SIZE);
        const batchIds = batch.join(',');
        
        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${batchIds}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (videoResponse.ok) {
          const videoData = await videoResponse.json();
          if (videoData.items) {
            videoDetails.push(...videoData.items);
          }
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Create a map of video details for quick lookup
      const videoDetailsMap = new Map();
      videoDetails.forEach(video => {
        videoDetailsMap.set(video.id, video);
      });
      
      // Process tracks with durations for preview
      const tracks = allItems.map((item: any) => {
        const videoId = item.snippet?.resourceId?.videoId || item.contentDetails?.videoId;
        const videoDetail = videoDetailsMap.get(videoId);
        
        const videoTitle = item.snippet?.title || '';
        const channelTitle = item.snippet?.videoOwnerChannelTitle || item.snippet?.channelTitle || 'Unknown';
        
        // Smart parsing of video titles
        let artists = [channelTitle];
        let title = videoTitle;
        
        const separators = [' - ', ' – ', ': ', ' "', " '", ' // ', ' | '];
        for (const separator of separators) {
          if (videoTitle.includes(separator)) {
            const parts = videoTitle.split(separator);
            if (parts.length >= 2) {
              artists = [parts[0].trim()];
              title = parts.slice(1).join(separator).trim()
                .replace(/^['"]/, '')
                .replace(/['"]$/, '');
              break;
            }
          }
        }
        
        // Get duration from video details
        let duration_ms = 0;
        if (videoDetail?.contentDetails?.duration) {
          // Parse ISO 8601 duration format (PT4M13S -> 253000ms)
          const duration = videoDetail.contentDetails.duration;
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          if (match) {
            const hours = parseInt(match[1] || '0');
            const minutes = parseInt(match[2] || '0');
            const seconds = parseInt(match[3] || '0');
            duration_ms = (hours * 3600 + minutes * 60 + seconds) * 1000;
          }
        }
        
        return {
          id: item.id || `yt-${Math.random().toString(36).substring(2, 9)}`,
          name: title,
          artists: artists,
          album: channelTitle,
          duration_ms: duration_ms,
          popularity: 0,
          explicit: false,
          searchQuery: `${artists[0]} ${title}`,
          videoId: videoId
        };
      });
      
      dispatch({ type: 'SET_TRACKS', payload: tracks });
    } catch (error) {
      console.error('[selectYouTubePlaylist] Could not fetch playlist tracks:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Could not fetch playlist tracks. The playlist may be private, unavailable, or you do not have access.' });
    }
  }, [state.youtubePlaylists, dispatch]);
  
  // Add safe URL creation functions
  const createYouTubePlaylistUrl = (playlistId: string | undefined): string => {
    if (!playlistId) {
      return '';
    }
    return `https://www.youtube.com/playlist?list=${playlistId}`;
  };

  // Helper function to calculate track similarity score
  const calculateTrackSimilarity = (originalTrack: SpotifyTrack, spotifyTrack: any): number => {
    let score = 0;
    
    // Normalize strings for comparison
    const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
    
    const originalTitle = normalize(originalTrack.name);
    const originalArtist = normalize(originalTrack.artists[0]);
    const spotifyTitle = normalize(spotifyTrack.name);
    const spotifyArtist = normalize(spotifyTrack.artists[0].name);
    
    // Title similarity (40% weight)
    if (originalTitle === spotifyTitle) {
      score += 0.4;
    } else if (spotifyTitle.includes(originalTitle) || originalTitle.includes(spotifyTitle)) {
      score += 0.3;
    } else {
      // Calculate partial similarity
      const titleWords = originalTitle.split(' ');
      const spotifyTitleWords = spotifyTitle.split(' ');
      const commonWords = titleWords.filter(word => spotifyTitleWords.includes(word));
      if (commonWords.length > 0) {
        score += (commonWords.length / Math.max(titleWords.length, spotifyTitleWords.length)) * 0.2;
      }
    }
    
    // Artist similarity (40% weight)
    if (originalArtist === spotifyArtist) {
      score += 0.4;
    } else if (spotifyArtist.includes(originalArtist) || originalArtist.includes(spotifyArtist)) {
      score += 0.3;
    } else {
      // Calculate partial similarity
      const artistWords = originalArtist.split(' ');
      const spotifyArtistWords = spotifyArtist.split(' ');
      const commonWords = artistWords.filter(word => spotifyArtistWords.includes(word));
      if (commonWords.length > 0) {
        score += (commonWords.length / Math.max(artistWords.length, spotifyArtistWords.length)) * 0.2;
      }
    }
    
    // Duration similarity (20% weight) - if we have duration data
    if (originalTrack.duration_ms && spotifyTrack.duration_ms) {
      const durationDiff = Math.abs(originalTrack.duration_ms - spotifyTrack.duration_ms);
      const maxDiff = Math.max(originalTrack.duration_ms, spotifyTrack.duration_ms);
      const durationSimilarity = Math.max(0, 1 - (durationDiff / maxDiff));
      score += durationSimilarity * 0.2;
    }
    
    return Math.min(score, 1.0); // Cap at 1.0
  };

  // Helper function to calculate YouTube video similarity score
  const calculateYouTubeSimilarity = (spotifyTrack: SpotifyTrack, youtubeVideo: any): number => {
    let score = 0;
    
    // Normalize strings for comparison
    const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
    
    const spotifyTitle = normalize(spotifyTrack.name);
    const spotifyArtist = normalize(spotifyTrack.artists[0]);
    const youtubeTitle = normalize(youtubeVideo.snippet.title);
    const youtubeChannel = normalize(youtubeVideo.snippet.channelTitle);
    
    // Title similarity (50% weight)
    if (spotifyTitle === youtubeTitle) {
      score += 0.5;
    } else if (youtubeTitle.includes(spotifyTitle) || spotifyTitle.includes(youtubeTitle)) {
      score += 0.4;
    } else {
      // Calculate partial similarity
      const titleWords = spotifyTitle.split(' ');
      const youtubeTitleWords = youtubeTitle.split(' ');
      const commonWords = titleWords.filter(word => youtubeTitleWords.includes(word));
      if (commonWords.length > 0) {
        score += (commonWords.length / Math.max(titleWords.length, youtubeTitleWords.length)) * 0.3;
      }
    }
    
    // Artist similarity (40% weight)
    if (spotifyArtist === youtubeChannel) {
      score += 0.4;
    } else if (youtubeChannel.includes(spotifyArtist) || spotifyArtist.includes(youtubeChannel)) {
      score += 0.3;
    } else {
      // Calculate partial similarity
      const artistWords = spotifyArtist.split(' ');
      const channelWords = youtubeChannel.split(' ');
      const commonWords = artistWords.filter(word => channelWords.includes(word));
      if (commonWords.length > 0) {
        score += (commonWords.length / Math.max(artistWords.length, channelWords.length)) * 0.2;
      }
    }
    
    // Duration similarity (10% weight) - if we have duration data
    if (spotifyTrack.duration_ms && youtubeVideo.contentDetails?.duration) {
      // Parse YouTube duration
      const duration = youtubeVideo.contentDetails.duration;
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (match) {
        const hours = parseInt(match[1] || '0');
        const minutes = parseInt(match[2] || '0');
        const seconds = parseInt(match[3] || '0');
        const youtubeDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;
        
        const durationDiff = Math.abs(spotifyTrack.duration_ms - youtubeDuration);
        const maxDiff = Math.max(spotifyTrack.duration_ms, youtubeDuration);
        const durationSimilarity = Math.max(0, 1 - (durationDiff / maxDiff));
        score += durationSimilarity * 0.1;
      }
    }
    
    return Math.min(score, 1.0); // Cap at 1.0
  };

  // Add duplicate prevention
  const checkForExistingPlaylist = async (playlistName: string, accessToken: string) => {
    try {
      // This function is no longer needed as SpotifyService is removed.
      // The logic for checking existing playlists is now handled directly
      // by the Spotify API calls or by the user's own Spotify account.
      // For now, we'll return null, meaning no existing playlist found.
      return null;
    } catch (error) {
      console.warn('Error checking for existing playlist:', error);
      return null;
    }
  };

  const startConversion = useCallback(async () => {
    // Prevent multiple simultaneous conversions
    if (state.status === ConversionStatus.MATCHING_TRACKS || 
        state.status === ConversionStatus.CREATING_PLAYLIST) {
      console.log('Conversion already in progress, ignoring duplicate request');
      return;
    }

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
            console.log('Fetching tracks from Spotify for playlist:', playlistId);
            
            // Add a timeout promise for getting tracks
            const tracksPromise = getSpotifyPlaylistTracks(playlistId);
            const timeoutPromise = new Promise<any>((_, reject) => 
              setTimeout(() => reject(new Error('Spotify tracks request timed out')), 15000)
            );
            
            const tracksData = await Promise.race([tracksPromise, timeoutPromise]);
            console.log('Raw tracks data received:', {
              itemsCount: tracksData?.items?.length || 0,
              total: tracksData?.total || 0
            });
            
            tracks = await extractTrackData(tracksData);
            console.log('Processed tracks:', tracks.length);
            
            // Cache for future use
            sessionStorage.setItem(cacheKey, JSON.stringify(tracks));
          } catch (error: any) {
            console.error('Error fetching Spotify tracks:', error);
            let errorMessage = 'Failed to load tracks from Spotify';
            if (error instanceof Error) {
              errorMessage = `Spotify error: ${error.message}`;
              if (error.message.includes('Authentication') || error.message.includes('token')) {
                errorMessage += '. Try reconnecting to Spotify.';
              } else if (error.message.includes('timed out')) {
                errorMessage = 'Spotify request timed out. Please try again with a better connection.';
              } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
                errorMessage = 'Access denied. The playlist may be private or you may not have permission to access it.';
              } else if (error.message.includes('404') || error.message.includes('Not Found')) {
                errorMessage = 'Playlist not found. It may have been deleted or made private.';
              }
            }
            throw new Error(errorMessage);
          }
        } else if (sourcePlatform === 'youtube') {
          // YouTube tracks loading logic
          try {
            console.log('Fetching tracks from YouTube for playlist:', playlistId);
            
            // Get YouTube access token
            const accessToken = localStorage.getItem('soundswapp_youtube_access_token');
            if (!accessToken) {
              throw new Error('YouTube authentication token not found. Please reconnect to YouTube.');
            }
            
            // Import the YouTube API function dynamically
            const { fetchAllYouTubePlaylistItems } = await import('./youtubeApi');
            
            // Fetch all playlist items with timeout
            const tracksPromise = fetchAllYouTubePlaylistItems(playlistId, accessToken);
            const timeoutPromise = new Promise<any>((_, reject) => 
              setTimeout(() => reject(new Error('YouTube tracks request timed out')), 15000)
            );
            
            const allItems = await Promise.race([tracksPromise, timeoutPromise]);
            console.log('Raw YouTube tracks data received:', {
              itemsCount: allItems?.length || 0
            });
            
            if (!allItems || allItems.length === 0) {
              throw new Error('No tracks found in this YouTube playlist. It might be empty, private, or you may not have access to it.');
            }
            
            // Get video details to fetch durations and better metadata
            const videoIds = allItems.map((item: any) => 
              item.snippet?.resourceId?.videoId || item.contentDetails?.videoId
            ).filter(Boolean);
            
            console.log('Fetching video details for', videoIds.length, 'videos');
            
            // Fetch video details in batches to get durations
            const videoDetails: any[] = [];
            const BATCH_SIZE = 50; // YouTube API limit
            
            for (let i = 0; i < videoIds.length; i += BATCH_SIZE) {
              const batch = videoIds.slice(i, i + BATCH_SIZE);
              const batchIds = batch.join(',');
              
              const videoResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${batchIds}`,
                {
                  headers: {
                    'Authorization': `Bearer ${accessToken}`
                  }
                }
              );
              
              if (videoResponse.ok) {
                const videoData = await videoResponse.json();
                if (videoData.items) {
                  videoDetails.push(...videoData.items);
                }
              }
              
              // Small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Create a map of video details for quick lookup
            const videoDetailsMap = new Map();
            videoDetails.forEach(video => {
              videoDetailsMap.set(video.id, video);
            });
            
            // Process YouTube tracks into the expected format with better metadata
            tracks = allItems.map((item: any) => {
              const videoId = item.snippet?.resourceId?.videoId || item.contentDetails?.videoId;
              const videoDetail = videoDetailsMap.get(videoId);
              
              const videoTitle = item.snippet?.title || '';
              const channelTitle = item.snippet?.videoOwnerChannelTitle || item.snippet?.channelTitle || 'Unknown';
              
              // Smart parsing of video titles to extract artist and title
              let artists = [channelTitle];
              let title = videoTitle;
              
              const separators = [' - ', ' – ', ': ', ' "', " '", ' // ', ' | '];
              for (const separator of separators) {
                if (videoTitle.includes(separator)) {
                  const parts = videoTitle.split(separator);
                  if (parts.length >= 2) {
                    artists = [parts[0].trim()];
                    title = parts.slice(1).join(separator).trim()
                      .replace(/^['"]/, '')
                      .replace(/['"]$/, '');
                    break;
                  }
                }
              }
              
              // Get duration from video details
              let duration_ms = 0;
              if (videoDetail?.contentDetails?.duration) {
                // Parse ISO 8601 duration format (PT4M13S -> 253000ms)
                const duration = videoDetail.contentDetails.duration;
                const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                if (match) {
                  const hours = parseInt(match[1] || '0');
                  const minutes = parseInt(match[2] || '0');
                  const seconds = parseInt(match[3] || '0');
                  duration_ms = (hours * 3600 + minutes * 60 + seconds) * 1000;
                }
              }
              
              return {
                id: item.id || `yt-${Math.random().toString(36).substring(2, 9)}`,
                name: title,
                artists: artists,
                album: channelTitle,
                duration_ms: duration_ms,
                popularity: 0,
                explicit: false,
                searchQuery: `${artists[0]} ${title}`,
                videoId: videoId
              };
            });
            
            console.log('Processed YouTube tracks:', tracks.length);
            
            // Cache for future use
            sessionStorage.setItem(cacheKey, JSON.stringify(tracks));
          } catch (error: any) {
            console.error('Error fetching YouTube tracks:', error);
            let errorMessage = 'Failed to load tracks from YouTube';
            if (error instanceof Error) {
              errorMessage = `YouTube error: ${error.message}`;
              if (error.message.includes('Authentication') || error.message.includes('token')) {
                errorMessage += '. Try reconnecting to YouTube.';
              } else if (error.message.includes('timed out')) {
                errorMessage = 'YouTube request timed out. Please try again with a better connection.';
              } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
                errorMessage = 'Access denied. The playlist may be private or you may not have permission to access it.';
              } else if (error.message.includes('404') || error.message.includes('Not Found')) {
                errorMessage = 'Playlist not found. It may have been deleted or made private.';
              }
            }
            throw new Error(errorMessage);
          }
        }
      }

      if (!tracks || tracks.length === 0) {
        console.error('No tracks found after processing. Debug info:', {
          playlistId,
          sourcePlatform,
          cachedTracks: !!cachedTracks,
          stateTracksLength: state.tracks.length
        });
        throw new Error('No tracks found in the selected playlist. This might be due to authentication issues or the playlist being empty.');
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
              // Create multiple search queries for better matching
              const searchQueries = [
                `${track.artists[0]} ${track.name}`,
                `${track.name} ${track.artists[0]}`,
                track.name,
                `${track.artists[0]} - ${track.name}`,
                `${track.artists[0]} "${track.name}"`
              ];
              
              let bestMatch = null;
              let bestScore = 0;
              
              // Try each search query
              for (const query of searchQueries) {
                const videoSearchResults = await searchYouTube(user.uid, query);
                
                if (videoSearchResults && videoSearchResults.items && videoSearchResults.items.length > 0) {
                  // Score each result based on similarity
                  for (const result of videoSearchResults.items) {
                    const score = calculateYouTubeSimilarity(track, result);
                    
                    if (score > bestScore) {
                      bestScore = score;
                      bestMatch = result;
                    }
                  }
                }
                
                // If we found a good match (score > 0.7), stop searching
                if (bestScore > 0.7) {
                  break;
                }
              }
              
              if (bestMatch && bestScore > 0.5) {
                return { 
                  trackId: track.id, 
                  match: {
                    videoId: bestMatch.id.videoId,
                    title: bestMatch.snippet.title,
                    channelTitle: bestMatch.snippet.channelTitle,
                    thumbnailUrl: bestMatch.snippet.thumbnails?.default?.url || '',
                    score: Math.round(bestScore * 100),
                    matchDetails: {
                      titleMatch: Math.round(bestScore * 100),
                      artistMatch: Math.round(bestScore * 100),
                      lengthScore: Math.round(bestScore * 100)
                    },
                    isMockData: false
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
          let failedTracks: FailedTrack[] = []; // Track failed tracks
          
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
            const [trackId, match] = matchEntries[i];
            const track = tracks.find(t => t.id === trackId);
            
            if (!match || !match.videoId) {
              processedVideos++;
              failureCount++;
              
              // Track the failed track
              if (track) {
                const failedTrack: FailedTrack = {
                  name: track.name,
                  artists: track.artists,
                  reason: 'No YouTube match found',
                  searchQueries: [`${track.artists[0]} ${track.name}`, track.name],
                  bestMatchScore: 0,
                  bestMatchTitle: 'None',
                  bestMatchArtist: 'None'
                };
                failedTracks.push(failedTrack);
              }
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
                
                // Track the failed track
                if (track) {
                  const failedTrack: FailedTrack = {
                    name: track.name,
                    artists: track.artists,
                    reason: `Failed to add to YouTube playlist after ${attempts} attempts: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`,
                    searchQueries: [`${track.artists[0]} ${track.name}`],
                    bestMatchScore: match.score / 100,
                    bestMatchTitle: match.title,
                    bestMatchArtist: match.channelTitle
                  };
                  failedTracks.push(failedTrack);
                }
              }
            } catch (error) {
              failureCount++;
              console.error(`Error adding video ${match.videoId} to playlist:`, error);
              
              // Track the failed track
              if (track) {
                const failedTrack: FailedTrack = {
                  name: track.name,
                  artists: track.artists,
                  reason: error instanceof Error ? error.message : 'Unknown error',
                  searchQueries: [`${track.artists[0]} ${track.name}`],
                  bestMatchScore: match.score / 100,
                  bestMatchTitle: match.title,
                  bestMatchArtist: match.channelTitle
                };
                failedTracks.push(failedTrack);
              }
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
          
          // Provide detailed feedback about the conversion
          const missingTracks = tracks.length - successCount;
          let feedbackMessage = `Successfully converted ${successCount} tracks`;
          
          if (missingTracks > 0) {
            feedbackMessage += ` (${missingTracks} tracks not found on Spotify)`;
            
            // Show a toast with helpful information
            if (typeof window !== 'undefined' && window.dispatchEvent) {
              window.dispatchEvent(new CustomEvent('show-toast', {
                detail: {
                  type: 'info',
                  title: 'Conversion Complete',
                  message: `${successCount} tracks converted successfully. ${missingTracks} tracks were not found on Spotify and were skipped.`,
                  duration: 8000
                }
              }));
            }
          }
          
          console.log(feedbackMessage);
          
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
            isMockData: false,
            failedTracks: failedTracks // Include failed tracks in history
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
                    duration_ms: track.duration_ms,
                    popularity: track.popularity || 0,
                    explicit: track.explicit || false,
                    releaseYear: track.releaseYear,
                    genres: track.genres || [],
                    artistImages: track.artistImages || []
                  })),
                  failedTracks: failedTracks // Save failed tracks to Firestore
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
        console.log('Starting YouTube to Spotify conversion');
        
        // Check if user has Spotify authentication
        if (!(await isSpotifyAuthenticated())) {
          throw new Error('Spotify authentication required. Please reconnect your Spotify account.');
        }
        
        // Get the selected playlist details
        const selectedPlaylist = state.youtubePlaylists.find((p: any) => p.id === playlistId);
        if (!selectedPlaylist) {
          throw new Error('Selected playlist details not found');
        }
        
        // Create a descriptive Spotify playlist name
        const spotifyPlaylistName = `${selectedPlaylist.snippet?.title || 'YouTube Playlist'} (Converted)`;
        const spotifyPlaylistDescription = `Converted from YouTube using SoundSwapp`;
        
        try {
          // Import Spotify API functions
          const { createSpotifyPlaylist, addTracksToSpotifyPlaylist } = await import('./spotifyApi');
          
          // Create the Spotify playlist
          console.log('Creating Spotify playlist:', spotifyPlaylistName);
          const newSpotifyPlaylist = await createSpotifyPlaylist(spotifyPlaylistName, spotifyPlaylistDescription);
          
          if (!newSpotifyPlaylist || !newSpotifyPlaylist.id) {
            throw new Error('Failed to create Spotify playlist');
          }
          
          const spotifyPlaylistId = newSpotifyPlaylist.id;
          const spotifyPlaylistUrl = `https://open.spotify.com/playlist/${spotifyPlaylistId}`;
          
          console.log(`Created Spotify playlist: ${spotifyPlaylistId}`);
          
          // Save the Spotify playlist ID to state
          dispatch({ 
            type: 'SET_SPOTIFY_PLAYLIST', 
            payload: { 
              id: spotifyPlaylistId, 
              url: spotifyPlaylistUrl
            } 
          });
          
          // Search for tracks on Spotify and add them to the playlist
          let successCount = 0;
          let failureCount = 0;
          let totalTracks = tracks.length;
          let failedTracks: FailedTrack[] = []; // Track failed tracks
          
          console.log(`Starting to add ${totalTracks} tracks to Spotify playlist ${spotifyPlaylistId}`);
          
          // Process tracks one by one with progress updates
          for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            
            try {
              // Use improved search queries
              const searchQueries = generateSearchQueries(track);
              
              let bestMatch = null;
              let bestScore = 0;
              let bestMatchTitle = '';
              let bestMatchArtist = '';
              
              // Try each search query
              for (const searchQuery of searchQueries) {
                console.log(`Searching Spotify for: "${searchQuery}"`);
                
                // Import Spotify search function
                const { searchSpotifyTracks } = await import('./spotifyApi');
                const searchResults = await searchSpotifyTracks(searchQuery, 20); // Get more results
                
                if (searchResults && searchResults.tracks && searchResults.tracks.items && searchResults.tracks.items.length > 0) {
                  // Score each result based on similarity
                  for (const result of searchResults.tracks.items) {
                    const score = calculateTrackSimilarity(track, result);
                    
                    if (score > bestScore) {
                      bestScore = score;
                      bestMatch = result;
                      bestMatchTitle = result.name;
                      bestMatchArtist = result.artists[0].name;
                    }
                  }
                }
                
                // If we found a good match (score > 0.6), stop searching
                if (bestScore > 0.6) {
                  break;
                }
              }
              
              // Lower the threshold for better matching - from 0.5 to 0.3
              if (bestMatch && bestScore > 0.3) {
                const trackUri = bestMatch.uri;
                
                console.log(`Found Spotify track: ${bestMatch.name} by ${bestMatch.artists[0].name} (score: ${bestScore.toFixed(2)})`);
                
                // Add the track to the Spotify playlist
                await addTracksToSpotifyPlaylist(spotifyPlaylistId, [trackUri]);
                
                successCount++;
                console.log(`Successfully added track ${i + 1}/${totalTracks}`);
              } else {
                failureCount++;
                console.log(`No good Spotify match found for: "${track.name}" by ${track.artists[0]} (best score: ${bestScore.toFixed(2)})`);
                
                // Track the failed track with details
                const failedTrack: FailedTrack = {
                  name: track.name,
                  artists: track.artists,
                  reason: bestScore > 0 ? `Best match score (${bestScore.toFixed(2)}) below threshold (0.5)` : 'No matches found',
                  searchQueries: searchQueries,
                  bestMatchScore: bestScore,
                  bestMatchTitle: bestMatchTitle || 'None',
                  bestMatchArtist: bestMatchArtist || 'None'
                };
                failedTracks.push(failedTrack);
              }
            } catch (error) {
              failureCount++;
              console.error(`Error processing track "${track.name}":`, error);
              
              // Track the failed track with error details
              const failedTrack: FailedTrack = {
                name: track.name,
                artists: track.artists,
                reason: error instanceof Error ? error.message : 'Unknown error',
                searchQueries: [
                  `${track.artists[0]} ${track.name}`,
                  `${track.name} ${track.artists[0]}`,
                  track.name,
                  `${track.artists[0]} - ${track.name}`,
                  `${track.artists[0]} "${track.name}"`
                ],
                bestMatchScore: 0,
                bestMatchTitle: 'Error occurred',
                bestMatchArtist: 'Error occurred'
              };
              failedTracks.push(failedTrack);
            }
            
            // Update progress after each track
            const progress = Math.min(((i + 1) / totalTracks) * 100, 100);
            dispatch({ type: 'UPDATE_MATCHING_PROGRESS', payload: progress });
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          // Update state to indicate success
          dispatch({ type: 'SET_STATUS', payload: ConversionStatus.SUCCESS });
          
          // Save the conversion to history
          const conversionResult: ConversionResult = {
            id: `conversion_${Date.now()}`,
            spotifyPlaylistId,
            spotifyPlaylistName,
            spotifyPlaylistUrl,
            youtubePlaylistId: playlistId,
            youtubePlaylistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
            tracksMatched: successCount,
            tracksFailed: failureCount,
            totalTracks: tracks.length,
            convertedAt: new Date(),
            isMockData: false,
            failedTracks: failedTracks // Include failed tracks in history
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
            const docRef = doc(conversionsRef, conversionResult.id);
            
            await setDoc(docRef, {
              ...conversionResult,
              convertedAt: Timestamp.fromDate(conversionResult.convertedAt),
              userId: user.uid,
              tracks: tracks.map(track => ({
                name: track.name,
                artists: track.artists,
                album: track.album,
                duration_ms: track.duration_ms,
                popularity: track.popularity || 0,
                explicit: track.explicit || false,
                releaseYear: track.releaseYear,
                genres: track.genres || [],
                artistImages: track.artistImages || []
              })),
              failedTracks: failedTracks // Save failed tracks to Firestore
            });

            console.log('Successfully saved conversion to Firestore:', docRef.id);
          } catch (firestoreError) {
            console.error('Failed to save conversion history to Firestore:', firestoreError);
            logFirestoreError('saveConversion', firestoreError, user.uid);
          }
          
        } catch (playlistError) {
          console.error('Error during Spotify playlist creation or population:', playlistError);
          let errorMessage = 'Failed to create or update Spotify playlist';
          
          if (playlistError instanceof Error) {
            if (playlistError.message.includes('Authentication') || playlistError.message.includes('token')) {
              errorMessage = 'Spotify authentication expired. Please reconnect your Spotify account.';
            } else if (playlistError.message.includes('quota')) {
              errorMessage = 'Spotify API quota exceeded. Please try again later.';
            } else {
              errorMessage = `Spotify error: ${playlistError.message}`;
            }
          }
          
          throw new Error(errorMessage);
        }
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
  }, [state.spotifyPlaylists, state.youtubePlaylists, user, dispatch, state.tracks, state.selectedPlaylistId]);
  
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
              isMockData: data.isMockData || false,
            failedTracks: data.failedTracks || [] // Load failed tracks from Firestore
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
  
  const contextValue: ConversionContextType = {
    state,
    fetchSpotifyPlaylists,
    fetchYouTubePlaylists,
    selectPlaylist,
    selectYouTubePlaylist,
    startConversion,
    resetConversion,
    fetchConversionHistory,
    toggleMockDataMode,
    dispatch
  };
  
  return (
    <ConversionContext.Provider value={contextValue}>
      {children}
    </ConversionContext.Provider>
  );
}; 