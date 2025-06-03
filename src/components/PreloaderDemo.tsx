import React, { useState } from 'react';
import Preloader from './ui/Preloader';
import { motion } from 'framer-motion';
import { useTheme } from '../lib/ThemeContext';

const PreloaderDemo: React.FC = () => {
  const { isDark } = useTheme();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showProgressText, setShowProgressText] = useState(true);
  const [theme, setTheme] = useState<'spotify' | 'youtube' | 'default'>('default');

  const customTexts = [
    'Loading...',
    'Converting playlist...',
    'Syncing tracks...',
    'Almost there...',
    'Getting your music...'
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        className={`max-w-3xl w-full rounded-2xl overflow-hidden relative p-8 ${
          isDark ? 'bg-gray-800/30' : 'bg-white/70'
        } backdrop-blur-lg border ${
          isDark ? 'border-gray-700/50' : 'border-gray-200'
        } shadow-xl`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Preloader Component
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className={`rounded-xl p-6 flex flex-col items-center justify-center ${
            isDark ? 'bg-gray-900/40' : 'bg-gray-50/80'
          } border ${isDark ? 'border-gray-700/50' : 'border-gray-200/80'}`}>
            <Preloader 
              size={size} 
              showProgressText={showProgressText}
              theme={theme}
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className={`text-lg font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Size
                  </label>
                  <div className="flex space-x-3">
                    {[
                      { value: 'sm', label: 'Small' },
                      { value: 'md', label: 'Medium' },
                      { value: 'lg', label: 'Large' }
                    ].map((sizeOption) => (
                      <button
                        key={sizeOption.value}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                          size === sizeOption.value
                            ? isDark
                              ? 'bg-purple-600 text-white'
                              : 'bg-purple-500 text-white'
                            : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setSize(sizeOption.value as 'sm' | 'md' | 'lg')}
                      >
                        {sizeOption.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'default', label: 'Default' },
                      { value: 'spotify', label: 'Spotify' },
                      { value: 'youtube', label: 'YouTube' }
                    ].map((themeOption) => (
                      <button
                        key={themeOption.value}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                          theme === themeOption.value
                            ? isDark
                              ? 'bg-purple-600 text-white'
                              : 'bg-purple-500 text-white'
                            : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setTheme(themeOption.value as 'spotify' | 'youtube' | 'default')}
                      >
                        {themeOption.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showProgressText"
                    checked={showProgressText}
                    onChange={() => setShowProgressText(!showProgressText)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label
                    htmlFor="showProgressText"
                    className={`ml-2 block text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Show Progress Text
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFullScreen(true)}
              className={`w-full py-2.5 px-4 rounded-md font-medium transition-colors ${
                isDark
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              Show Fullscreen Preloader
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-lg text-sm ${
          isDark ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          <p>
            This preloader component can be integrated into your application to provide visual feedback during loading processes.
            Use the fullscreen mode for initial app loading, and the inline versions for component-specific loading states.
          </p>
        </div>
      </motion.div>

      {showFullScreen && (
        <div className="fixed inset-0 z-50">
          <Preloader
            size="lg"
            showProgressText={showProgressText}
            theme={theme}
          />
        </div>
      )}

      {showFullScreen && (
        <div className="fixed bottom-6 right-6 z-[60]">
          <button
            onClick={() => setShowFullScreen(false)}
            className="px-4 py-2 bg-white text-gray-800 rounded-md shadow-lg font-medium"
          >
            Close Fullscreen Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default PreloaderDemo; 