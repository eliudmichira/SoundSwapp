import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EnhancedHeroSection } from './EnhancedHeroSection';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext';
import { useConversion, ConversionStatus } from '../lib/ConversionContext';
import { getYouTubeAuthUrl } from '../lib/youtubeAuth';
import { initSpotifyAuth } from '../lib/spotifyAuth';
import { cn } from '../lib/utils';
import { GlassmorphicCard } from './ui/GlassmorphicCard';
import { Enhanced3DCard } from './ui/Enhanced3DCard';
import { EnhancedGradientText } from './ui/EnhancedGradientText';
import { SuccessCelebration } from './feedback/SuccessCelebration';
import { ToastContainer, Toast } from './feedback/EnhancedToast';
import { PlaylistInsights } from './visualization/PlaylistInsights';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedConnectionCard from './EnhancedConnectionCard';
import { GlowButton } from './ui/GlowButton';
import { ParticleField } from './ui/ParticleField';
import { GlassmorphicContainer } from './ui/GlassmorphicContainer';
import { FloatingLabels } from './ui/FloatingLabels';
import AnimatedGradientText from './ui/AnimatedGradientText';
import LightingText from './ui/LightingText'; // Added import
import SpotlightCard from './ui/SpotlightCard'; // Added import

// Import Lucide React icons
import { 
  FileSpreadsheet, 
  CheckCircle,
  Loader,
  Music,
  Github,
  Mail,
  ExternalLink,
  RefreshCw,
  Shield,
  Zap,
  Info,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Upload,
  Download,
  ClipboardPaste,
  Search,
  LogOut,
  Lock,
  PlayCircle,
  Settings,
  Headphones,
  Youtube
} from 'lucide-react';
// Import real Spotify icon
import { FaSpotify } from 'react-icons/fa';

// Platform key type
export type PlatformKey = 'spotify' | 'youtube' | 'soundcloud';

// Define YouTube playlist interface
interface YouTubePlaylist {
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

// Enhanced track interface
interface Track {
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

// Keyboard accessibility helper
interface KeyboardFocusableCardProps {
  children: React.ReactNode;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  [key: string]: any;
}

const KeyboardFocusableCard: React.FC<KeyboardFocusableCardProps> = ({ 
  children, 
  onKeyDown, 
  onClick, 
  className, 
  ...props 
}) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onKeyDown?.(e);
      
      if (!e.defaultPrevented && onClick) {
        onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  }, [onKeyDown, onClick]);

  return (
    <div 
      tabIndex={0} 
      role="button"
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-brand-primary-action focus:ring-offset-2 focus:ring-offset-background-primary rounded-lg transition-all",
        className
      )}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      {...props}
    >
      {children}
                </div>
              );
};

// Create a reusable connection button component
interface ConnectButtonProps {
  platform: PlatformKey;
  isConnected: boolean;
  onConnect: () => void;
  className?: string;
}

// Platform connection button component
const ConnectButton: React.FC<ConnectButtonProps> = ({ platform, isConnected, onConnect, className }) => {
  const platformData = {
    spotify: {
      icon: <FaSpotify className="h-5 w-5" />,
      text: 'Spotify',
      bgColor: 'bg-platform-spotify hover:bg-platform-spotify-hover',
      bgColorConnected: 'bg-platform-spotify-connected text-content-on-platform-spotify-connected'
    },
    youtube: {
      icon: <Youtube className="h-5 w-5" />,
      text: 'YouTube',
      bgColor: 'bg-platform-youtube hover:bg-platform-youtube-hover',
      bgColorConnected: 'bg-platform-youtube-connected text-content-on-platform-youtube-connected'
    },
    soundcloud: {
      icon: <Music className="h-5 w-5" />,
      text: 'SoundCloud',
      bgColor: 'bg-platform-soundcloud hover:bg-platform-soundcloud-hover', 
      bgColorConnected: 'bg-platform-soundcloud-connected text-content-on-platform-soundcloud-connected'
    }
  };

  const data = platformData[platform];
  
  return (
    <button
      onClick={onConnect}
      disabled={isConnected}
      className={cn(
        "flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors",
        isConnected 
          ? data.bgColorConnected
          : `${data.bgColor} text-content-inverse`, // Assuming default button text is on a dark/colored background
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary", 
        // Determine focus ring color based on platform or a generic action color
        platform === 'spotify' ? 'focus:ring-platform-spotify' :
        platform === 'youtube' ? 'focus:ring-platform-youtube' :
        platform === 'soundcloud' ? 'focus:ring-platform-soundcloud' :
        'focus:ring-brand-primary-action',
        className
      )}
      aria-label={`${isConnected ? 'Connected to' : 'Connect to'} ${data.text}`}
    >
      {data.icon}
      <span>{isConnected ? 'Connected' : `Connect ${data.text}`}</span>
      {isConnected && <CheckCircle className="h-5 w-5 text-current" />}
                </button>
  );
};

// Define insights interfaces
interface Genre {
  name: string;
  count: number;
  color: string;
}

interface Artist {
  name: string;
  count: number;
  image?: string;
}

interface PlaylistInsightStats {
  totalTracks: number;
  avgPopularity: number;
  totalDuration: number;
  genres: Genre[];
  topArtists: Artist[];
  releaseYears: Record<string, number>;
  totalGenreMentions?: number;
  mostPopularTrack?: Track;
  leastPopularTrack?: Track;
  longestTrack?: Track;
  shortestTrack?: Track;
  explicitCount?: number;
  nonExplicitCount?: number;
  topAlbums?: { name: string; count: number }[];
}

// Function to get playlist insights from the tracks data
const generatePlaylistInsights = (tracks: Track[]): PlaylistInsightStats => {
  if (!tracks || tracks.length === 0) {
    return {
      totalTracks: 0,
      totalDuration: 0,
      avgPopularity: 0,
      genres: [],
      topArtists: [],
      releaseYears: {},
      totalGenreMentions: 0,
      explicitCount: 0,
      nonExplicitCount: 0,
      topAlbums: [],
    };
  }

  // Get genre colors for visualization
  const genreColors: Record<string, string> = {
    'pop': 'hsl(var(--brand-highlight-pink-hsl))', // Playful Pink
    'rock': 'hsl(var(--brand-secondary-action-hsl))', // Electric Teal
    'hip hop': 'hsl(var(--brand-accent-lavender-hsl))', // Soft Lavender
    'rap': 'hsl(var(--brand-accent-lavender-hsl))', // Soft Lavender
    'electronic': 'hsl(var(--brand-accent-lime-hsl))', // Dopamine Lime
    'dance': 'hsl(var(--brand-accent-lime-hsl))', // Dopamine Lime
    'edm': 'hsl(var(--brand-accent-lime-hsl))', // Dopamine Lime
    'r&b': 'hsl(var(--brand-highlight-yellow-hsl))', // Sunny Yellow
    'indie': 'hsl(var(--brand-secondary-action-hsl))', // Electric Teal
    'alternative': 'hsl(var(--brand-secondary-action-hsl), 0.8)', // Electric Teal (slightly muted)
    'country': 'hsl(var(--brand-primary-action-hsl))', // Vibrant Coral
    'folk': 'hsl(var(--brand-highlight-yellow-hsl), 0.8)', // Sunny Yellow (slightly muted)
    'metal': 'hsl(var(--brand-primary-action-hsl), 0.7)', // Darker Coral
    'jazz': 'hsl(var(--brand-accent-lavender-hsl), 0.9)', // Soft Lavender (slightly muted)
    'classical': 'hsl(var(--brand-secondary-action-hsl), 0.7)', // Electric Teal (muted)
    'soul': 'hsl(var(--brand-highlight-pink-hsl), 0.8)', // Playful Pink (slightly muted)
    'blues': 'hsl(var(--brand-accent-lavender-hsl), 0.7)', // Deeper Lavender
    'reggae': 'hsl(var(--brand-accent-lime-hsl), 0.9)', // Dopamine Lime (slightly muted)
    'punk': 'hsl(var(--brand-primary-action-hsl), 0.9)', // Vibrant Coral (slightly muted)
    'latin': 'hsl(var(--brand-highlight-yellow-hsl), 0.9)', // Sunny Yellow (slightly muted)
    'default': 'hsl(var(--text-tertiary-hsl))'
  };
  
  // Calculate total duration and average popularity
  const totalDurationSeconds = tracks.reduce((sum, track) => sum + (track.duration_ms / 1000), 0);
  const totalDurationMinutes = Math.round(totalDurationSeconds / 60 * 10) / 10;
  const avgPopularity = Math.round(
    tracks.reduce((sum, track) => sum + (track.popularity || 0), 0) / tracks.length
  );
  
  // Extract genre, artist, album, and year information
  const genreCounts: Record<string, number> = {};
  const artistCounts: Record<string, { count: number; name: string; image?: string }> = {};
  const releaseYears: Record<string, number> = {};
  const albumCounts: Record<string, number> = {};
  let explicitCount = 0;
  let nonExplicitCount = 0;

  // Find most and least popular tracks
  let mostPopularTrack = tracks[0];
  let leastPopularTrack = tracks[0];
  let longestTrack = tracks[0];
  let shortestTrack = tracks[0];

  tracks.forEach(track => {
    // Update popularity extremes
    if (track.popularity > (mostPopularTrack?.popularity || 0)) {
      mostPopularTrack = track;
    }
    if (track.popularity < (leastPopularTrack?.popularity || 100)) {
      leastPopularTrack = track;
    }
    
    // Update duration extremes
    if (track.duration_ms > (longestTrack?.duration_ms || 0)) {
      longestTrack = track;
    }
    if (track.duration_ms < (shortestTrack?.duration_ms || Infinity)) {
      shortestTrack = track;
    }
    
    // Genres (from enriched data)
    if (track.genres && Array.isArray(track.genres)) {
      track.genres.forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
    
    // Artists (from enriched data)
    if (track.artists && track.artists.length > 0) {
      track.artists.forEach((artist: string, idx: number) => {
        const image = track.artistImages && track.artistImages[idx];
        if (artistCounts[artist]) {
          artistCounts[artist].count += 1;
        } else {
          artistCounts[artist] = {
            count: 1,
            name: artist,
            image: image || undefined
          };
        }
      });
    }
    
    // Release year (from enriched data)
    if (track.releaseYear) {
      releaseYears[track.releaseYear] = (releaseYears[track.releaseYear] || 0) + 1;
    }
    
    // Albums
    if (track.album) {
      albumCounts[track.album] = (albumCounts[track.album] || 0) + 1;
    }
    
    // Explicit
    if (track.explicit) {
      explicitCount++;
    } else {
      nonExplicitCount++;
    }
  });
  
  // Calculate total genre mentions for proper percentage normalization
  const totalGenreMentions = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
  
  // Convert genres to array format for visualization
  const genres: Genre[] = Object.entries(genreCounts)
    .map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      count,
      color: genreColors[name] || genreColors.default
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 genres
  
  // Convert artists to array format for visualization
  const topArtists = Object.values(artistCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5 artists
    .map(artist => ({
      name: artist.name,
      count: artist.count,
      image: artist.image
    }));
  
  // Convert albums to array format
  const topAlbums = Object.entries(albumCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 albums
  
  return {
    totalTracks: tracks.length,
    totalDuration: totalDurationMinutes,
    avgPopularity,
    genres,
    topArtists,
    releaseYears,
    totalGenreMentions,
    mostPopularTrack,
    leastPopularTrack,
    longestTrack,
    shortestTrack,
    explicitCount,
    nonExplicitCount,
    topAlbums
  };
};

// Extract URL utility function
const extractPlaylistId = (url: string, platform: PlatformKey): string | null => {
  if (!url) return null;
  
  try {
    if (platform === 'spotify') {
      // Handle URLs like https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd?si=abc123
      // or spotify:playlist:37i9dQZF1DX0XUsuxWHRQd
      let match = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9_-]+)/);
      if (!match && url.includes('spotify:playlist:')) {
        match = url.match(/spotify:playlist:([a-zA-Z0-9_-]+)/);
      }
      if (match && match[1]) {
        // Remove any trailing query params or slashes
        return match[1].split(/[/?#]/)[0];
      }
      
      // Try direct ID format (if the user just pasted the ID)
      if (/^[a-zA-Z0-9]{22}$/.test(url)) {
        return url;
      }
    } else if (platform === 'youtube') {
      // Handle URLs like https://www.youtube.com/playlist?list=PLw-VjHDlEOgvtnnnqWlTqryAtBXmZCujo
      const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return match[1];
      }
      
      // Try direct ID format (if the user just pasted the ID)
      if (/^[a-zA-Z0-9_-]{24,34}$/.test(url)) {
        return url;
      }
    }
    } catch (error) {
    console.error("Error extracting playlist ID:", error);
  }
  
  return null;
};

/**
 * Modern playlist converter with enhanced accessibility
 */
const ModernPlaylistConverter: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // Add mobile detection
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Detect mobile devices on component mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      // Add mobile class to body for CSS targeting
      if (mobile) {
        document.body.classList.add('is-mobile');
      } else {
        document.body.classList.remove('is-mobile');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const { 
    user, 
    isAuthenticated, 
    hasSpotifyAuth, 
    hasYouTubeAuth,
    signOut,
    disconnectFromSpotify,
    disconnectFromYouTube,
    isConnectingSpotify,
    isConnectingYouTube,
    spotifyError,
    youtubeError
  } = useAuth();
  
  const conversion = useConversion();
  const {
    state: conversionState,
    fetchSpotifyPlaylists,
    selectPlaylist,
    startConversion,
    fetchConversionHistory,
    dispatch
  } = conversion;
  
  // Get YouTube methods safely 
  const fetchYouTubePlaylists = conversion.fetchYouTubePlaylists || (() => {
    console.warn('fetchYouTubePlaylists not available');
  });
  
  // Form state
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWizardStep, setCurrentWizardStep] = useState(1);
  const [showPlaylistSuggestions, setShowPlaylistSuggestions] = useState(false);
  const [showYoutubePlaylistSuggestions, setShowYoutubePlaylistSuggestions] = useState(false);
  const [playlistNameForExport, setPlaylistNameForExport] = useState('');
  const [playlistDescriptionForExport, setPlaylistDescriptionForExport] = useState('');
  
  // Platform selection with proper typing
  type PlatformInfo = {
    key: PlatformKey;
    label: string;
    color: string;
    icon: any; // Using any for icon is acceptable here since we know it's a FontAwesome icon
  };
  
  const platforms = useMemo<PlatformInfo[]>(() => [
    { key: 'spotify', label: 'Spotify', color: 'bg-green-500', icon: FaSpotify },
    { key: 'youtube', label: 'YouTube', color: 'bg-red-500', icon: Youtube },
  ], []);
  
  // State with proper typing
  const [sourcePlatform, setSourcePlatform] = useState<PlatformKey>('spotify');
  const [destinationPlatform, setDestinationPlatform] = useState<PlatformKey>('youtube');

  // Ensure destination is never the same as source
  useEffect(() => {
    if (destinationPlatform === sourcePlatform) {
      const next = platforms.find(p => p.key !== sourcePlatform);
      if (next) setDestinationPlatform(next.key);
    }
    
    // Save platform selections to localStorage for persistence
    localStorage.setItem('source_platform', sourcePlatform);
    localStorage.setItem('destination_platform', destinationPlatform);
  }, [sourcePlatform, destinationPlatform, platforms]);
  
  // Restore saved platform selections on initial load
  useEffect(() => {
    const savedSource = localStorage.getItem('source_platform');
    const savedDestination = localStorage.getItem('destination_platform');
    const lastPlaylistUrl = localStorage.getItem('last_playlist_url');
    
    if (savedSource && platforms.some(p => p.key === savedSource as PlatformKey)) {
      setSourcePlatform(savedSource as PlatformKey);
    }
    
    if (savedDestination && platforms.some(p => p.key === savedDestination as PlatformKey) && savedDestination !== sourcePlatform) {
      setDestinationPlatform(savedDestination as PlatformKey);
    }
    
    if (lastPlaylistUrl) {
      setSpotifyUrl(lastPlaylistUrl);
    }
  }, [platforms, sourcePlatform]);
  
  // Set the document title
  useEffect(() => {
    document.title = `Playlist Converter - Convert ${platforms.find(p => p.key === sourcePlatform)?.label} to ${platforms.find(p => p.key === destinationPlatform)?.label}`;
  }, [sourcePlatform, destinationPlatform, platforms]);
  
  // Fetch conversion history when user is authenticated
  const hasFetchedHistory = useRef(false);
  useEffect(() => {
    if (isAuthenticated && !hasFetchedHistory.current) {
      hasFetchedHistory.current = true;
      const loadHistory = async () => {
        try {
          await fetchConversionHistory();
        } catch (error) {
          console.error('Error loading conversion history:', error);
        }
      };
      loadHistory();
    }
  }, [isAuthenticated, fetchConversionHistory]);
  
  // Set default playlist name and description when a playlist is selected
  useEffect(() => {
    if (conversionState.selectedPlaylistId && conversionState.spotifyPlaylists) {
      const selectedPlaylist = conversionState.spotifyPlaylists.find(p => p.id === conversionState.selectedPlaylistId);
      if (selectedPlaylist) {
        setPlaylistNameForExport(`${selectedPlaylist.name} (Converted)`);
        setPlaylistDescriptionForExport(`Converted from ${sourcePlatform} using Playlist Converter`);
      }
    }
  }, [conversionState.selectedPlaylistId, conversionState.spotifyPlaylists, sourcePlatform]);
  
  // Show celebration when conversion is successful
  useEffect(() => {
    if (conversionState.status === ConversionStatus.SUCCESS) {
      setShowCelebration(true);
      setIsProcessing(false);
      
      // Determine destination platform and use appropriate playlist URL
      const destinationIsSpotify = destinationPlatform === 'spotify';
      const playlistUrl = destinationIsSpotify 
        ? conversionState.spotifyPlaylistUrl 
        : conversionState.youtubePlaylistUrl;
      
      const platformName = destinationIsSpotify ? 'Spotify' : 'YouTube';
      
      addToast({
        type: 'success',
        title: 'Conversion Complete',
        message: `Your playlist has been successfully converted to ${platformName}!`,
        actionLabel: 'View Playlist',
        onAction: () => {
          if (playlistUrl) {
            window.open(playlistUrl, '_blank');
          }
        }
      });
      
      // Move to final step in wizard
      setCurrentWizardStep(4);
    }
  }, [conversionState.status, conversionState.youtubePlaylistUrl, conversionState.spotifyPlaylistUrl, destinationPlatform]);
  
  // Set processing state based on conversion status
  useEffect(() => {
    const processingStatuses = [
      ConversionStatus.LOADING_TRACKS,
      ConversionStatus.MATCHING_TRACKS,
      ConversionStatus.CREATING_PLAYLIST
    ];
    
    setIsProcessing(processingStatuses.includes(conversionState.status));
  }, [conversionState.status]);
  
  // Track errors and notify the user
  useEffect(() => {
    if (conversionState.error) {
      addToast({
        type: 'error',
        title: 'Conversion Error',
        message: conversionState.error || 'An error occurred during conversion.',
        actionLabel: 'Try Again'
      });
    }
  }, [conversionState.error]);
  
  // Auto-advance Steps: Advance to step 3 when tracks are loaded after import
  useEffect(() => {
    if (currentWizardStep === 2 && conversionState.tracks.length > 0 && !isProcessing) {
    setTimeout(() => {
        setCurrentWizardStep(3);
        // Scroll to wizard card
        document.getElementById('playlist-wizard-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
    // Save last imported playlist URL
    if (conversionState.selectedPlaylistId && currentWizardStep === 2) {
      if (sourcePlatform === 'spotify') {
        localStorage.setItem('last_playlist_url', spotifyUrl);
      } else if (sourcePlatform === 'youtube') {
        localStorage.setItem('last_playlist_url', youtubeUrl);
      }
    }
  }, [conversionState.tracks.length, isProcessing, currentWizardStep, conversionState.selectedPlaylistId, spotifyUrl, youtubeUrl, sourcePlatform]);
  
  // Toast management
  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const addToast = useCallback(({ type, message, title, actionLabel, onAction, duration = 5000 }: Omit<Toast, 'id'> & { duration?: number }) => {
    const id = Date.now();
    const newToast: Toast = {
      id,
      type,
      title: title || '',
      message: message || '',
      actionLabel,
      onAction
    };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }, [dismissToast]);
  
  // Show different toast types
  const showToast = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const toastConfig = {
      success: {
        title: 'Success',
        message: message || 'Operation completed successfully!',
        actionLabel: 'Ok'
      },
      error: {
        title: 'Error',
        message: message || 'Something went wrong. Please try again.',
        actionLabel: 'Retry'
      },
      warning: {
        title: 'Warning',
        message: message || 'Some tracks might not have been matched correctly.',
        actionLabel: 'Review'
      },
      info: {
        title: 'Information',
        message: message || 'Your conversion is being processed in the background.',
        actionLabel: 'Details'
      }
    };
    
    addToast({
      type,
      title: toastConfig[type].title,
      message: toastConfig[type].message,
      actionLabel: toastConfig[type].actionLabel
    });
  }, [addToast]);
  
  // YouTube playlists data handling
  const selectYouTubePlaylist = useCallback((id: string) => {
    dispatch({ type: 'SET_STATUS', payload: ConversionStatus.LOADING_TRACKS });
    setIsProcessing(true);
    
    // Select the playlist
    dispatch({ type: 'SELECT_PLAYLIST', payload: id });
    
    // Call the YouTube API to get tracks from this playlist
    const accessToken = localStorage.getItem('youtube_access_token');
    
    if (!accessToken) {
      showToast('error', 'YouTube authentication token not found. Please reconnect.');
      setIsProcessing(false);
      return;
    }
    
    // Use a proper abort controller for the fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      signal: controller.signal
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        clearTimeout(timeoutId);
        
        if (data && data.items && data.items.length > 0) {
          // Convert YouTube playlist items to a format compatible with our tracks state
          const tracks: Track[] = data.items.map((item: any) => {
            let videoTitle = item.snippet?.title || '';
            let artists = [item.snippet?.videoOwnerChannelTitle || 'Unknown'];
            let title = videoTitle;
            
            // Smart parsing of video titles to extract artist and title
            const separators = [' - ', ' – ', ': ', ' "', " '", ' // '];
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
            
            return {
              id: item.id || `yt-${Math.random().toString(36).substring(2, 9)}`,
              name: title,
              artists: artists,
              album: item.snippet?.channelTitle || '',
              duration_ms: 0, // YouTube API doesn't provide duration in the playlist items response
              popularity: 0,
              explicit: false,
              searchQuery: `${artists[0]} ${title}`,
              videoId: item.snippet?.resourceId?.videoId || item.contentDetails?.videoId
            };
          });
          
          dispatch({ type: 'SET_TRACKS', payload: tracks as any }); // Use a type assertion for now
          setIsProcessing(false);
          
          setTimeout(() => {
            setCurrentWizardStep(3);
            document.getElementById('playlist-wizard-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        } else {
          addToast({
            type: 'error',
            title: 'No tracks found',
            message: 'This playlist appears to be empty.'
          });
          setIsProcessing(false);
        }
      })
      .catch(error => {
        clearTimeout(timeoutId);
        
        console.error('Error fetching YouTube playlist tracks:', error);
        
        // More specific error message based on the error type
        let errorMessage = 'An error occurred trying to load the YouTube playlist.';
        
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again or check your internet connection.';
        } else if (error.message.includes('401')) {
          errorMessage = 'YouTube authorization expired. Please reconnect your YouTube account.';
        } else if (error.message.includes('403')) {
          errorMessage = 'You don\'t have permission to access this playlist.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Playlist not found. It may have been deleted or set to private.';
        }
        
        addToast({
          type: 'error',
          title: 'Failed to load playlist',
          message: errorMessage
        });
        
        setIsProcessing(false);
      });
  }, [dispatch, addToast, showToast]);

  // Handle playlist URL submission with improved error handling
  const handlePlaylistUrlSubmit = useCallback(async (platform: PlatformKey) => {
    const url = platform === 'spotify' ? spotifyUrl : youtubeUrl;
    
    if (!url.trim()) {
      showToast('error', `Please enter a ${platform} playlist URL`);
      return;
    }
    
    try {
      const playlistId = extractPlaylistId(url, platform);
      console.log('Extracted playlist ID:', playlistId, 'from URL:', url);
      
      if (!playlistId) {
        showToast('error', `Invalid ${platform} playlist URL format`);
        return;
      }

      // Validate playlist ID format
      if (platform === 'spotify' && playlistId.length !== 22) {
        showToast('warning', 'The playlist ID format looks unusual, but trying anyway...');
      }
      
      showToast('info', 'Fetching playlist details...');
      setIsProcessing(true);
      
      // Select the playlist for conversion based on platform
      if (platform === 'spotify') {
        try {
          await selectPlaylist(playlistId);
          console.log('Playlist import successful for ID:', playlistId);
          setIsProcessing(false); // Explicitly set processing to false
        } catch (err: unknown) {
          console.error('Error importing playlist:', err);
          showToast('error', `Failed to import playlist: ${err instanceof Error ? err.message : String(err)}`);
          setIsProcessing(false);
        }
      } else if (platform === 'youtube') {
        selectYouTubePlaylist(playlistId);
      }
    } catch (error) {
      console.error(`Error parsing ${platform} URL:`, error);
      showToast('error', `Failed to process ${platform} URL`);
      setIsProcessing(false);
    }
  }, [spotifyUrl, youtubeUrl, showToast, selectPlaylist, selectYouTubePlaylist]);
  
  // Auth helpers
  const connectToSpotify = useCallback(() => {
    try {
      // First, explicitly check if user is authenticated
      if (!isAuthenticated) {
        console.warn('User not authenticated when trying to connect to Spotify');
        showToast('error', 'Please sign in to your account first before connecting to Spotify');
        
        // Save that user wants to connect to Spotify and redirect to login
        sessionStorage.setItem('connect_after_login', 'spotify');
        navigate('/login');
        return;
      }
      
      // Add a small delay to ensure auth state is properly propagated
      setTimeout(() => {
        console.log('Initiating Spotify auth with user state:', { isAuthenticated, user });
        initSpotifyAuth();
      }, 500);
    } catch (error) {
      console.error('Error initiating Spotify auth:', error);
      showToast('error', 'Failed to connect to Spotify');
    }
  }, [showToast, isAuthenticated, user, navigate]);
  
  const connectToYouTube = useCallback(() => {
    try {
    window.location.href = getYouTubeAuthUrl();
    } catch (error) {
      console.error('Error initiating YouTube auth:', error);
      showToast('error', 'Failed to connect to YouTube');
    }
  }, [showToast]);
  
  // Determine current conversion step
  const getCurrentStep = useCallback(() => {
    switch (conversionState.status) {
      case ConversionStatus.LOADING_PLAYLISTS:
      case ConversionStatus.SELECTING_PLAYLIST:
      case ConversionStatus.IDLE:
        return 1;
      case ConversionStatus.LOADING_TRACKS:
        return 2;
      case ConversionStatus.MATCHING_TRACKS:
        return 3;
      case ConversionStatus.CREATING_PLAYLIST:
        return 4;
      case ConversionStatus.SUCCESS:
        return 4;
      default:
        return 1;
    }
  }, [conversionState.status]);
  
  // Start conversion with proper error handling
  const handleStartConversion = useCallback(async () => {
    // Make sure we have a playlist selected
    if (!conversionState.selectedPlaylistId) {
      showToast('error', 'Please select a playlist first');
      return;
    }
    
    // Make sure we have the necessary auth for both platforms
    if (sourcePlatform === 'spotify' && !hasSpotifyAuth) {
      showToast('error', 'Please connect to Spotify first');
      return;
    }
    
    if (destinationPlatform === 'youtube' && !hasYouTubeAuth) {
      showToast('error', 'Please connect to YouTube first');
      return;
    }
    
    try {
      setIsProcessing(true);
      showToast('info', 'Starting conversion process...');
      
      // Pass the playlist name and description for the new playlist
      await startConversion();
    } catch (error) {
      console.error('Error starting conversion:', error);
      setIsProcessing(false);
      
      if (error instanceof Error) {
        showToast('error', `Conversion failed: ${error.message}`);
      } else {
        showToast('error', 'Conversion failed. Please try again.');
      }
    }
  }, [
    conversionState.selectedPlaylistId,
    sourcePlatform,
    destinationPlatform,
    hasSpotifyAuth,
    hasYouTubeAuth,
    showToast,
    startConversion
  ]);
  
  // Fetch playlists based on auth status
  useEffect(() => {
    if (isAuthenticated && hasSpotifyAuth) {
      fetchSpotifyPlaylists();
    }
  }, [isAuthenticated, hasSpotifyAuth, fetchSpotifyPlaylists]);

  useEffect(() => {
    if (isAuthenticated && hasYouTubeAuth && typeof fetchYouTubePlaylists === 'function') {
      fetchYouTubePlaylists();
    }
  }, [isAuthenticated, hasYouTubeAuth, fetchYouTubePlaylists]);

  // Add new effect to auto-connect after login
  useEffect(() => {
    // Check if we need to auto-connect after login
    if (isAuthenticated && !isProcessing) {
      const connectAfterLogin = sessionStorage.getItem('connect_after_login');
      
      if (connectAfterLogin) {
        console.log('Auto-connecting to', connectAfterLogin, 'after login');
        
        // Clear the stored value to prevent repeated attempts
        sessionStorage.removeItem('connect_after_login');
        
        // Short delay to ensure auth state has propagated
        setTimeout(() => {
          if (connectAfterLogin === 'spotify') {
            connectToSpotify();
          } else if (connectAfterLogin === 'youtube') {
            connectToYouTube();
          }
        }, 1000);
      }
    }
  }, [isAuthenticated, isProcessing, connectToSpotify, connectToYouTube]);

  // Get current auth status based on source and destination platforms
  const getAuthStatus = useCallback(() => {
    const sourceAuth = sourcePlatform === 'spotify' ? hasSpotifyAuth : hasYouTubeAuth;
    const destinationAuth = destinationPlatform === 'spotify' ? hasSpotifyAuth : hasYouTubeAuth;
    
    return { sourceAuth, destinationAuth };
  }, [sourcePlatform, destinationPlatform, hasSpotifyAuth, hasYouTubeAuth]);
  
  // Determine which connection handlers to use based on platforms
  const getConnectionHandlers = useCallback(() => {
    return {
      connectToSource: sourcePlatform === 'spotify' ? connectToSpotify : connectToYouTube,
      connectToDestination: destinationPlatform === 'spotify' ? connectToSpotify : connectToYouTube
    };
  }, [sourcePlatform, destinationPlatform, connectToSpotify, connectToYouTube]);
  
  // Get auth status for current platforms
  const { sourceAuth, destinationAuth } = getAuthStatus();
  
  // Get appropriate connection handlers
  const { connectToSource, connectToDestination } = getConnectionHandlers();

  // Get selected playlist
  const selectedPlaylist = useMemo(() => {
    if (sourcePlatform === 'spotify') {
      return conversionState.spotifyPlaylists?.find(p => p.id === conversionState.selectedPlaylistId);
    }
    
    return (conversionState.youtubePlaylists || [])
      .find((p: YouTubePlaylist) => p.id === conversionState.selectedPlaylistId);
  }, [conversionState.spotifyPlaylists, conversionState.youtubePlaylists, conversionState.selectedPlaylistId, sourcePlatform]);

  // Define step data for the wizard
  const wizardSteps = useMemo(() => [
    {
      number: 1,
      label: 'Select Source',
      help: 'Choose the platform you want to import your playlist from (Spotify or YouTube).',
      icon: <Settings size={24} />
    },
    {
      number: 2,
      label: 'Import Playlist',
      help: 'Paste your playlist URL or select from your library to import tracks.',
      icon: <Upload size={24} />
    },
    {
      number: 3,
      label: 'Review Tracks',
      help: 'Review the imported tracks and make sure everything looks correct.',
      icon: <FileSpreadsheet size={24} />
    },
    {
      number: 4,
      label: 'Export Playlist',
      help: 'Export your playlist to the destination platform with one click.',
      icon: <Download size={24} />
    },
  ], []);

  // Feature description data
  const features = useMemo(() => [
    {
      title: "Modern UI",
      description: "Sleek, responsive design that works on all devices",
      icon: <Settings size={24} />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Type-Safe",
      description: "Built with TypeScript and React for maximum reliability",
      icon: <Shield size={24} />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Privacy First", 
      description: "We don't store your playlists or personal data",
      icon: <Lock size={24} />,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Fast Conversion",
      description: "Convert your playlists in seconds with our optimized algorithms",
      icon: <Zap size={24} />,
      color: "bg-red-100 text-red-600"
    }
  ], []);

  // How it works steps
  const howItWorks = useMemo(() => [
    {
      title: "1. Paste Playlist URL",
      description: "Copy the link to your playlist and paste it into our converter",
      icon: <ClipboardPaste size={24} />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "2. Fetch & Verify",
      description: "We'll retrieve all songs from your playlist and display them for verification",
      icon: <Search size={24} />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "3. Create New Playlist",
      description: "Create a new playlist with matching songs with just one click",
      icon: <PlayCircle size={24} />,
      color: "bg-red-100 text-red-600"
    }
  ], []);

  // Function to reset the converter (for "Convert Another" button)
  const resetConverter = useCallback(() => {
    // Reset form values
    setSpotifyUrl('');
    setYoutubeUrl('');
    setPlaylistNameForExport('');
    setPlaylistDescriptionForExport('');
    
    // Reset state
    setCurrentWizardStep(1);
    setIsProcessing(false);
    
    // Reset conversion context
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  // Find the useEffect that handles tracking conversion state changes
  // Around line 625, add/modify:
  useEffect(() => {
    // When tracks are loaded, update UI immediately
    if (conversionState.tracks.length > 0 && isProcessing) {
      setIsProcessing(false);
      
      // Short timeout to allow rendering to complete before advancing
      setTimeout(() => {
        setCurrentWizardStep(3);
        document.getElementById('playlist-wizard-card')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100); // Reduced from 500ms to 100ms for faster UI update
    }
  }, [conversionState.tracks]);

  // Function to handle logout or connect missing services
  const handleLogoutOrConnectMissing = useCallback(() => {
    if (hasSpotifyAuth && hasYouTubeAuth) {
      signOut();
    } else if (!hasSpotifyAuth && !hasYouTubeAuth) {
      connectToSpotify();
    } else if (!hasSpotifyAuth) {
      connectToSpotify();
    } else {
      connectToYouTube();
    }
  }, [hasSpotifyAuth, hasYouTubeAuth, signOut, connectToSpotify, connectToYouTube]);
  
  // Return the playlist converter UI
  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 relative overflow-hidden",
      "bg-background-primary text-content-primary" // Main background and default text color
    )}>
      {/* Background effects - using ParticleField */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticleField 
          color="var(--particle-color, #A855F7)" 
          density={isMobile ? "low" : "medium"}
          className="absolute inset-0"
        />
      </div>
      
      <EnhancedHeroSection /> {/* Assuming this will be styled separately or inherits */}
      
      <section 
        id="auth" 
        className={cn(
          "py-12 px-4 bg-transparent relative overflow-hidden"
        )}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <motion.div 
              className="absolute -top-20 -right-20 w-[40vw] h-[40vw] rounded-full opacity-10 bg-brand-blob-1 filter blur-[80px]"
              animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.1, 1]}}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-20 -left-20 w-[45vw] h-[45vw] rounded-full opacity-10 bg-brand-blob-2 filter blur-[100px]"
              animate={{ opacity: [0.1, 0.05, 0.1], scale: [1, 1.15, 1]}}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            />
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold mb-6 text-content-primary" // Keep structural and font-size classes
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <AnimatedGradientText variant="default">
                Connect Your Music Accounts
              </AnimatedGradientText>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-content-secondary mb-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Sign in to both platforms to easily convert playlists between services
            </motion.p>
            
            <motion.p
              className="text-md mb-12 max-w-2xl mx-auto text-content-tertiary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Your account credentials are securely handled and we only request read-only access to your playlists
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <EnhancedConnectionCard
              platform="spotify"
              connected={hasSpotifyAuth}
              onConnect={connectToSpotify}
              onDisconnect={disconnectFromSpotify}
              isConnecting={isConnectingSpotify}
              connectionError={spotifyError || undefined}
              userEmail={user?.email || undefined}
              userName={user?.displayName || undefined}
              userPhoto={user?.photoURL || undefined}
              userMeta={user?.metadata}
              // isDarkMode={isDark} // Removed as component uses useTheme internally
            />
            <EnhancedConnectionCard
              platform="youtube"
              connected={hasYouTubeAuth}
              onConnect={connectToYouTube}
              onDisconnect={disconnectFromYouTube}
              isConnecting={isConnectingYouTube}
              connectionError={youtubeError || undefined}
              userEmail={user?.email || undefined}
              userName={user?.displayName || undefined}
              userPhoto={user?.photoURL || undefined}
              userMeta={user?.metadata}
              // isDarkMode={isDark} // Removed as component uses useTheme internally
            />
          </div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-content-tertiary mb-4">
              Once connected, you can convert playlists in just a few clicks
            </p>
            <GlowButton
              variant="primary"
              onClick={handleLogoutOrConnectMissing}
              disabled={isConnectingSpotify || isConnectingYouTube}
              isLoading={isConnectingSpotify || isConnectingYouTube}
              aria-label={
                hasSpotifyAuth && hasYouTubeAuth 
                  ? 'Logout' 
                  : 'Connect Missing Accounts'
              }
            >
              {isConnectingSpotify || isConnectingYouTube ? (
                <>
                  <span>Connecting...</span>
                </>
              ) : hasSpotifyAuth && hasYouTubeAuth ? (
                <>
                  <LogOut size={16} className="inline-block mr-2" />
                  Logout
                </>
              ) : (
                'Connect Missing Accounts'
              )}
            </GlowButton>
            
            {(!hasSpotifyAuth || !hasYouTubeAuth) && !isConnectingSpotify && !isConnectingYouTube && (
              <p className={cn(
                "mt-3 text-sm flex items-center justify-center",
                "text-warning-text" // Use text-warning-text from CSS vars
                // Consider adding bg-warning-bg and border-warning-border if a banner style is desired
              )}>
                <AlertTriangle size={16} className="inline-block mr-1 text-warning-icon" /> {/* Use text-warning-icon */ }
                {!hasSpotifyAuth && !hasYouTubeAuth
                  ? "You need to connect both accounts to convert playlists" 
                  : !hasSpotifyAuth 
                    ? "Connect your Spotify account to continue" 
                    : "Connect your YouTube account to continue"}
              </p>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Converter Section with Progress Visualization */}
      {isAuthenticated && (
        <section 
          id="converter" 
          className={cn(
            "py-16 px-4 scroll-mt-20",
            "bg-background-secondary" // Section background
          )}
          aria-labelledby="converter-title"
        >
          <div className="max-w-6xl mx-auto">
            <h2 id="converter-title" className="sr-only">Playlist Converter</h2>
            
            <div className={cn(
              "sticky top-16 z-20 py-4 mb-12 rounded-lg backdrop-blur-md shadow-xl", // Increased mb, top-16 for navbar
              "bg-surface-card/80 border border-border-default" // Updated background and border
            )}
            role="navigation"
            aria-label="Conversion Steps">
              <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 px-2">
                {wizardSteps.map((step, idx) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <button
                      className={cn(
                        "rounded-full w-10 h-10 flex items-center justify-center font-bold transition-all duration-300 ease-in-out border-2",
                        idx + 1 === currentWizardStep // Active step
                          ? "bg-stepper-active-icon-bg text-stepper-active-icon border-stepper-active-ring ring-4 ring-stepper-active-ring/50 ring-offset-2 ring-offset-surface-card scale-110"
                          : getCurrentStep() > idx + 1 // Completed step
                            ? "bg-stepper-completed-bg text-stepper-completed-icon border-transparent"
                            : "bg-stepper-inactive-bg border-border-default text-stepper-inactive-icon hover:border-stepper-active-ring/50", // Inactive step
                        "focus:outline-none focus:ring-2 focus:ring-stepper-active-ring"
                      )}
                      onClick={() => setCurrentWizardStep(idx + 1)}
                      disabled={(idx + 1 > getCurrentStep() && idx + 1 !== currentWizardStep) || isProcessing}
                      aria-label={`Go to step ${idx + 1}: ${step.label}`}
                      aria-current={idx + 1 === currentWizardStep ? "step" : undefined}
                    >
                      {idx + 1 < getCurrentStep() && !(idx + 1 === currentWizardStep) ? <CheckCircle size={20} /> : step.icon}
                    </button>
                    <span className={cn(
                      "font-medium text-sm hidden md:flex items-center", // md:flex
                      idx + 1 === currentWizardStep 
                        ? "text-brand-primary" 
                        : "text-content-secondary"
                    )}>
                      {step.label}
                      <div className="relative ml-1.5 cursor-help group">
                        <Info size={14} className={cn(
                          "text-content-tertiary group-hover:text-brand-primary transition-colors",
                          idx + 1 === currentWizardStep ? "text-brand-primary" : ""
                        )} />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-md bg-tooltip text-tooltip-text text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
                          {step.help}
                        </div>
                      </div>
                    </span>
                    {idx < wizardSteps.length - 1 && (
                      <ChevronRight size={20} className="mx-1 text-content-tertiary hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div id="playlist-wizard-card">
              <Enhanced3DCard // Changed from GlassmorphicCard
                className="p-6 sm:p-8 max-w-2xl mx-auto mb-8 rounded-2xl bg-surface-card border border-border-default shadow-xl"
                glassEffect={true} // Enable glass effect
                depth={15} // Set a moderate depth
                hoverScale={1.01} // Subtle hover scale
              >
                {conversionState.error && (
                  <div 
                    className={cn(
                      "mb-6 p-4 rounded-lg flex items-start gap-3",
                      "bg-error-bg text-error-text border border-error-border"
                    )}
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-md">Conversion Error</p>
                      <p className="text-sm">{conversionState.error}</p>
              </div>
                  </div>
                )}
                
                <AnimatePresence mode="wait">
                  {currentWizardStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <h3 className="text-xl font-bold mb-1 text-content-primary">{wizardSteps[0].label}</h3>
                        <p className="text-sm text-content-secondary mb-6">{wizardSteps[0].help}</p>
                        
                        <div className="grid sm:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-content-secondary mb-2">
                              Source Platform
                            </label>
                            <div className="flex flex-col space-y-2">
                              <GlowButton
                                variant={sourcePlatform === 'spotify' ? "soundswapp" : "secondary"} // Use soundswapp variant when active
                                onClick={() => setSourcePlatform('spotify')}
                                disabled={false}
                                className={cn(
                                  "flex flex-1 justify-center items-center gap-2 py-3",
                                  sourcePlatform === 'spotify' ? "shadow-glow" : ""
                                )}
                                aria-label="Select Spotify as source platform"
                              >
                                <FaSpotify className="h-5 w-5" />
                                <span>Spotify</span>
                              </GlowButton>
                              <GlowButton
                                variant={sourcePlatform === 'youtube' ? "soundswapp" : "secondary"} // Use soundswapp variant when active
                                onClick={() => setSourcePlatform('youtube')}
                                disabled={false}
                                className={cn(
                                  "flex flex-1 justify-center items-center gap-2 py-3",
                                  sourcePlatform === 'youtube' ? "shadow-glow" : ""
                                )}
                                aria-label="Select YouTube as source platform"
                              >
                                <Youtube className="h-5 w-5" />
                                <span>YouTube</span>
                              </GlowButton>
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                              Destination Platform
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <GlowButton // Changed from button to GlowButton
                                onClick={() => setDestinationPlatform('spotify')}
                                disabled={!hasSpotifyAuth || sourcePlatform === 'spotify'}
                                variant={destinationPlatform === 'spotify' ? "soundswapp" : "secondary"}
                                size="sm" // Smaller size for these toggle-like buttons
                                className={cn(
                                  (!hasSpotifyAuth || sourcePlatform === 'spotify') && "opacity-50 cursor-not-allowed"
                                )}
                                aria-label="Select Spotify as destination platform"
                                aria-pressed={destinationPlatform === 'spotify'}
                              >
                                <FaSpotify className="w-5 h-5" />
                                <span>Spotify</span>
                              </GlowButton>
                              <GlowButton // Changed from button to GlowButton
                                onClick={() => setDestinationPlatform('youtube')}
                                disabled={!hasYouTubeAuth || sourcePlatform === 'youtube'}
                                variant={destinationPlatform === 'youtube' ? "soundswapp" : "secondary"}
                                size="sm" // Smaller size for these toggle-like buttons
                                className={cn(
                                  (!hasYouTubeAuth || sourcePlatform === 'youtube') && "opacity-50 cursor-not-allowed"
                                )}
                                aria-label="Select YouTube as destination platform"
                                aria-pressed={destinationPlatform === 'youtube'}
                              >
                                <Youtube className="w-5 h-5" />
                                <span>YouTube</span>
                              </GlowButton>
                            </div>
              </div>
            </div>
            
                        {/* Authentication check and notices */}
                        {!sourceAuth && (
                  <div className={cn(
                            "my-3 p-3 rounded-md flex items-center gap-2 text-sm",
                            "bg-warning-bg text-warning-text border border-warning-border" // Use CSS Vars for warning
                          )}>
                            <AlertTriangle size={16} className="flex-shrink-0 text-warning-icon" aria-hidden="true" /> {/* Use text-warning-icon */}
                            <p>Please connect to {platforms.find(p => p.key === sourcePlatform)?.label} first.</p>
                            <ConnectButton 
                              platform={sourcePlatform} 
                              isConnected={sourceAuth} 
                              onConnect={connectToSource}
                              className="ml-auto text-xs py-1"
                            />
                  </div>
                        )}
                        
                        {!destinationAuth && (
                          <div className={cn(
                            "my-3 p-3 rounded-md flex items-center gap-2 text-sm",
                            "bg-warning-bg text-warning-text border border-warning-border" // Use CSS Vars for warning
                          )}>
                            <AlertTriangle size={16} className="flex-shrink-0 text-warning-icon" aria-hidden="true" /> {/* Use text-warning-icon */}
                            <p>Please connect to {platforms.find(p => p.key === destinationPlatform)?.label} first.</p>
                            <ConnectButton 
                              platform={destinationPlatform} 
                              isConnected={destinationAuth} 
                              onConnect={connectToDestination}
                              className="ml-auto text-xs py-1"
                            />
                </div>
                        )}
                        
                        <GlowButton
                          variant="primary"
                          onClick={() => setCurrentWizardStep(2)}
                          disabled={sourcePlatform === destinationPlatform || !sourceAuth || !destinationAuth}
                          className="mt-6"
                          aria-label={`Continue to Import Playlist ${!sourceAuth || !destinationAuth ? '(connect to both platforms first)' : ''}`}
                        >
                          <span>Next</span>
                          <ChevronRight size={16} aria-hidden="true" className="ml-1" />
                        </GlowButton>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 2: Import Playlist */}
                  {currentWizardStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-red-500"><Upload size={24} /></span>
                          Import Playlist
                          <span className="sr-only">{wizardSteps[1].help}</span>
                        </h3>
                        
                        {/* Platform-specific import UI */}
                        <div className="mt-2 flex flex-col gap-3 w-full">
                  {sourcePlatform === 'spotify' && (
                    <>
                              <div className="relative">
                                {/* <label htmlFor="spotify-url" className="text-sm font-medium mb-1 block"> -- Label handled by FloatingLabels
                                  Paste Spotify playlist URL or ID
                                </label> */} 
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-grow">
                                    {/* Icon can be outside or styled with FloatingLabels if supported, for now outside */}
                                    {/* <FaSpotify 
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" 
                                      aria-hidden="true" 
                                    /> */} 
                                    <FloatingLabels
                                      id="spotify-url"
                                      type="text"
                                      label="Spotify Playlist URL or ID"
                                      placeholder="https://open.spotify.com/playlist/..."
                                      value={spotifyUrl}
                                      onChange={e => setSpotifyUrl(e.target.value)}
                                      disabled={isProcessing}
                                      variant="outlined"
                                      containerClassName="flex-grow" // Ensure it takes space
                                      inputClassName={cn( // Pass original conditional styling
                                        isProcessing ? "opacity-50 cursor-not-allowed" : "",
                                        "pl-3" // Keep some padding if icon is removed from inside
                                      )}
                                      // aria-label is handled by label prop
                                    />
                                  </div>
                      <GlowButton
                        variant="soundswapp" // Use soundswapp variant instead of primary
                        onClick={() => handlePlaylistUrlSubmit('spotify')}
                        disabled={!spotifyUrl || isProcessing}
                        isLoading={isProcessing}
                        className="flex-shrink-0"
                        aria-label="Import Spotify playlist"
                      >
                        {isProcessing ? 'Importing...' : 'Import'}
                      </GlowButton>
                                </div>
                              </div>
                              
                              {/* Your Playlists button with dropdown */}
                              <div className="w-full my-2">
                                <button
                                  className={cn(
                                    "w-full px-4 py-2 rounded-md border flex items-center justify-between",
                                    isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-300 text-gray-700",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    "focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  )}
                                  onClick={() => setShowPlaylistSuggestions(!showPlaylistSuggestions)}
                                  aria-expanded={showPlaylistSuggestions}
                                  aria-controls="playlist-dropdown"
                                  aria-label="Show your Spotify playlists"
                                >
                                  <span className="flex items-center">
                                    <FaSpotify className="mr-2 text-green-500" aria-hidden="true" />
                                    <span>Your Spotify Playlists</span>
                                  </span>
                                  <ChevronRight 
                                    size={16} 
                                    className={cn(
                                      "transition-transform",
                                      showPlaylistSuggestions ? "rotate-90" : ""
                                    )}
                                    aria-hidden="true"
                                  />
                                </button>
                                
                                {/* Playlist suggestions dropdown */}
                                <AnimatePresence>
                                  {showPlaylistSuggestions && sourceAuth && conversionState.spotifyPlaylists && conversionState.spotifyPlaylists.length > 0 && (
                                    <motion.div
                                      id="playlist-dropdown"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className={cn(
                                        "mt-1 border rounded-lg shadow overflow-hidden",
                                        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                      )}
                                    >
                                      <div className="max-h-56 overflow-y-auto p-1">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 font-semibold">
                                          Select a playlist to import:
                                        </div>
                                        <ul>
                                          {conversionState.spotifyPlaylists.slice(0, 8).map((playlist) => (
                                            <li key={playlist.id}>
                                              <KeyboardFocusableCard
                                                className={cn(
                                                  "flex items-center gap-3 p-2 rounded cursor-pointer transition",
                                                  isDark ? "hover:bg-green-900/30" : "hover:bg-green-100"
                                                )}
                                                onClick={() => {
                                                  if (isProcessing) return;
                                                  setSpotifyUrl(`https://open.spotify.com/playlist/${playlist.id}`);
                                                  setShowPlaylistSuggestions(false);
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    if (isProcessing) return;
                                                    setSpotifyUrl(`https://open.spotify.com/playlist/${playlist.id}`);
                                                    setShowPlaylistSuggestions(false);
                                                  }
                                                }}
                                                aria-label={`Select playlist: ${playlist.name} by ${playlist.owner} with ${playlist.trackCount || 'unknown'} tracks`}
                                              >
                                                {playlist.imageUrl ? (
                                                  <img 
                                                    src={playlist.imageUrl} 
                                                    alt="" 
                                                    className="w-10 h-10 rounded object-cover flex-shrink-0" 
                                                    aria-hidden="true"
                                                  />
                                                ) : (
                                                  <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <Music size={16} className="text-green-600" aria-hidden="true" />
                                                  </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                  <div className="truncate font-medium text-sm">{playlist.name}</div>
                                                  <div className="truncate text-xs text-gray-400">
                                                    {playlist.owner} • {playlist.trackCount || 'Unknown'} tracks
                                                  </div>
                                                </div>
                                              </KeyboardFocusableCard>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </motion.div>
                                  )}

                                  {/* Show message when no playlists are available */}
                                  {showPlaylistSuggestions && sourceAuth && (!conversionState.spotifyPlaylists || conversionState.spotifyPlaylists.length === 0) && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className={cn(
                                        "mt-1 border rounded-lg shadow p-4 text-center",
                                        isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600"
                                      )}
                                    >
                                      <p>No Spotify playlists found in your account.</p>
                                    </motion.div>
                                  )}

                                  {/* Show message when not authenticated with Spotify */}
                                  {showPlaylistSuggestions && !sourceAuth && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className={cn(
                                        "mt-1 border rounded-lg shadow p-4",
                                        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                      )}
                                    >
                                      <div className="flex flex-col items-center gap-2">
                                        <p className="text-center text-sm text-gray-500 mb-2">
                                          You need to connect to Spotify first
                                        </p>
                                        <ConnectButton
                                          platform="spotify"
                                          isConnected={sourceAuth}
                                          onConnect={connectToSource}
                                          className="text-sm w-full"
                                        />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                    </>
                  )}
                          
                          {/* Add YouTube input for YouTube as source */}
                  {sourcePlatform === 'youtube' && (
                    <>
                              <div className="relative">
                                {/* <label htmlFor="youtube-url" className="text-sm font-medium mb-1 block">
                                  Paste YouTube playlist URL or ID
                                </label> */} 
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-grow">
                                    {/* <Youtube 
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" 
                                      aria-hidden="true" 
                                    /> */} 
                                    <FloatingLabels
                                      id="youtube-url"
                                      type="text"
                                      label="YouTube Playlist URL or ID"
                                      placeholder="https://youtube.com/playlist?list=..."
                                      value={youtubeUrl}
                                      onChange={e => setYoutubeUrl(e.target.value)}
                                      disabled={isProcessing}
                                      variant="outlined"
                                      containerClassName="flex-grow"
                                      inputClassName={cn(
                                        isProcessing ? "opacity-50 cursor-not-allowed" : "",
                                        "pl-3"
                                      )}
                                    />
                                  </div>
                      <GlowButton
                        variant="secondary"
                        onClick={() => handlePlaylistUrlSubmit('youtube')}
                        disabled={!youtubeUrl || isProcessing}
                        isLoading={isProcessing}
                        className="flex-shrink-0"
                        aria-label="Import YouTube playlist"
                      >
                        {isProcessing ? 'Importing...' : 'Import'}
                      </GlowButton>
                </div>
                              </div>

                              {/* Your YouTube Playlists button with dropdown */}
                              <div className="w-full my-2">
                                <button
                                  className={cn(
                                    "w-full px-4 py-2 rounded-md border flex items-center justify-between",
                                    isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-300 text-gray-700",
                                    "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                    "focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  )}
                                  onClick={() => setShowYoutubePlaylistSuggestions(!showYoutubePlaylistSuggestions)}
                                  aria-expanded={showYoutubePlaylistSuggestions}
                                  aria-controls="youtube-playlist-dropdown"
                                  aria-label="Show your YouTube playlists"
                                >
                                  <span className="flex items-center">
                                    <Youtube className="mr-2 text-red-500" aria-hidden="true" />
                                    <span>Your YouTube Playlists</span>
                                  </span>
                                  <ChevronRight 
                                    size={16} 
                                    className={cn(
                                      "transition-transform",
                                      showYoutubePlaylistSuggestions ? "rotate-90" : ""
                                    )}
                                    aria-hidden="true"
                                  />
                                </button>
                                
                                {/* YouTube Playlist suggestions dropdown */}
                                <AnimatePresence>
                                  {showYoutubePlaylistSuggestions && hasYouTubeAuth && conversionState.youtubePlaylists && conversionState.youtubePlaylists.length > 0 && (
                                    <motion.div
                                      id="youtube-playlist-dropdown"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className={cn(
                                        "mt-1 border rounded-lg shadow overflow-hidden",
                                        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                      )}
                                    >
                                      <div className="max-h-56 overflow-y-auto p-1">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 font-semibold">
                                          Select a playlist to import:
                                        </div>
                                        <ul>
                                          {conversionState.youtubePlaylists.slice(0, 8).map((playlist: YouTubePlaylist) => (
                                            <li key={playlist.id}>
                                              <KeyboardFocusableCard
                                                className={cn(
                                                  "flex items-center gap-3 p-2 rounded cursor-pointer transition",
                                                  isDark ? "hover:bg-red-900/30" : "hover:bg-red-100"
                                                )}
                              onClick={() => {
                                                  if (isProcessing) return;
                                                  setYoutubeUrl(`https://www.youtube.com/playlist?list=${playlist.id}`);
                                                  setShowYoutubePlaylistSuggestions(false);
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    if (isProcessing) return;
                                                    setYoutubeUrl(`https://www.youtube.com/playlist?list=${playlist.id}`);
                                                    setShowYoutubePlaylistSuggestions(false);
                                                  }
                                                }}
                                                aria-label={`Select playlist: ${playlist.snippet?.title || 'Untitled playlist'} with ${playlist.contentDetails?.itemCount || 'unknown'} tracks`}
                                              >
                                                {playlist.snippet?.thumbnails?.default?.url ? (
                                                  <img 
                                                    src={playlist.snippet.thumbnails.default.url} 
                                                    alt="" 
                                                    className="w-10 h-10 rounded object-cover flex-shrink-0" 
                                                    aria-hidden="true"
                                                  />
                                                ) : (
                                                  <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                                                    <Music size={16} className="text-red-600" aria-hidden="true" />
                                                  </div>
                              )}
                              <div className="flex-1 min-w-0">
                                                  <div className="truncate font-medium text-sm">{playlist.snippet?.title || 'Untitled playlist'}</div>
                                                  <div className="truncate text-xs text-gray-400">
                                                    {playlist.snippet?.channelTitle ? `${playlist.snippet.channelTitle} • ` : ''}{playlist.contentDetails?.itemCount || 'Unknown'} tracks
                              </div>
                                                </div>
                                              </KeyboardFocusableCard>
                            </li>
                          ))}
                        </ul>
                                      </div>
                                    </motion.div>
                                  )}

                                  {/* Show message when no playlists are available */}
                                  {showYoutubePlaylistSuggestions && hasYouTubeAuth && (!conversionState.youtubePlaylists || conversionState.youtubePlaylists.length === 0) && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className={cn(
                                        "mt-1 border rounded-lg shadow p-4 text-center",
                                        isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600"
                                      )}
                                    >
                                      <p>No YouTube playlists found in your account.</p>
                                    </motion.div>
                                  )}

                                  {/* Show message when not authenticated with YouTube */}
                                  {showYoutubePlaylistSuggestions && !hasYouTubeAuth && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className={cn(
                                        "mt-1 border rounded-lg shadow p-4",
                                        "bg-surface-dropdown border-border-default" // Style update
                                      )}
                                    >
                                      <div className="flex flex-col items-center gap-2">
                                        <p className="text-center text-sm text-content-secondary mb-2">
                                          You need to connect to YouTube first
                                        </p>
                                        <ConnectButton
                                          platform="youtube"
                                          isConnected={hasYouTubeAuth} // This should be false here
                                          onConnect={connectToYouTube} // Correct function call
                                          className="text-sm w-full"
                                        />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                  </div>
                            </>
                          )}
                        </div>
                        
                        {/* Show loading or error */}
                        {isProcessing && (
                          <div 
                            className="mt-4 text-center flex items-center justify-center gap-2 text-purple-500"
                            aria-live="polite"
                          >
                            <Loader className="animate-spin" size={16} aria-hidden="true" />
                            <span>Loading tracks...</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between mt-6">
                          <button
                            className={cn(
                              "px-4 py-2 rounded flex items-center gap-2 text-sm",
                              isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
                            )}
                            onClick={() => setCurrentWizardStep(1)}
                            aria-label="Go back to Select Source"
                          >
                            <ChevronLeft size={16} aria-hidden="true" />
                            <span>Back</span>
                          </button>
                          
                          <GlowButton
                            variant="primary"
                            onClick={() => setCurrentWizardStep(3)}
                            disabled={!conversionState.tracks.length}
                            isLoading={isProcessing && !conversionState.tracks.length}
                            aria-label={`Continue to Review Tracks ${!conversionState.tracks.length ? '(No Tracks Yet)' : ''}`}
                          >
                            <span>Next</span>
                            <ChevronRight size={16} aria-hidden="true" className="ml-1" />
                          </GlowButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 3: Review Tracks */}
                  {currentWizardStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-red-500"><FileSpreadsheet size={24} /></span>
                          Review Tracks
                          <span className="sr-only">{wizardSteps[2].help}</span>
                        </h3>
                        
                        {/* Track summary */}
                        <div className={cn(
                          "mb-4 p-4 rounded-lg",
                          "bg-surface-highlight border border-border-default" // Updated styles
                        )}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-content-primary">{selectedPlaylist?.name || 'Imported Playlist'}</h4>
                              <p className="text-sm text-content-secondary">
                                {selectedPlaylist?.trackCount || conversionState.tracks.length} tracks •
                                {selectedPlaylist?.owner && ` By ${selectedPlaylist.owner}`}
                              </p>
                            </div>
                            <div className={cn(
                              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                              // Platform specific badge styles
                              sourcePlatform === 'spotify'
                                ? "bg-[var(--spotify-bg-subtle)] text-[var(--spotify-text-accent)]"
                                : "bg-[var(--youtube-bg-subtle)] text-[var(--youtube-text-accent)]"
                            )}>
                              <Music
                                className={cn(
                                  sourcePlatform === 'spotify' ? 'text-[var(--spotify-icon-color)]' : 'text-[var(--youtube-icon-color)]'
                                )}
                                aria-hidden="true"
                              />
                              <span>{platforms.find(p => p.key === sourcePlatform)?.label} Source</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Track list with improved accessibility */}
                        <div 
                          className="mt-2 rounded-lg border border-border-default overflow-hidden" // Added overflow hidden
                          role="region"
                          aria-label="Track list preview"
                        >
                          <div className={cn(
                            "p-3 font-medium border-b text-sm",
                            "bg-surface-alt text-content-secondary border-border-default" // Header styles
                          )}>
                            Track Preview ({conversionState.tracks.length})
                          </div>
                          <div className={cn(
                            "max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-scrollbar scrollbar-track-surface-alt", // Scrollbar styles
                            "bg-surface-card" // Background for list
                          )}>
                            {isProcessing && conversionState.tracks.length === 0 && ( // Show loader only if no tracks and processing
                              <div className="mt-4 text-center flex items-center justify-center gap-2 text-brand-primary py-4" aria-live="polite">
                                <Loader className="animate-spin" size={16} aria-hidden="true" />
                                <span>Loading tracks...</span>
                              </div>
                            )}
                            {!isProcessing && conversionState.tracks.length > 0 && (
                              <ul role="list">
                                {conversionState.tracks.map((track, idx) => (
                                  <li 
                                    key={`track-${track.id}-${idx}`}
                                    className={cn(
                                      "py-2.5 px-3 border-b flex items-center gap-2 transition-colors", // Adjusted padding
                                      "border-border-default hover:bg-surface-hover" // Hover and border
                                    )}
                                  >
                                    <span className="w-6 text-center text-xs text-content-tertiary">{idx + 1}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate text-content-primary">{track.name}</p>
                                      <p className="text-xs text-content-secondary truncate">{track.artists.join(', ')}</p>
                                    </div>
                                    {track.duration_ms && (
                                      <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                                      </span>
                                    )}
                              </li>
                          ))}
                        </ul>
                      )}
                            {!isProcessing && conversionState.tracks.length === 0 && (
                              <div className="py-8 text-center text-content-tertiary">
                                <Music size={24} className="mx-auto mb-2 opacity-50" aria-hidden="true" />
                                <p>No tracks loaded.</p>
                    </div>
                            )}
                  </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          <button
                            className={cn(
                              "px-4 py-2 rounded flex items-center gap-2 text-sm",
                              isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
                            )}
                            onClick={() => setCurrentWizardStep(2)}
                            aria-label="Go back to Import Playlist"
                          >
                            <ChevronLeft size={16} aria-hidden="true" />
                            <span>Back</span>
                          </button>
                          
                          <GlowButton
                            variant="primary"
                            onClick={() => setCurrentWizardStep(4)}
                            disabled={!conversionState.tracks.length}
                            aria-label={`Continue to Export Playlist ${!conversionState.tracks.length ? '(import tracks first)' : ''}`}
                          >
                            <span>Next</span>
                            <ChevronRight size={16} aria-hidden="true" className="ml-1" />
                          </GlowButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 4: Export Playlist */}
                  {currentWizardStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-red-500"><Download size={24} /></span>
                          Export Playlist
                          <span className="sr-only">{wizardSteps[3].help}</span>
                        </h3>
                        
                        {/* Export summary */}
                  <div className={cn(
                          "p-4 rounded-lg border",
                          isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                        )}>
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-12 h-12 flex-shrink-0 rounded flex items-center justify-center",
                              sourcePlatform === 'spotify' ? "bg-green-100" : "bg-red-100"
                            )}>
                              <Music 
                                className={sourcePlatform === 'spotify' ? 'text-green-600 text-lg' : 'text-red-600 text-lg'} 
                                aria-hidden="true" 
                              />
                  </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h4 className="font-semibold">{selectedPlaylist?.name || 'Unnamed Playlist'}</h4>
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-xs",
                                    isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                                  )}>
                                    {conversionState.tracks.length} tracks
                                  </span>
                                  <Music 
                                    className={sourcePlatform === 'spotify' ? 'text-green-500 text-sm' : 'text-red-500 text-sm'} 
                                    aria-hidden="true" 
                                  />
                </div>
                              </div>
                              <div className="mt-3 flex items-center">
                                <div className="font-medium text-sm flex items-center gap-1">
                                  <span>Converting to:</span>
                                  <Youtube 
                                    className={destinationPlatform === 'spotify' ? 'text-green-500 ml-1' : 'text-red-500 ml-1'} 
                                    aria-hidden="true"
                                  />
                                  <span className="font-bold">{platforms.find(p => p.key === destinationPlatform)?.label}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Add customization options for new playlist */}
                          <div className="mt-4 space-y-3">
                            <div>
                              {/* <label htmlFor="playlist-name" className="block text-sm font-medium mb-1">
                                New Playlist Name
                              </label> */} 
                              <FloatingLabels
                                type="text"
                                id="playlist-name"
                                label="New Playlist Name"
                                value={playlistNameForExport}
                                onChange={(e) => setPlaylistNameForExport(e.target.value)}
                                placeholder={`${selectedPlaylist?.name || 'Playlist'} (Converted)`}
                                variant="outlined"
                                inputClassName={cn(
                                  // Retain original dynamic classes if necessary, e.g., for dark mode
                                  isDark ? "dark:bg-gray-700 dark:border-gray-600 dark:text-white" : "bg-white border-gray-300 text-gray-900",
                                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                                )}
                                disabled={isProcessing}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="playlist-description" className="block text-sm font-medium mb-1">
                                Description
                              </label>
                              <textarea 
                                id="playlist-description"
                                value={playlistDescriptionForExport}
                                onChange={(e) => setPlaylistDescriptionForExport(e.target.value)}
                                placeholder={`Converted from ${sourcePlatform} using Playlist Converter`}
                                rows={2}
                                className={cn(
                                  "w-full px-3 py-2 rounded border focus:ring-2 focus:ring-purple-500 focus:outline-none",
                                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                                )}
                                disabled={isProcessing}
                              />
                            </div>
                          </div>
                            
                          {/* Conversion action button */}
                          <div className="mt-6">
                  <GlowButton
                              onClick={handleStartConversion}
                              disabled={isProcessing || !conversionState.tracks.length || 
                                (sourcePlatform === 'spotify' && !hasSpotifyAuth) || 
                                (destinationPlatform === 'youtube' && !hasYouTubeAuth)}
                    className={cn(
                                "px-6 py-3 rounded-lg font-medium transition-all",
                                !isProcessing && conversionState.tracks.length > 0
                                  ? "bg-primary hover:bg-primary/80 text-primary-foreground" 
                                  : "bg-muted text-muted-foreground cursor-not-allowed",
                                "flex items-center gap-2"
                              )}
                              aria-label="Start playlist conversion"
                            >
                              {isProcessing ? (
                                <>
                                  <Loader className="h-5 w-5 animate-spin" />
                                  <span>Converting...</span>
                                </>
                              ) : (
                                <>
                                  <Zap size={18} />
                                  <span>Convert Playlist</span>
                                </>
                              )}
                  </GlowButton>
                </div>

                          {/* Conversion Progress Bar */}
                          {isProcessing && (
                            <div className="mt-4 pt-4 border-t border-muted">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">
                                  {conversionState.status === ConversionStatus.MATCHING_TRACKS ? 'Matching tracks...' : 
                                   conversionState.status === ConversionStatus.CREATING_PLAYLIST ? 'Creating playlist...' :
                                   'Converting...'}
                                </span>
                                <span>{Math.round(conversionState.matchingProgress)}%</span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-500"
                                  style={{ width: `${conversionState.matchingProgress}%` }}
                                  role="progressbar"
                                  aria-valuenow={conversionState.matchingProgress}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                ></div>
                              </div>
                              
                              {conversionState.error && (
                                <div className="mt-4 bg-youtube/10 text-youtube p-3 rounded-md">
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                                    <p className="text-sm">{conversionState.error}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Success or error message */}
                        {conversionState.status === ConversionStatus.SUCCESS && (
                          <div className={cn(
                            "mt-4 p-3 rounded-lg flex items-center gap-2",
                            isDark ? "bg-green-900/30 text-green-300 border border-green-800/50" : "bg-green-100 text-green-800 border-l-4 border-green-600"
                          )}
                          role="status"
                          aria-live="polite"
                          >
                            <CheckCircle size={18} className="flex-shrink-0" aria-hidden="true" />
                            <div>
                              <p className="font-semibold">Conversion successful!</p>
                              <p className="text-sm mt-1">
                                Your playlist has been successfully converted to {platforms.find(p => p.key === destinationPlatform)?.label}.
                              </p>
                            </div>
                            <a
                              href={(destinationPlatform === 'spotify' ? conversionState.spotifyPlaylistUrl : conversionState.youtubePlaylistUrl) || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "ml-auto px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                                destinationPlatform === 'spotify' 
                                  ? "bg-green-200 text-green-800 hover:bg-green-300" 
                                  : "bg-red-200 text-red-800 hover:bg-red-300",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
                              )}
                              aria-label={`View ${platforms.find(p => p.key === destinationPlatform)?.label} playlist (opens in new tab)`}
                            >
                              <span>View Playlist</span>
                              <ExternalLink size={12} aria-hidden="true" />
                            </a>
                          </div>
                        )}
                        
                        <div className="flex justify-between mt-6">
                          <button
                            className={cn(
                              "px-4 py-2 rounded flex items-center gap-2 text-sm",
                              isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800"
                            )}
                            onClick={() => setCurrentWizardStep(3)}
                            aria-label="Go back to Review Tracks"
                            disabled={isProcessing}
                          >
                            <ChevronLeft size={16} aria-hidden="true" />
                            <span>Back</span>
                          </button>
                          
                          {/* Add a start over button */}
                          {conversionState.status === ConversionStatus.SUCCESS && (
                            <GlowButton
                              variant="primary"
                              onClick={resetConverter}
                              aria-label="Convert another playlist"
                            >
                              <RefreshCw size={16} aria-hidden="true" className="mr-1.5" />
                              <span>Convert Another</span>
                            </GlowButton>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Enhanced3DCard>
            </div>
            


            {/* Recent Conversions Section */}
            <AnimatePresence>
              {conversionState.conversionHistory && conversionState.conversionHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-12" // Remove duplicate className
                >
                  <GlassmorphicCard 
                    className="p-6 sm:p-8 mb-8 rounded-2xl border border-border-default shadow-xl" 
                    gradientOverlay={true} 
                    variant="primary"
                    magneticEffect={true}
                    glowIntensity="medium"
                  >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-content-primary">
                      <svg className="h-6 w-6 text-brand-accentPink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <LightingText baseColor="text-content-primary" highlightColor="text-brand-accentPink" size={100}>
                        Recent Conversions
                      </LightingText>
                    </h3>
                    <div 
                      className={cn(
                        "rounded-lg border overflow-x-auto",
                        "border-border-default"
                      )}
                      role="region"
                      aria-label="Recent conversion history"
                    >
                      <table className="w-full min-w-[600px]" role="table">
                        <thead>
                          <tr className={cn(
                            "text-xs font-semibold text-left",
                            "bg-surface-alt text-content-secondary" // Updated header style
                          )}>
                            <th className="px-4 py-3" scope="col">Playlist</th>
                            <th className="px-4 py-3 hidden md:table-cell" scope="col">Date</th>
                            <th className="px-4 py-3 text-center" scope="col">Tracks</th>
                            <th className="px-4 py-3 text-right" scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody role="rowgroup" className="divide-y divide-border-default bg-surface-card">{/* Ensure no whitespace immediately after this opening tag */}
                          {conversionState.conversionHistory.slice(0, 5).map((conv) => (
                            <tr 
                              key={conv.id}
                              className={cn(
                                "text-sm",
                                "hover:bg-surface-hover" // Updated row hover
                              )}
                              role="row"
                            >
                              <td className="px-4 py-3 font-medium text-content-primary">{conv.spotifyPlaylistName || 'Unnamed Playlist'}</td>
                              <td className="px-4 py-3 text-content-secondary hidden md:table-cell">{new Date(conv.convertedAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={cn(
                                  "inline-flex items-center text-xs rounded-full px-2.5 py-1 font-medium",
                                  "bg-input text-content-secondary" // Updated badge style
                                )}>
                                  {conv.tracksMatched} / {conv.totalTracks}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                        {conv.youtubePlaylistUrl && (
                          <a
                            href={conv.youtubePlaylistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                                      className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-xs font-medium transition-colors",
                                        "bg-[var(--youtube-bg)] hover:bg-[var(--youtube-bg-hover)]", // YouTube button style
                                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--youtube-bg)] ring-offset-surface-card"
                                      )}
                                      aria-label="Open YouTube playlist in new tab"
                                    >
                                      <Youtube size={14} className="text-[var(--youtube-icon-color-button)]"/> {/* Icon color on button */}
                                      <span className="text-[var(--youtube-text-button)]">View</span> {/* Text color on button */}
                                    </a>
                        )}
                        {conv.spotifyPlaylistUrl && (
                          <a
                            href={conv.spotifyPlaylistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                                      className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-xs font-medium transition-colors",
                                        "bg-[var(--spotify-bg)] hover:bg-[var(--spotify-bg-hover)]", // Spotify button style
                                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--spotify-bg)] ring-offset-surface-card"
                                      )}
                                      aria-label="Open Spotify playlist in new tab"
                                    >
                                      <FaSpotify size={14}  className="text-[var(--spotify-icon-color-button)]"/> {/* Icon color on button */}
                                      <span className="text-[var(--spotify-text-button)]">View</span> {/* Text color on button */}
                                    </a>
                        )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>{/* Ensure no whitespace immediately before this closing tag */}
                      </table>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Playlist Insights section (conditionally rendered) */}
            {conversionState.status === ConversionStatus.SUCCESS && conversionState.tracks.length > 0 && (
              <motion.div 
                className="mt-12" // Add margin to the wrapper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassmorphicContainer
                  className="p-4 sm:p-6" // Keep padding
                  shadow="xl" // Keep shadow
                  animate={true} // Enable built-in animation
                  hoverEffect={true} // Enable hover effect
                >
                  <PlaylistInsights 
                    stats={generatePlaylistInsights(conversionState.tracks)}
                  />
                </GlassmorphicContainer>
              </motion.div>
            )}
          </div>
        </section>
      )}
      
      {/* How It Works Section */}
      <section 
        id="how-it-works" 
        className={cn(
          "py-16 lg:py-24 px-4 relative overflow-hidden", 
          "bg-gradient-to-br from-background-primary via-background-secondary to-background-primary" // Soft gradient background
        )}
        aria-labelledby="how-it-works-title"
      >
        {/* Enhanced Background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-10 bg-gradient-to-br from-brand-primary via-brand-accent-pink to-transparent filter blur-3xl"
            animate={{ 
              transform: ["translateX(0px) translateY(0px)", "translateX(20px) translateY(10px)", "translateX(0px) translateY(0px)"],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-10 bg-gradient-to-tl from-brand-secondary via-brand-accent-purple to-transparent filter blur-3xl"
            animate={{ 
              transform: ["translateX(0px) translateY(0px)", "translateX(-20px) translateY(-10px)", "translateX(0px) translateY(0px)"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
           {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          ></div>
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {/* Section label */}
            <div className="mb-4 inline-block">
              <span 
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold tracking-wider uppercase shadow-lg",
                  "bg-gradient-to-r from-brand-primary/80 via-brand-accent-pink/80 to-brand-secondary/80 text-white",
                  "border border-white/20"
                )}
              >
                EASY PROCESS
              </span>
            </div>
            
            <h2 
              id="how-it-works-title" 
              className="text-4xl lg:text-6xl font-extrabold mb-6 text-content-primary drop-shadow-md"
            >
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(120deg, var(--brand-primary) 0%, var(--brand-accent-pink) 50%, var(--brand-secondary) 100%)'
                }}
              >
                How It Works
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-content-secondary mb-12 lg:mb-20 max-w-3xl mx-auto">
              Converting your playlists is simple with our streamlined three-step process. Get your music where you want it, hassle-free.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                className="flex flex-col h-full" // Ensure cards take full height in grid cell
              >
                <SpotlightCard
                  className={cn(
                    "p-6 md:p-8 text-left rounded-2xl shadow-lg transition-all duration-300 h-full flex flex-col group hover:shadow-xl",
                    isDark 
                      ? "bg-[#1A1A2E]/90 hover:bg-[#21213D]/95 border border-[var(--brand-secondary-alpha-20)]" 
                      : "bg-slate-50 hover:bg-white border border-slate-200"
                  )}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <motion.div
                      className={cn(
                        "w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-md",
                        // SoundSwapp gradient backgrounds based on index
                        index === 0 ? "bg-gradient-to-br from-brand-primary to-brand-primary-dark" :
                        index === 1 ? "bg-gradient-to-br from-brand-accent-pink to-brand-accent-pink/80" :
                        "bg-gradient-to-br from-brand-secondary to-brand-secondary-dark"
                      )}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {React.cloneElement(step.icon, { 
                        size: 28, 
                        strokeWidth: isDark ? 2 : 2.5,
                        className: cn(
                          isDark ? "text-white" : 
                            (index === 0 ? "text-brand-primary-dark" : 
                             index === 1 ? "text-brand-accent-pink-dark" : 
                             "text-brand-secondary-dark"),
                          "drop-shadow-sm"
                        )
                      })}
                    </motion.div>

                    <h3 className={cn(
                      "text-xl font-semibold mb-3 transition-colors",
                      isDark
                        ? "text-slate-100 group-hover:text-brand-accent-pink"
                        : "text-slate-700 group-hover:text-brand-primary"
                    )}>
                      {step.title.substring(step.title.indexOf('.') + 2)} {/* Remove number prefix */}
                    </h3>

                    <p className={cn(
                      "text-md flex-grow leading-relaxed",
                      isDark 
                        ? "text-slate-300" 
                        : "text-slate-500"
                    )}>{step.description}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section - Apply enhanced styling */}
      <section 
        id="features" 
        className={cn(
          "py-16 lg:py-24 px-4 relative overflow-hidden",
          "bg-background-primary" // Solid background, or a subtle gradient if preferred
        )}
        aria-labelledby="features-title"
      >
        {/* Enhanced Background elements - similar to How It Works but varied */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            className="absolute -top-1/3 -right-1/4 w-2/5 h-2/5 rounded-full opacity-10 bg-gradient-to-bl from-brand-secondary via-brand-accent-purple to-transparent filter blur-3xl"
            animate={{
              transform: ["translateX(0px) translateY(0px)", "translateX(-15px) translateY(15px)", "translateX(0px) translateY(0px)"],
            }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-1/3 -left-1/4 w-2/5 h-2/5 rounded-full opacity-10 bg-gradient-to-tr from-brand-primary via-brand-accent-pink to-transparent filter blur-3xl"
            animate={{
              transform: ["translateX(0px) translateY(0px)", "translateX(15px) translateY(-15px)", "translateX(0px) translateY(0px)"],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 0.5px, transparent 0.5px)',
              backgroundSize: '15px 15px',
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {/* Section label */}
            <div className="mb-4 inline-block">
              <span
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold tracking-wider uppercase shadow-lg",
                  "bg-gradient-to-r from-brand-secondary/80 via-brand-accent-pink/80 to-brand-primary/80 text-white", // Reversed gradient for variety
                  "border border-white/20"
                )}
              >
                PREMIUM EXPERIENCE
              </span>
            </div>

            <h2
              id="features-title"
              className="text-4xl lg:text-6xl font-extrabold mb-6 text-content-primary drop-shadow-md"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(120deg, var(--brand-secondary) 0%, var(--brand-accent-pink) 50%, var(--brand-primary) 100%)' // Slightly different gradient
                }}
              >
                Powerful Features
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-content-secondary mb-12 lg:mb-20 max-w-3xl mx-auto">
              Our converter is packed with cutting-edge features designed for a seamless and delightful music conversion experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <SpotlightCard
                  className={cn(
                    "p-6 text-left h-full rounded-2xl shadow-lg transition-all duration-300 group flex flex-col overflow-hidden",
                    isDark 
                      ? "bg-[#1A1A2E]/90 hover:bg-[#21213D]/95 border-[var(--brand-secondary-alpha-20)] backdrop-blur-sm" // Richer dark bg with blur
                      : "bg-slate-50 hover:bg-white border-slate-200"
                  )}
                  // Ensure SpotlightCard props like fromColor, viaColor, toColor are set if they control the spotlight effect
                  // For example (these are illustrative, adjust to your component's API):
                  // fromColor={isDark ? "var(--brand-primary-alpha-10)" : "var(--brand-primary-alpha-5)"}
                  // viaColor={isDark ? "var(--brand-accent-pink-alpha-10)" : "var(--brand-accent-pink-alpha-5)"}
                  // size={isMobile ? 200 : 300} // Adjust spotlight size
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <motion.div
                      className={cn(
                        "w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg",
                        index % 4 === 0 ? "bg-gradient-to-br from-brand-primary to-brand-primary-dark" :
                        index % 4 === 1 ? "bg-gradient-to-br from-brand-secondary to-brand-secondary-dark" :
                        index % 4 === 2 ? "bg-gradient-to-br from-brand-accent-pink to-brand-accent-pink/80" :
                        "bg-gradient-to-br from-brand-accent-yellow to-brand-accent-yellow/80"
                      )}
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ type: "spring", stiffness: 250, damping: 10 }}
                    >
                      {React.cloneElement(feature.icon, { 
                        size: 32, 
                        strokeWidth: isDark ? 1.8 : 2.2,
                        className: cn(
                          isDark ? "text-white" : 
                            (index % 4 === 0 ? "text-brand-primary-dark" : 
                             index % 4 === 1 ? "text-brand-secondary-dark" : 
                             index % 4 === 2 ? "text-brand-accent-pink-dark" : 
                             "text-brand-accent-yellow-dark"),
                          isDark ? "drop-shadow-sm" : "drop-shadow-md"
                        )
                      })}
                    </motion.div>

                    <h3 className={cn(
                      "text-xl font-semibold mb-3 transition-colors",
                      isDark
                        ? "text-slate-100 group-hover:text-brand-accent-pink"
                        : "text-slate-700 group-hover:text-brand-primary"
                    )}>
                      {feature.title}
                    </h3>
                    <p className={cn(
                      "text-md flex-grow leading-relaxed",
                      isDark 
                        ? "text-slate-300" 
                        : "text-slate-500"
                    )}>{feature.description}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer - Updated with SoundSwapp branding */}
      <footer className={cn(
        "py-12 px-4 text-center",
        "bg-background-secondary border-t border-border-default" // Footer background and top border
      )}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-content-primary">
              <div className="soundswapp-logo">
                <svg width="32" height="32" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient id="soundswapp-footer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--brand-primary)" />
                      <stop offset="35%" stopColor="var(--brand-accent-pink)" />
                      <stop offset="100%" stopColor="var(--brand-secondary)" />
                    </linearGradient>
                    <filter id="footer-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1.2" result="blur" />
                       <feOffset dy="0.5" result="offsetBlur" />
                      <feMerge>
                        <feMergeNode in="offsetBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <pattern id="footer-bg-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                      <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3"/>
                    </pattern>
                  </defs>
                  <circle cx="18" cy="18" r="18" fill="url(#soundswapp-footer-grad)" opacity="0.9" />
                  <circle cx="18" cy="18" r="18" fill="url(#footer-bg-pattern)" opacity="0.4"/>
                  
                  <g filter="url(#footer-glow)" transform="translate(0.25, 0.25)">
                    <path className="ss-letter-main-static" 
                          d="M12.5 23.5 C10 23.5 8.5 21.5 9 19 C9.5 16.5 12.5 15.5 15 15.5 C17.5 15.5 19.5 14 19 11.5 C18.5 9 16.5 7.5 14 7.5" 
                          stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path className="ss-letter-highlight-static" 
                          d="M12.8 23 C10.5 23 9.3 21.3 9.7 19.2 C10.1 17.1 12.8 16.1 15 16.1 C17.2 16.1 18.8 14.7 18.4 12.5 C18.0 10.3 16.2 8.5 14 8.5"
                          stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                    
                    <path className="ss-letter-main-static" 
                          d="M23.5 23.5 C26 23.5 27.5 21.5 27 19 C26.5 16.5 23.5 15.5 21 15.5 C18.5 15.5 16.5 14 17 11.5 C17.5 9 19.5 7.5 22 7.5"
                          stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path className="ss-letter-highlight-static" 
                          d="M23.2 23 C25.5 23 26.7 21.3 26.3 19.2 C25.9 17.1 23.2 16.1 21 16.1 C18.8 16.1 17.2 14.7 17.6 12.5 C18.0 10.3 19.8 8.5 22 8.5"
                          stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
              </div>
              <span className="text-xl font-bold soundswapp-gradient-text"><strong>Sound</strong>Swapp</span>
            </div>
            <div className="flex gap-4">
              <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-content-tertiary hover:text-brand-primary transition-colors">
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="mailto:support@example.com" className="text-content-tertiary hover:text-brand-primary transition-colors">
                <Mail size={24} />
                <span className="sr-only">Email Support</span>
              </a>
            </div>
          </div>
          <p className="text-sm text-content-tertiary mb-4">
            Convert your playlists between Spotify and YouTube with ease. Secure, fast, and user-friendly.
          </p>
          <p className="text-xs text-content-tertiary">
            &copy; {new Date().getFullYear()} SoundSwapp. All Rights Reserved. 
            <Link to="/privacy" className="ml-2 hover:text-brand-primary underline">Privacy Policy</Link> 
            <span className="mx-1">•</span>
            <Link to="/terms" className="hover:text-brand-primary underline">Terms of Service</Link>
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="text-xs font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              Designed & Developed by
            </span>
            <a
              href="https://eliudsamwel.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400 bg-clip-text text-transparent hover:underline hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200"
            >
              eliudsamwel.dev
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline ml-1">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <SuccessCelebration 
        isActive={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default ModernPlaylistConverter;