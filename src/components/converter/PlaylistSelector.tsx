import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Music } from 'lucide-react';
import { PlaylistSelectorProps } from '../../types/ui';
import { validatePlaylistUrl } from '../../utils/playlistUtils';
import { ANIMATION_VARIANTS } from '../../config/animations';

export const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({
  platform,
  onPlaylistSelect,
  onBack
}) => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use real playlists from the conversion context

  const handleUrlChange = (url: string) => {
    setPlaylistUrl(url);
    setIsValid(validatePlaylistUrl(url, platform as any));
  };

  const handleUrlSubmit = async () => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      // TODO: Implement playlist fetching logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      
      const mockPlaylist = {
        id: 'url-playlist',
        name: 'Imported Playlist',
        description: 'Playlist imported from URL',
        trackCount: 100,
        url: playlistUrl
      };
      
      onPlaylistSelect(mockPlaylist);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h3 className="text-lg font-semibold text-white">Select Playlist</h3>
          <p className="text-gray-300 text-sm">Choose a playlist to convert</p>
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Or paste a playlist URL
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={playlistUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={`Paste ${platform} playlist URL here...`}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleUrlSubmit}
              disabled={!isValid || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Loading...' : 'Import'}</span>
            </button>
          </div>
          {playlistUrl && !isValid && (
            <p className="text-red-400 text-sm mt-1">
              Please enter a valid {platform} playlist URL
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">or select from your playlists</span>
        </div>
      </div>

      {/* Playlist List */}
      <div className="space-y-3">
        <div className="text-center py-8">
          <p className="text-gray-400">No playlists available. Use the URL input above to convert a playlist.</p>
        </div>
      </div>
    </div>
  );
}; 