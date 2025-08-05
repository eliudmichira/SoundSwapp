import React, { useState } from 'react';
import { AlertTriangle, X, Info, Search, ExternalLink, Copy, Check } from 'lucide-react';
import { FailedTrack } from '../lib/ConversionContext';

interface EnhancedFailedTracksModalProps {
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

export const EnhancedFailedTracksModal: React.FC<EnhancedFailedTracksModalProps> = ({
  failedTracks,
  onClose,
  onAddToYouTube,
  onAddToSpotify
}) => {
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [manualInputs, setManualInputs] = useState<{ [key: number]: { youtube: string; spotify: string } }>({});

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-surface-card rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border-default">
          <h3 className="text-xl font-bold text-content-primary flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-error-text" />
            Failed Tracks Details
          </h3>
          <button
            onClick={onClose}
            className="text-content-secondary hover:text-content-primary transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="mb-6">
            <div className="text-sm text-content-secondary mb-4">
              {failedTracks.length} tracks failed to convert. Use the search tools below to find and add missing tracks:
            </div>
            
            {/* Smart Search Tips */}
            <div className="bg-warning-bg border border-warning-border rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-warning-text mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Smart Search Tips
              </h4>
              <ul className="text-sm text-content-secondary space-y-1">
                <li>• Try removing "feat." or "(feat.)" from artist names</li>
                <li>• Search for just the main artist name</li>
                <li>• Try different spellings or abbreviations</li>
                <li>• For explicit content, try searching without "Explicit" in the title</li>
                <li>• Use YouTube's search suggestions for better results</li>
                <li>• Check for remixes, covers, or live versions</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            {failedTracks.map((track, index) => (
              <div key={index} className="border border-border-default rounded-lg p-4 bg-surface-alt">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-content-primary mb-1">
                      {track.name}
                    </h4>
                    <p className="text-sm text-content-secondary">
                      by {track.artists.join(', ')}
                    </p>
                  </div>
                  {track.bestMatchScore !== undefined && track.bestMatchScore > 0 && (
                    <div className="text-right">
                      <span className="text-xs bg-warning-bg text-warning-text px-2 py-1 rounded">
                        Best match: {Math.round(track.bestMatchScore * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-sm font-medium text-content-primary">Reason:</span>
                    <p className="text-sm text-error-text mt-1">{track.reason}</p>
                  </div>
                  
                  {track.bestMatchTitle && track.bestMatchTitle !== 'None' && track.bestMatchTitle !== 'Error occurred' && (
                    <div>
                      <span className="text-sm font-medium text-content-primary">Best match found:</span>
                      <p className="text-sm text-content-secondary mt-1">
                        "{track.bestMatchTitle}" by {track.bestMatchArtist}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm font-medium text-content-primary">Search queries tried:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {track.searchQueries.map((query, queryIndex) => (
                        <span
                          key={queryIndex}
                          className="text-xs bg-input text-content-secondary px-2 py-1 rounded"
                        >
                          "{query}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Smart Search Section */}
                <div className="border-t border-border-default pt-4">
                  <h5 className="font-medium text-content-primary mb-3 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Find This Track:
                  </h5>
                  
                  {/* Alternative Search Queries */}
                  <div className="mb-4">
                    <span className="text-sm font-medium text-content-primary">Try these alternative searches:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {generateAlternativeQueries(track).map((query, queryIndex) => (
                        <button
                          key={queryIndex}
                          onClick={() => handleCopyQuery(query)}
                          className="text-xs bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full hover:bg-brand-primary/20 transition-colors cursor-pointer flex items-center gap-1"
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
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Direct Search Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* YouTube Search */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-content-primary">YouTube Search:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={track.artists[0] + ' ' + track.name}
                          className="flex-1 px-3 py-2 bg-input border border-border-default rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          placeholder="Search YouTube..."
                        />
                        <button
                          onClick={() => {
                            const query = encodeURIComponent(track.artists[0] + ' ' + track.name);
                            window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Search
                        </button>
                      </div>
                    </div>
                    
                    {/* Spotify Search */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-content-primary">Spotify Search:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={track.artists[0] + ' ' + track.name}
                          className="flex-1 px-3 py-2 bg-input border border-border-default rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          placeholder="Search Spotify..."
                        />
                        <button
                          onClick={() => {
                            const query = encodeURIComponent(track.artists[0] + ' ' + track.name);
                            window.open(`https://open.spotify.com/search/${query}`, '_blank');
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Manual Track Addition */}
                  <div className="p-4 bg-surface-card rounded-lg border border-border-default">
                    <h6 className="font-medium text-content-primary mb-3">Add Track Manually:</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-content-primary">YouTube Video ID:</label>
                        <input
                          type="text"
                          placeholder="e.g., dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ"
                          value={manualInputs[index]?.youtube || ''}
                          onChange={(e) => updateManualInput(index, 'youtube', e.target.value)}
                          className="w-full px-3 py-2 bg-input border border-border-default rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <p className="text-xs text-content-secondary">
                          Paste a YouTube URL or enter the 11-character video ID
                        </p>
                        <button 
                          onClick={() => handleAddToYouTube(index)}
                          disabled={!manualInputs[index]?.youtube}
                          className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to YouTube Playlist
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-content-primary">Spotify Track URI:</label>
                        <input
                          type="text"
                          placeholder="e.g., spotify:track:4iV5W9uYEdYUVa79Axb7Rh or https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
                          value={manualInputs[index]?.spotify || ''}
                          onChange={(e) => updateManualInput(index, 'spotify', e.target.value)}
                          className="w-full px-3 py-2 bg-input border border-border-default rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <p className="text-xs text-content-secondary">
                          Paste a Spotify track URL or enter the track URI
                        </p>
                        <button 
                          onClick={() => handleAddToSpotify(index)}
                          disabled={!manualInputs[index]?.spotify}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Spotify Playlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 border-t border-border-default bg-surface-alt">
          <div className="text-sm text-content-secondary">
            {failedTracks.length} failed tracks
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Open all failed tracks in YouTube search
                const queries = failedTracks.map(track => 
                  encodeURIComponent(track.artists[0] + ' ' + track.name)
                );
                queries.forEach(query => {
                  window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
                });
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Search All on YouTube
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primaryHover transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 