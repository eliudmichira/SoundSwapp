import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../lib/AuthContext';
import TokenManager from '../lib/tokenManager';

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
    averageViews?: number;
  };
}

interface Connection {
  connected: boolean;
  userProfile?: UserProfile;
  userEmail?: string;
  userMeta?: UserMeta;
  lastSync?: string;
}

interface ServiceConnections {
  spotify: Connection;
  youtube: Connection;
}

export const useServiceConnections = () => {
  const [connections, setConnections] = useState<ServiceConnections>({
    spotify: { connected: false },
    youtube: { connected: false }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Check connection status for a service
  const checkConnectionStatus = useCallback(async (service: 'spotify' | 'youtube') => {
    try {
      const tokens = await TokenManager.getTokens(service);
      const isConnected = tokens !== null;
      
      // Mock user data for demonstration
      const mockUserProfile: UserProfile = {
        displayName: service === 'spotify' ? 'Mich' : 'MICH',
        imageUrl: service === 'spotify' ? '/images/spotify-profile.jpg' : '/images/youtube-profile.jpg',
        email: 'michmichira@gmail.com'
      };

      const mockUserMeta: UserMeta = service === 'spotify' ? {
        plan: 'Free',
        lastSignInTime: new Date().toISOString(),
        country: 'US',
        followers: { total: 1250 },
        product: 'free',
        explicit_content: false,
        totalTracks: 2847,
        lastActive: new Date().toISOString(),
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
      } : {
        plan: 'YouTube Connected',
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
      };

      return {
        connected: isConnected,
        userProfile: isConnected ? mockUserProfile : undefined,
        userEmail: isConnected ? 'michmichira@gmail.com' : undefined,
        userMeta: isConnected ? mockUserMeta : undefined,
        lastSync: isConnected ? new Date().toISOString() : undefined
      };
    } catch (error) {
      console.error(`[useServiceConnections] Error checking ${service} connection:`, error);
      return { connected: false };
    }
  }, []);

  // Refresh all connections
  const refreshConnections = useCallback(async () => {
    if (!user) {
      setConnections({
        spotify: { connected: false },
        youtube: { connected: false }
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [spotifyConnection, youtubeConnection] = await Promise.all([
        checkConnectionStatus('spotify'),
        checkConnectionStatus('youtube')
      ]);

      setConnections({
        spotify: spotifyConnection,
        youtube: youtubeConnection
      });

      console.log('[useServiceConnections] Connections refreshed:', {
        spotify: spotifyConnection.connected,
        youtube: youtubeConnection.connected
      });
    } catch (error) {
      console.error('[useServiceConnections] Error refreshing connections:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh connections');
    } finally {
      setIsLoading(false);
    }
  }, [user, checkConnectionStatus]);

  // Initial load and refresh on user change
  useEffect(() => {
    refreshConnections();
  }, [user, refreshConnections]);

  // Set up periodic refresh (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshConnections();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, refreshConnections]);

  return {
    connections,
    refreshConnections,
    isLoading,
    error
  };
}; 