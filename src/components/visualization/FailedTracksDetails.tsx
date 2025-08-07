import React, { useState } from 'react';
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
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphicContainer } from '../ui/GlassmorphicContainer';
import { FailedTrack } from '../../lib/ConversionContext';
import { useNavigate } from 'react-router-dom';

interface FailedTracksDetailsProps {
  failedTracks: FailedTrack[];
  onClose: () => void;
  onAddToYouTube?: (videoId: string, trackIndex: number) => void;
  onAddToSpotify?: (trackUri: string, trackIndex: number) => void;
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

export const FailedTracksDetails: React.FC<FailedTracksDetailsProps> = ({
  failedTracks,
  onClose,
  onAddToYouTube,
  onAddToSpotify
}) => {
  const navigate = useNavigate();
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [manualInputs, setManualInputs] = useState<{ [key: number]: { youtube: string; spotify: string } }>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'manual'>('overview');

  const handleCopyQuery = async (query: string) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopiedQuery(query);
      setTimeout(() => setCopiedQuery(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleAddToYouTube = (trackIndex: number) => {
    const videoId = manualInputs[trackIndex]?.youtube;
    if (videoId && onAddToYouTube) {
      onAddToYouTube(videoId, trackIndex);
    }
  };

  const handleAddToSpotify = (trackIndex: number) => {
    const trackUri = manualInputs[trackIndex]?.spotify;
    if (trackUri && onAddToSpotify) {
      onAddToSpotify(trackUri, trackIndex);
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
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-sf-pro-display font-bold text-gray-900 dark:text-white">
                  Failed Tracks Details
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {failedTracks.length} tracks failed to convert
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const queries = failedTracks.map(track => 
                  encodeURIComponent(track.artists[0] + ' ' + track.name)
                );
                queries.forEach(query => {
                  window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
                });
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Search All on YouTube
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <GlassmorphicContainer className="p-8 space-y-8" rounded="xl">
          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              {[
                { key: 'overview', label: 'Overview', icon: Info },
                { key: 'search', label: 'Search Tools', icon: Search },
                { key: 'manual', label: 'Manual Add', icon: Music }
              ].map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap min-w-0 flex-shrink-0 ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200/60 dark:border-gray-600/60 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{label}</span>
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
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <motion.div
                    {...scaleOnHover}
                    className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Failed Tracks</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total count</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {failedTracks.length}
                    </div>
                  </motion.div>

                  <motion.div
                    {...scaleOnHover}
                    className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md">
                        <Search size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Matches</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Search issues</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {failedTracks.filter(t => t.reason.includes('No match') || t.reason.includes('below threshold')).length}
                    </div>
                  </motion.div>

                  <motion.div
                    {...scaleOnHover}
                    className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md">
                        <X size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Errors</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Technical issues</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {failedTracks.filter(t => t.reason.includes('Failed to add') || t.reason.includes('Error')).length}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Smart Search Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200/50 dark:border-yellow-700/50"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Info className="text-yellow-600 dark:text-yellow-400" size={20} />
                    Smart Search Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        Try removing "feat." or "(feat.)" from artist names
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        Search for just the main artist name
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        Try different spellings or abbreviations
                      </li>
                    </ul>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        For explicit content, try searching without "Explicit"
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        Use platform search suggestions for better results
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        Check for remixes, covers, or live versions
                      </li>
                    </ul>
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
                className="space-y-6"
              >
                <div className="space-y-6">
                  {failedTracks.map((track, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {track.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {track.artists.join(', ')}
                          </p>
                        </div>
                        {track.bestMatchScore !== undefined && track.bestMatchScore > 0 && (
                          <div className="text-right">
                            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full">
                              Best match: {Math.round(track.bestMatchScore * 100)}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason:</span>
                          <p className={`text-sm mt-1 ${getFailureReasonColor(track.reason)}`}>
                            {track.reason}
                          </p>
                        </div>

                        {track.bestMatchTitle && track.bestMatchTitle !== 'None' && track.bestMatchTitle !== 'Error occurred' && (
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best match found:</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              "{track.bestMatchTitle}" by {track.bestMatchArtist}
                            </p>
                          </div>
                        )}

                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search queries tried:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {track.searchQueries.map((query, queryIndex) => (
                              <span
                                key={queryIndex}
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full"
                              >
                                "{query}"
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Alternative Search Queries */}
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          Try these alternative searches:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {generateAlternativeQueries(track).map((query, queryIndex) => (
                            <motion.button
                              key={queryIndex}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCopyQuery(query)}
                              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              {copiedQuery === query ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  {query}
                                </>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Direct Search Links */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">YouTube Search:</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              defaultValue={track.artists[0] + ' ' + track.name}
                              className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="Search YouTube..."
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                const query = encodeURIComponent(track.artists[0] + ' ' + track.name);
                                window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Search
                            </motion.button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Spotify Search:</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              defaultValue={track.artists[0] + ' ' + track.name}
                              className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Search Spotify..."
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                const query = encodeURIComponent(track.artists[0] + ' ' + track.name);
                                window.open(`https://open.spotify.com/search/${query}`, '_blank');
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Search
                            </motion.button>
                          </div>
                        </div>
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
                className="space-y-6"
              >
                <div className="space-y-6">
                  {failedTracks.map((track, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm"
                    >
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {track.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {track.artists.join(', ')}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-red-500 text-white">
                              <Youtube size={16} />
                            </div>
                            <h5 className="font-medium text-gray-900 dark:text-white">Add to YouTube</h5>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              YouTube Video ID or URL:
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ"
                              value={manualInputs[index]?.youtube || ''}
                              onChange={(e) => updateManualInput(index, 'youtube', e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Paste a YouTube URL or enter the 11-character video ID
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAddToYouTube(index)}
                              disabled={!manualInputs[index]?.youtube}
                              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add to YouTube Playlist
                            </motion.button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-lg bg-green-500 text-white">
                              <Heart size={16} />
                            </div>
                            <h5 className="font-medium text-gray-900 dark:text-white">Add to Spotify</h5>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Spotify Track URI or URL:
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., spotify:track:4iV5W9uYEdYUVa79Axb7Rh or https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
                              value={manualInputs[index]?.spotify || ''}
                              onChange={(e) => updateManualInput(index, 'spotify', e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Paste a Spotify track URL or enter the track URI
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAddToSpotify(index)}
                              disabled={!manualInputs[index]?.spotify}
                              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add to Spotify Playlist
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassmorphicContainer>
      </div>
    </div>
  );
}; 