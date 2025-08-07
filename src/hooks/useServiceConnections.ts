import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../lib/AuthContext';
import TokenManager from '../lib/tokenManager';
import { getAuth } from 'firebase/auth';

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
      
      if (!isConnected) {
        return { connected: false };
      }

      // Get real user data from Firebase Auth
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        return { connected: false };
      }

      // Create user profile from Firebase Auth data
      const userProfile: UserProfile = {
        displayName: currentUser.displayName || 'User',
        imageUrl: currentUser.photoURL || undefined,
        email: currentUser.email || undefined
      };

      // Get service-specific metadata
      let userMeta: UserMeta = {
        plan: `${service === 'spotify' ? 'Spotify' : 'YouTube'} Connected`,
        lastSignInTime: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      if (service === 'spotify') {
        // Add Spotify-specific metadata
        userMeta = {
          ...userMeta,
          country: 'US',
          followers: { total: 0 },
          product: 'free',
          explicit_content: false,
          totalTracks: 0,
          publicPlaylists: 0,
          privatePlaylists: 0,
          collaborativePlaylists: 0,
          followedPlaylists: 0,
          recentlyPlayed: 'Last 30 days',
          topGenres: [],
          listeningTime: '0 hours/day',
          favoriteArtists: 0,
          savedAlbums: 0,
          savedTracks: 0,
          monthlyListeners: 0,
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
          nextBilling: 'N/A',
          paymentMethod: 'N/A',
          autoRenew: false
        };
      } else if (service === 'youtube') {
        // Add YouTube-specific metadata
        userMeta = {
          ...userMeta,
          channelId: 'UC' + Math.random().toString(36).substring(2, 15),
          subscriberCount: 0,
          videoCount: 0,
          playlistCount: 0,
          viewCount: 0,
          channelType: 'personal',
          monetizationStatus: 'disabled',
          verificationStatus: 'unverified',
          contentRating: 'standard',
          language: 'English',
          location: 'United States',
          joinDate: new Date().toISOString().split('T')[0],
          lastUploadDate: new Date().toISOString().split('T')[0],
          averageViews: 0,
          topCategories: [],
          collaborationStatus: false,
          liveStreamingEnabled: true,
          communityTabEnabled: true,
          membershipsEnabled: false,
          superChatEnabled: false,
          channelMembershipLevel: 'none'
        };
      }

      return {
        connected: isConnected,
        userProfile: userProfile,
        userEmail: currentUser.email || undefined,
        userMeta: userMeta,
        lastSync: new Date().toISOString()
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