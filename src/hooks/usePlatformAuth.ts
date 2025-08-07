import { useState, useCallback, useEffect } from 'react';
import { PlatformKey } from '../types/conversion';
import { PlatformConnection } from '../types/platform';
import { getYouTubeAuthUrl } from '../lib/youtubeAuth';
import { initSpotifyAuth } from '../lib/spotifyAuth';

export const usePlatformAuth = () => {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize connections from localStorage
  useEffect(() => {
    const savedConnections = localStorage.getItem('platform_connections');
    if (savedConnections) {
      try {
        const parsed = JSON.parse(savedConnections);
        setConnections(parsed);
      } catch (error) {
        console.error('Error parsing saved connections:', error);
      }
    }
  }, []);

  // Save connections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('platform_connections', JSON.stringify(connections));
  }, [connections]);

  const connectPlatform = useCallback(async (platform: PlatformKey) => {
    setIsLoading(true);
    
    try {
      switch (platform) {
        case 'spotify':
          await initSpotifyAuth();
          break;
        case 'youtube':
          const authUrl = getYouTubeAuthUrl();
          window.location.href = authUrl;
          break;
        case 'soundcloud':
          // TODO: Implement SoundCloud auth
          console.log('SoundCloud auth not implemented yet');
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectPlatform = useCallback((platform: PlatformKey) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.platform === platform 
          ? { ...conn, isConnected: false, accessToken: undefined, refreshToken: undefined }
          : conn
      )
    );
  }, []);

  const updateConnection = useCallback((platform: PlatformKey, connectionData: Partial<PlatformConnection>) => {
    setConnections(prev => {
      const existing = prev.find(conn => conn.platform === platform);
      if (existing) {
        return prev.map(conn => 
          conn.platform === platform 
            ? { ...conn, ...connectionData }
            : conn
        );
      } else {
        return [...prev, { platform, isConnected: false, ...connectionData }];
      }
    });
  }, []);

  const getConnection = useCallback((platform: PlatformKey): PlatformConnection | undefined => {
    return connections.find(conn => conn.platform === platform);
  }, [connections]);

  const isConnected = useCallback((platform: PlatformKey): boolean => {
    const connection = getConnection(platform);
    return connection?.isConnected || false;
  }, [getConnection]);

  const getAccessToken = useCallback((platform: PlatformKey): string | undefined => {
    const connection = getConnection(platform);
    return connection?.accessToken;
  }, [getConnection]);

  const refreshToken = useCallback(async (platform: PlatformKey) => {
    const connection = getConnection(platform);
    if (!connection?.refreshToken) {
      throw new Error(`No refresh token available for ${platform}`);
    }

    // TODO: Implement token refresh logic
    console.log(`Refreshing token for ${platform}`);
  }, [getConnection]);

  return {
    connections,
    isLoading,
    connectPlatform,
    disconnectPlatform,
    updateConnection,
    getConnection,
    isConnected,
    getAccessToken,
    refreshToken
  };
}; 