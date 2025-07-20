import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { isSpotifyAuthenticated, getSpotifyTokenSync } from '../spotifyAuth';
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
        isSpotifyAuthed = isSpotifyAuthenticated();
      } catch (spotifyError) {
        console.warn('Error in primary Spotify auth check:', spotifyError);
        // Fallback to simpler token check
        const spotifyToken = getSpotifyTokenSync();
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
    checkYouTubeAuth
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
    refreshConnections,
    isRefreshing,
    lastRefresh,
    error
  };
}; 