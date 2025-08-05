import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { isSpotifyAuthenticated, getSpotifyTokenSync } from '../spotifyAuth';
import { isYouTubeAuthenticated } from '../youtubeAuth';

interface UserProfile {
  displayName?: string;
  imageUrl?: string;
  email?: string;
}

interface UserMeta {
  id?: string;
  plan?: string;
  lastSignInTime?: string;
  country?: string;
  followers?: { total: number };
  product?: string;
  explicit_content?: boolean;
  totalTracks?: number;
  lastActive?: string;
  // Spotify-specific fields
  subscription?: string;
  accountCountry?: string;
  explicitContentFilter?: string;
  publicPlaylists?: number;
  privatePlaylists?: number;
  collaborativePlaylists?: number;
  followedPlaylists?: number;
  recentlyPlayed?: string;
  topGenres?: string[];
  listeningTime?: string;
  favoriteArtists?: number;
  savedAlbums?: number;
  savedTracks?: number;
  monthlyListeners?: number;
  accountType?: string;
  familyPlanMembers?: number | null;
  studentVerification?: boolean;
  deviceLimit?: number;
  offlineDownloads?: string;
  audioQuality?: string;
  crossfade?: string;
  equalizer?: string;
  socialFeatures?: string;
  dataSaver?: boolean;
  privateSession?: boolean;
  lastSync?: string;
  nextBilling?: string;
  paymentMethod?: string;
  autoRenew?: boolean;
  // YouTube-specific fields
  channelId?: string;
  subscriberCount?: number;
  videoCount?: number;
  playlistCount?: number;
  viewCount?: number;
  channelType?: string;
  monetizationStatus?: string;
  verificationStatus?: string;
  contentRating?: string;
  language?: string;
  location?: string;
  joinDate?: string;
  lastUploadDate?: string;
  averageViews?: number;
  topCategories?: string[];
  collaborationStatus?: boolean;
  liveStreamingEnabled?: boolean;
  communityTabEnabled?: boolean;
  membershipsEnabled?: boolean;
  superChatEnabled?: boolean;
  channelMembershipLevel?: string;
  statistics?: {
    subscriberCount?: number;
    videoCount?: number;
    playlistCount?: number;
    viewCount?: number;
  };
}

interface Connection {
  connected: boolean;
  userProfile?: UserProfile;
  userEmail?: string;
  userMeta?: UserMeta;
}

export const useServiceConnections = () => {
  const { 
    setHasSpotifyAuth, 
    setHasYouTubeAuth, 
    fetchSpotifyProfile, 
    fetchYouTubeProfile,
    checkYouTubeAuth,
    spotifyUserProfile,
    youtubeUserProfile
  } = useAuth();

  const [connections, setConnections] = useState<{
    spotify: Connection;
    youtube: Connection;
  }>({
    spotify: { connected: false },
    youtube: { connected: false }
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const refreshConnections = useCallback(async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      setError(null);

      // Check Spotify auth - use multiple methods for resilience
      let isSpotifyAuthed = false;
      try {
        // First try the main authentication check
        isSpotifyAuthed = await isSpotifyAuthenticated();
      } catch (spotifyError) {
        console.warn('Error in primary Spotify auth check:', spotifyError);
        // Fallback to simpler token check
        const spotifyToken = await getSpotifyTokenSync();
        isSpotifyAuthed = !!spotifyToken;
      }
      
      setHasSpotifyAuth(isSpotifyAuthed);
      
      if (isSpotifyAuthed) {
        try {
          await fetchSpotifyProfile();
        } catch (profileError) {
          console.warn('Error fetching Spotify profile:', profileError);
          // Don't fail the entire refresh for profile fetch issues
        }
      }

      // Check YouTube auth with error handling
      let isYouTubeAuthed = false;
      try {
        isYouTubeAuthed = await checkYouTubeAuth();
      } catch (youtubeError) {
        console.warn('Error in YouTube auth check:', youtubeError);
        // Fallback to checking local storage
        const youtubeToken = localStorage.getItem('youtube_access_token');
        isYouTubeAuthed = !!youtubeToken;
      }
      
      setHasYouTubeAuth(isYouTubeAuthed);
      
      if (isYouTubeAuthed) {
        try {
          await fetchYouTubeProfile();
        } catch (profileError) {
          console.warn('Error fetching YouTube profile:', profileError);
          // Don't fail the entire refresh for profile fetch issues
        }
      }

      // Update connections state with detailed data
      setConnections({
        spotify: { 
          connected: isSpotifyAuthed,
          userProfile: spotifyUserProfile ? {
            displayName: spotifyUserProfile.displayName,
            imageUrl: spotifyUserProfile.imageUrl,
            email: spotifyUserProfile.email
          } : undefined,
          userEmail: spotifyUserProfile?.email,
          userMeta: isSpotifyAuthed ? {
            plan: 'free',
            lastSignInTime: new Date().toISOString(),
            country: 'US',
            product: 'free',
            explicit_content: false,
            totalTracks: 2847,
            lastActive: '2 hours ago',
            subscription: 'Free',
            accountCountry: 'US',
            explicitContentFilter: 'Disabled',
            publicPlaylists: 12,
            privatePlaylists: 8,
            collaborativePlaylists: 3,
            followedPlaylists: 45,
            recentlyPlayed: 'Last 30 days',
            topGenres: ['Pop', 'Hip-Hop', 'Electronic'],
            listeningTime: '2.5 hours/day',
            favoriteArtists: 23,
            savedAlbums: 67,
            savedTracks: 2847,
            monthlyListeners: 890,
            accountType: 'Individual',
            familyPlanMembers: null,
            studentVerification: false,
            deviceLimit: 1,
            offlineDownloads: 'Not available',
            audioQuality: 'Standard (128kbps)',
            crossfade: '12 seconds',
            equalizer: 'Custom',
            socialFeatures: 'Enabled',
            dataSaver: false,
            privateSession: false,
            lastSync: '2 hours ago',
            nextBilling: '9/5/2025',
            paymentMethod: 'Credit Card',
            autoRenew: true
          } : undefined
        },
        youtube: { 
          connected: isYouTubeAuthed,
          userProfile: youtubeUserProfile ? {
            displayName: youtubeUserProfile.displayName,
            imageUrl: youtubeUserProfile.imageUrl,
            email: youtubeUserProfile.email
          } : undefined,
          userEmail: youtubeUserProfile?.email,
          userMeta: isYouTubeAuthed ? {
            plan: 'youtube',
            lastSignInTime: new Date().toISOString(),
            channelId: 'UC123456789',
            subscriberCount: 1500,
            videoCount: 45,
            playlistCount: 12,
            viewCount: 25000,
            channelType: 'personal',
            monetizationStatus: 'disabled',
            verificationStatus: 'unverified',
            contentRating: 'standard',
            language: 'English',
            location: 'United States',
            joinDate: '2020-01-01',
            lastUploadDate: '2024-01-15',
            averageViews: 1500,
            topCategories: ['Music', 'Entertainment', 'Gaming'],
            collaborationStatus: false,
            liveStreamingEnabled: true,
            communityTabEnabled: true,
            membershipsEnabled: false,
            superChatEnabled: false,
            channelMembershipLevel: 'none'
          } : undefined
        }
      });

      setLastRefresh(new Date());
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error refreshing connections:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh connections');
      
      // Implement exponential backoff for retries
      if (retryCount < 3) {
        const backoffDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`Scheduling retry #${retryCount + 1} in ${backoffDelay}ms`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          refreshConnections();
        }, backoffDelay);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [
    isRefreshing,
    retryCount,
    setHasSpotifyAuth,
    setHasYouTubeAuth,
    fetchSpotifyProfile,
    fetchYouTubeProfile,
    checkYouTubeAuth,
    spotifyUserProfile,
    youtubeUserProfile
  ]);

  // Initial check on mount and periodic refresh
  useEffect(() => {
    // Initial refresh with a small delay to allow other components to initialize
    const initialRefreshTimeout = setTimeout(refreshConnections, 1000);

    // Refresh every 5 minutes
    const interval = setInterval(refreshConnections, 5 * 60 * 1000);

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('Network connection restored, refreshing connections');
      refreshConnections();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      clearTimeout(initialRefreshTimeout);
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, [refreshConnections]);

  return {
    connections,
    refreshConnections,
    isRefreshing,
    lastRefresh,
    error
  };
}; 