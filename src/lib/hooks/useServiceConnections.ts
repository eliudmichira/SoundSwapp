import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { isSpotifyAuthenticated } from '../spotifyAuth';
import { isYouTubeAuthenticated } from '../youtubeAuth';

export const useServiceConnections = () => {
  const { 
    setHasSpotifyAuth, 
    setHasYouTubeAuth, 
    fetchSpotifyProfile, 
    fetchYouTubeProfile,
    checkYouTubeAuth
  } = useAuth();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshConnections = useCallback(async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      setError(null);

      // Check Spotify auth
      const isSpotifyAuthed = isSpotifyAuthenticated();
      setHasSpotifyAuth(isSpotifyAuthed);
      if (isSpotifyAuthed) {
        await fetchSpotifyProfile();
      }

      // Check YouTube auth
      const isYouTubeAuthed = await checkYouTubeAuth();
      setHasYouTubeAuth(isYouTubeAuthed);
      if (isYouTubeAuthed) {
        await fetchYouTubeProfile();
      }

      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error refreshing connections:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh connections');
    } finally {
      setIsRefreshing(false);
    }
  }, [
    isRefreshing,
    setHasSpotifyAuth,
    setHasYouTubeAuth,
    fetchSpotifyProfile,
    fetchYouTubeProfile,
    checkYouTubeAuth
  ]);

  // Initial check on mount and periodic refresh
  useEffect(() => {
    refreshConnections();

    // Refresh every 5 minutes
    const interval = setInterval(refreshConnections, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshConnections]);

  return {
    refreshConnections,
    isRefreshing,
    lastRefresh,
    error
  };
}; 