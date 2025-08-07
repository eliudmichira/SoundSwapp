export type PlatformKey = 'spotify' | 'youtube' | 'soundcloud';

export interface TrackData {
  id: string;
  name: string;
  artists: string[];
  artistIds?: string[];
  artistImages?: string[];
  genres?: string[];
  album?: string;
  duration_ms: number;
  popularity: number;
  explicit?: boolean;
  releaseYear?: string;
  searchQuery?: string;
  videoId?: string;
}

export interface ConversionTrack {
  name: string;
  artists: string[];
  popularity?: number;
  duration_ms?: number;
  explicit?: boolean;
  album?: string;
  releaseYear?: string | number;
  genres?: string[];
  artistImages?: string[];
}

export interface Track {
  name: string;
  artists: string[];
  popularity?: number;
  duration_ms?: number;
  explicit?: boolean;
  album?: string;
  releaseYear?: string | number;
  genres?: string[];
  artistImages?: string[];
  id?: string;
  searchQuery?: string;
}

export interface YouTubePlaylist {
  id: string;
  snippet?: {
    title?: string;
    thumbnails?: {
      default?: {
        url: string;
      };
    };
    channelTitle?: string;
  };
  contentDetails?: {
    itemCount?: number;
  };
}

export type ConversionStep = 'select-source' | 'select-destination' | 'select-playlist' | 'converting';

export type ActiveTab = 'connections' | 'converter' | 'history' | 'profile';

export type ToastType = "success" | "error" | "warning" | "info";

export interface ConversionState {
  sourcePlatform: PlatformKey | null;
  destinationPlatform: PlatformKey | null;
  playlistUrl: string;
  playlistData: any;
  conversionStep: ConversionStep;
  isConverting: boolean;
  conversionProgress: number;
  failedTracks: any[];
  conversionHistory: any[];
}

export interface UIState {
  activeTab: ActiveTab;
  showEditProfile: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

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