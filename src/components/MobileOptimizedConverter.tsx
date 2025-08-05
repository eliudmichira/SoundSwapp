import React, { useState } from 'react';
import { useConversion } from '../lib/ConversionContext';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Monitor,
  ArrowRight
} from 'lucide-react';

interface MobileOptimizedConverterProps {
  className?: string;
}

export const MobileOptimizedConverter: React.FC<MobileOptimizedConverterProps> = ({ 
  className = '' 
}) => {
  const { state, fetchSpotifyPlaylists, fetchYouTubePlaylists, startConversion, resetConversion } = useConversion();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sourcePlatform, setSourcePlatform] = useState<'spotify' | 'youtube' | null>(null);
  const [destinationPlatform, setDestinationPlatform] = useState<'spotify' | 'youtube' | null>(null);

  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">SoundSwapp</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {isMobile ? (
              <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-20">
        <div className="max-w-md mx-auto">
          {/* Step 1: Select Source - Matching the image exactly */}
          {currentStep === 0 && (
            <div className="space-y-8">
              {/* Title Section */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100">
                  Select Source
                </h2>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  Choose the platform you want to import your playlist from (Spotify or YouTube).
                </p>
              </div>

              {/* Source Platform Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-900 dark:bg-gray-100 rounded-full"></div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100">
                    Source Platform
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {/* Spotify Button */}
                  <motion.button
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 ${
                      sourcePlatform === 'spotify'
                        ? 'bg-gradient-to-r from-red-500 to-teal-500 border-green-500 shadow-lg'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSourcePlatform('spotify')}
                  >
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <span className={`text-xl font-black ${
                        sourcePlatform === 'spotify' 
                          ? 'text-green-500' 
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        Spotify
                      </span>
                    </div>
                  </motion.button>

                  {/* YouTube Button */}
                  <motion.button
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 ${
                      sourcePlatform === 'youtube'
                        ? 'bg-gradient-to-r from-red-500 to-teal-500 border-red-500 shadow-lg'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSourcePlatform('youtube')}
                  >
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                      <span className={`text-xl font-black ${
                        sourcePlatform === 'youtube' 
                          ? 'text-white' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        YouTube
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Destination Platform Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-900 dark:bg-gray-100 rounded-full"></div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100">
                    Destination Platform
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {/* Spotify Destination Button */}
                  <motion.button
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 ${
                      destinationPlatform === 'spotify'
                        ? 'bg-gradient-to-r from-red-500 to-teal-500 border-green-500 shadow-lg'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDestinationPlatform('spotify')}
                  >
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <span className={`text-xl font-black ${
                        destinationPlatform === 'spotify' 
                          ? 'text-white' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        Spotify
                      </span>
                    </div>
                  </motion.button>

                  {/* YouTube Destination Button */}
                  <motion.button
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 ${
                      destinationPlatform === 'youtube'
                        ? 'bg-gradient-to-r from-red-500 to-teal-500 border-red-500 shadow-lg'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDestinationPlatform('youtube')}
                  >
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                      <span className={`text-xl font-black ${
                        destinationPlatform === 'youtube' 
                          ? 'text-white' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        YouTube
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Next Step Button */}
              {sourcePlatform && destinationPlatform && (
                <motion.button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(1)}
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          )}

          {/* Step 2: Playlist Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Your Playlist</h2>
                <p className="text-gray-600 dark:text-gray-300">Choose which playlist you want to convert</p>
              </div>
              
              <div className="space-y-3">
                {state.spotifyPlaylists.slice(0, 5).map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {/* Playlist selection logic */}}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{playlist.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{playlist.trackCount} tracks</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Track Review */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review Your Tracks</h2>
                <p className="text-gray-600 dark:text-gray-300">Check your tracks before starting the conversion</p>
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-2">
                {state.tracks.slice(0, 10).map((track, index) => (
                  <div key={track.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{track.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{track.artists.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Conversion */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start Conversion</h2>
                <p className="text-gray-600 dark:text-gray-300">Ready to convert your playlist</p>
              </div>
              
              <div className="space-y-4">
                <motion.button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startConversion()}
                  disabled={state.status === 'matching_tracks' || state.status === 'creating_playlist'}
                >
                  {state.status === 'matching_tracks' || state.status === 'creating_playlist' ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Start Conversion
                    </>
                  )}
                </motion.button>
                
                {state.error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <p className="text-red-400 text-sm">{state.error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <motion.button
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>
          
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <motion.button
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
            disabled={currentStep === 3}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}; 