import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AlertTriangle, 
  X, 
  Info, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Music,
  Youtube,
  ArrowLeft,
  RefreshCw,
  Download,
  Share2,
  BarChart3,
  PieChart,
  Heart,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FailedTrack, useConversion } from '../../lib/ConversionContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToYouTubePlaylist } from '../../lib/youtubeApi';
import { addTracksToSpotifyPlaylist } from '../../lib/spotifyApi';

interface MobileFailedTracksDetailsProps {
  failedTracks?: FailedTrack[];
  onClose?: () => void;
  onAddToYouTube?: (videoId: string, trackIndex: number) => Promise<void>;
  onAddToSpotify?: (trackUri: string, trackIndex: number) => Promise<void>;
}

// Helper function to generate alternative search queries
const generateAlternativeQueries = (track: FailedTrack): string[] => {
  const queries: string[] = [];
  const artist = track.artists[0];
  const title = track.name;
  
  // Remove common prefixes/suffixes
  const cleanTitle = title
    .replace(/\(feat\.?.*?\)/gi, '')
    .replace(/\(Explicit.*?\)/gi, '')
    .replace(/\(Album Version\)/gi, '')
    .replace(/\(Clean.*?\)/gi, '')
    .trim();
  
  // Basic variations
  queries.push(`${artist} ${cleanTitle}`);
  queries.push(`${cleanTitle} ${artist}`);
  queries.push(`${artist} - ${cleanTitle}`);
  
  // Artist variations
  if (artist.includes('(') && artist.includes(')')) {
    const mainArtist = artist.split('(')[0].trim();
    queries.push(`${mainArtist} ${cleanTitle}`);
  }
  
  // Title variations
  if (cleanTitle.includes('(')) {
    const mainTitle = cleanTitle.split('(')[0].trim();
    queries.push(`${artist} ${mainTitle}`);
  }
  
  // Remove "feat." variations
  if (artist.toLowerCase().includes('feat')) {
    const mainArtist = artist.split(/feat\.?/i)[0].trim();
    queries.push(`${mainArtist} ${cleanTitle}`);
  }
  
  return [...new Set(queries)]; // Remove duplicates
};

// Enhanced animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.02, y: -2 },
  whileTap: { scale: 0.98 }
};

export const MobileFailedTracksDetails: React.FC<MobileFailedTracksDetailsProps> = ({
  failedTracks: propsFailedTracks,
  onClose,
  onAddToYouTube: propsOnAddToYouTube,
  onAddToSpotify: propsOnAddToSpotify
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useConversion();
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [manualInputs, setManualInputs] = useState<{ [key: number]: { youtube: string; spotify: string } }>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'manual'>('overview');
  const [failedTracks, setFailedTracks] = useState<FailedTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedTracks, setAddedTracks] = useState<Set<number>>(new Set());
  const hasProcessedData = useRef(false);

  // Reset processed data flag when location changes
  useEffect(() => {
    hasProcessedData.current = false;
  }, [location.pathname]);

  // Get failed tracks from props or from navigation state
  useEffect(() => {
    console.log('MobileFailedTracksDetails: useEffect triggered');
    console.log('Props failed tracks:', propsFailedTracks);
    console.log('Location state:', location.state);
    console.log('Has processed data:', hasProcessedData.current);
    
    // Don't process if we've already processed
    if (hasProcessedData.current) {
      console.log('Already processed, skipping data processing');
      return;
    }
    
    if (propsFailedTracks) {
      console.log('Using props failed tracks:', propsFailedTracks);
      setFailedTracks(propsFailedTracks);
      hasProcessedData.current = true;
    } else if (location.state?.failedTracks) {
      // Get failed tracks from navigation state (like desktop modal)
      console.log('Using failed tracks from navigation state:', location.state.failedTracks);
      setFailedTracks(location.state.failedTracks);
      hasProcessedData.current = true;
    } else {
      console.log('No failed tracks found in props or navigation state');
      console.log('Setting empty failed tracks array');
      setFailedTracks([]);
      hasProcessedData.current = true;
    }
  }, [propsFailedTracks, location.state]);

  const handleCopyQuery = async (query: string) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopiedQuery(query);
      setTimeout(() => setCopiedQuery(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Implement YouTube handler
  const handleAddToYouTube = async (videoId: string, trackIndex: number) => {
    if (propsOnAddToYouTube) {
      return propsOnAddToYouTube(videoId, trackIndex);
    }

    try {
      
      // Get the current YouTube playlist ID from state
      const youtubePlaylistId = state.youtubePlaylistId;
      
      if (!youtubePlaylistId) {
        throw new Error('No YouTube playlist found. Please start a conversion first.');
      }
      
      // Extract video ID if a full URL was provided
      const cleanVideoId = videoId.includes('youtube.com') || videoId.includes('youtu.be') 
        ? videoId.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1] || videoId
        : videoId;
      
      if (!cleanVideoId || cleanVideoId.length !== 11) {
        throw new Error('Invalid YouTube video ID. Please provide a valid 11-character video ID or YouTube URL.');
      }
      
      console.log(`Adding YouTube video ${cleanVideoId} to playlist ${youtubePlaylistId}`);
      
      // Add the video to the YouTube playlist
      await addToYouTubePlaylist('user', youtubePlaylistId, cleanVideoId);
      
      console.log('Successfully added YouTube video to playlist');
      
    } catch (error) {
      console.error('Error adding YouTube video:', error);
      throw error;
    }
  };

  // Implement Spotify handler
  const handleAddToSpotify = async (trackUri: string, trackIndex: number) => {
    if (propsOnAddToSpotify) {
      return propsOnAddToSpotify(trackUri, trackIndex);
    }

    try {
      
      // Get the current Spotify playlist ID from state
      const spotifyPlaylistId = state.spotifyPlaylistId;
      
      if (!spotifyPlaylistId) {
        throw new Error('No Spotify playlist found. Please start a conversion first.');
      }
      
      // Clean the track URI
      let cleanTrackUri = trackUri;
      
      // If it's a URL, extract the track ID
      if (trackUri.includes('spotify.com/track/')) {
        const match = trackUri.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
        if (match) {
          cleanTrackUri = `spotify:track:${match[1]}`;
        }
      }
      
      // Validate track URI format
      if (!cleanTrackUri.startsWith('spotify:track:')) {
        throw new Error('Invalid Spotify track URI. Please provide a valid track URI or Spotify URL.');
      }
      
      console.log(`Adding Spotify track ${cleanTrackUri} to playlist ${spotifyPlaylistId}`);
      
      // Add the track to the Spotify playlist
      await addTracksToSpotifyPlaylist(spotifyPlaylistId, [cleanTrackUri]);
      
      console.log('Successfully added Spotify track to playlist');
      
    } catch (error) {
      console.error('Error adding Spotify track:', error);
      throw error;
    }
  };

  const handleAddToYouTubeButton = async (trackIndex: number) => {
    const videoId = manualInputs[trackIndex]?.youtube;
    if (!videoId) return;
    
    setIsLoading(true);
    try {
      await handleAddToYouTube(videoId, trackIndex);
      setAddedTracks(prev => new Set([...prev, trackIndex]));
    } catch (error) {
      console.error('Failed to add to YouTube:', error);
      // You could add toast notification here if needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToSpotifyButton = async (trackIndex: number) => {
    const trackUri = manualInputs[trackIndex]?.spotify;
    if (!trackUri) return;
    
    setIsLoading(true);
    try {
      await handleAddToSpotify(trackUri, trackIndex);
      setAddedTracks(prev => new Set([...prev, trackIndex]));
    } catch (error) {
      console.error('Failed to add to Spotify:', error);
      // You could add toast notification here if needed
    } finally {
      setIsLoading(false);
    }
  };

  const updateManualInput = (trackIndex: number, platform: 'youtube' | 'spotify', value: string) => {
    let processedValue = value;
    
    // Auto-extract video ID from YouTube URLs
    if (platform === 'youtube' && (value.includes('youtube.com') || value.includes('youtu.be'))) {
      const match = value.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match) {
        processedValue = match[1];
      }
    }
    
    // Auto-extract track URI from Spotify URLs
    if (platform === 'spotify' && value.includes('spotify.com/track/')) {
      const match = value.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
      if (match) {
        processedValue = `spotify:track:${match[1]}`;
      }
    }
    
    setManualInputs(prev => ({
      ...prev,
      [trackIndex]: {
        ...prev[trackIndex],
        [platform]: processedValue
      }
    }));
  };

  const getFailureReasonColor = (reason: string) => {
    if (reason.includes('No match found') || reason.includes('below threshold')) {
      return 'text-orange-600 dark:text-orange-400';
    }
    if (reason.includes('Failed to add') || reason.includes('Error')) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-yellow-600 dark:text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sf-pro">
      {/* Premium Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  navigate('/');
                }
              }}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h1 className="text-lg font-sf-pro-display font-bold text-gray-900 dark:text-white">
                  Failed Tracks
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {failedTracks?.length} tracks failed to convert
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const queries = failedTracks?.map(track => 
                encodeURIComponent(track.artists[0] + ' ' + track.name)
              );
              queries?.forEach(query => {
                window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
              });
            }}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
          >
            <ExternalLink size={14} />
            Search All
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Premium Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl max-w-full overflow-x-auto hide-scrollbar">
            {[
              { key: 'overview', label: 'Overview', icon: Info },
              { key: 'search', label: 'Search', icon: Search },
              { key: 'manual', label: 'Manual Add', icon: Music }
            ].map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap min-w-0 flex-shrink-0 ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200/60 dark:border-gray-600/60 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                disabled={isLoading}
              >
                <Icon size={14} />
                <span className="text-xs font-medium">{label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <motion.div
                variants={staggerChildren}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 gap-4"
              >
                <motion.div
                  {...scaleOnHover}
                  className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Failed</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total count</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {failedTracks?.length}
                  </div>
                </motion.div>

                <motion.div
                  {...scaleOnHover}
                  className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md">
                      <Search size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">No Matches</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Search issues</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {failedTracks?.filter(t => t.reason.includes('No match') || t.reason.includes('below threshold')).length}
                  </div>
                </motion.div>
              </motion.div>

              {/* Smart Search Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-700/50"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Info className="text-yellow-600 dark:text-yellow-400" size={18} />
                  Search Tips
                </h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span>Remove "feat." from artist names</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span>Try just the main artist name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span>Check for remixes or live versions</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-4"
            >
              <div className="space-y-4">
                {failedTracks?.map((track, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm ${
                      addedTracks.has(index) ? 'ring-2 ring-green-500/50' : ''
                    }`}
                  >
                    <div className="mb-4">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {track.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {track.artists.join(', ')}
                      </p>
                      {track.bestMatchScore !== undefined && track.bestMatchScore > 0 && (
                        <div className="mt-2">
                          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                            Best match: {Math.round(track.bestMatchScore * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Reason:</span>
                        <p className={`text-xs mt-1 ${getFailureReasonColor(track.reason)}`}>
                          {track.reason}
                        </p>
                      </div>

                      {/* Alternative Search Queries */}
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          Try these searches:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {generateAlternativeQueries(track).slice(0, 3).map((query, queryIndex) => (
                            <motion.button
                              key={queryIndex}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCopyQuery(query)}
                              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors cursor-pointer flex items-center gap-1"
                              disabled={isLoading}
                            >
                              {copiedQuery === query ? (
                                <>
                                  <Check className="h-2 w-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-2 w-2" />
                                  {query.length > 20 ? query.substring(0, 20) + '...' : query}
                                </>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Search Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const query = encodeURIComponent(track.artists[0] + ' ' + track.name);
                          window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs flex items-center justify-center"
                        disabled={isLoading}
                      >
                        <Search size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const query = encodeURIComponent(track.artists[0] + ' ' + track.name);
                          window.open(`https://open.spotify.com/search/${query}`, '_blank');
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center justify-center"
                        disabled={isLoading}
                      >
                        <Search size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-4"
            >
              <div className="space-y-4">
                {failedTracks?.map((track, index) => {
                  const isTrackAdded = addedTracks.has(index);
                  const hasYouTubeInput = Boolean(manualInputs[index]?.youtube);
                  const hasSpotifyInput = Boolean(manualInputs[index]?.spotify);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm ${
                        isTrackAdded ? 'ring-2 ring-green-500/50' : ''
                      }`}
                    >
                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                          {track.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {track.artists.join(', ')}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-red-500 text-white">
                              <Youtube size={12} />
                            </div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white">Add to YouTube</h5>
                          </div>
                          
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="YouTube video ID or URL"
                              value={manualInputs[index]?.youtube || ''}
                              onChange={(e) => updateManualInput(index, 'youtube', e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                              disabled={isLoading || isTrackAdded}
                            />
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAddToYouTubeButton(index)}
                              disabled={!hasYouTubeInput || isLoading || isTrackAdded}
                              className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  Adding...
                                </>
                              ) : isTrackAdded ? (
                                <>
                                  <CheckCircle2 size={14} />
                                  Added
                                </>
                              ) : (
                                'Add to YouTube'
                              )}
                            </motion.button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-green-500 text-white">
                              <Music size={12} />
                            </div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white">Add to Spotify</h5>
                          </div>
                          
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Spotify track URI or URL"
                              value={manualInputs[index]?.spotify || ''}
                              onChange={(e) => updateManualInput(index, 'spotify', e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                              disabled={isLoading || isTrackAdded}
                            />
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAddToSpotifyButton(index)}
                              disabled={!hasSpotifyInput || isLoading || isTrackAdded}
                              className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  Adding...
                                </>
                              ) : isTrackAdded ? (
                                <>
                                  <CheckCircle2 size={14} />
                                  Added
                                </>
                              ) : (
                                'Add to Spotify'
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl flex items-center gap-3">
            <Loader2 size={24} className="animate-spin text-blue-600" />
            <span className="text-gray-900 dark:text-white font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};