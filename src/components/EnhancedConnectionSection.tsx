import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import { useServiceConnections } from '../lib/hooks/useServiceConnections';
import { initSpotifyAuth } from '../lib/spotifyAuth';
import { signInWithGoogle } from '../lib/firebase';
import { Loader2 } from 'lucide-react';
import { ServiceConnectionCard } from './ServiceConnectionCard';

interface ServiceItem {
  icon: string;
  color: string;
  label: string;
}

interface Step {
  icon: string;
  label: string;
}

interface FlippedState {
  spotify: boolean;
  youtube: boolean;
}

const EnhancedConnectionSection = () => {
  // Auth and connection states
  const { 
    user,
    hasSpotifyAuth,
    hasYouTubeAuth,
    spotifyUserProfile,
    youtubeUserProfile,
    signOut
  } = useAuth();

  const {
    refreshConnections,
    isRefreshing,
    lastRefresh,
    error: connectionError
  } = useServiceConnections();

  // UI states
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCard, setActiveCard] = useState<null | string>(null);
  const [isFlipped, setIsFlipped] = useState<FlippedState>({ spotify: false, youtube: false });
  const [showRipple, setShowRipple] = useState<false | { x: number; y: number; timestamp?: number }>(false);
  const [dockHoverIndex, setDockHoverIndex] = useState<number | null>(null);
  const [isFlowerMenuOpen, setIsFlowerMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isConnecting, setIsConnecting] = useState({ spotify: false, youtube: false });
  
    // No refs needed for simplified version  
      // No animation effects in this version

  // Handle icon ripple effect
  const handleIconRipple = (e: React.MouseEvent) => {
    setShowRipple({ x: 10, y: 10, timestamp: Date.now() });
    setTimeout(() => setShowRipple(false), 800);
  };

  // Handle card flip
  const handleCardFlip = (platform: keyof FlippedState) => {
    setIsFlipped(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  // Steps for the dock navigation
  const steps: Step[] = [
    { icon: "settings", label: "Select Source" },
    { icon: "upload", label: "Import Playlist" },
    { icon: "list", label: "Review Tracks" },
    { icon: "download", label: "Export Playlist" }
  ];

  // Service items for flower menu
  const serviceItems: ServiceItem[] = [
    { icon: "apple", color: "bg-gray-800", label: "Apple Music" },
    { icon: "deezer", color: "bg-purple-600", label: "Deezer" },
    { icon: "amazon", color: "bg-blue-600", label: "Amazon Music" },
    { icon: "tidal", color: "bg-blue-800", label: "Tidal" },
    { icon: "soundcloud", color: "bg-orange-500", label: "SoundCloud" }
  ];

  // Handle Spotify connection
  const handleSpotifyConnect = async () => {
    try {
      setIsConnecting(prev => ({ ...prev, spotify: true }));
      initSpotifyAuth();
    } catch (error) {
      console.error('Failed to connect to Spotify:', error);
    } finally {
      setIsConnecting(prev => ({ ...prev, spotify: false }));
    }
  };

  // Handle YouTube connection
  const handleYouTubeConnect = async () => {
    try {
      setIsConnecting(prev => ({ ...prev, youtube: true }));
      await signInWithGoogle();
      await refreshConnections(); // Refresh connections after YouTube auth
    } catch (error) {
      console.error('Failed to connect to YouTube:', error);
    } finally {
      setIsConnecting(prev => ({ ...prev, youtube: false }));
    }
  };

  // Handle manual refresh
  const handleManualRefresh = async () => {
    try {
      await refreshConnections();
    } catch (error) {
      console.error('Failed to refresh connections:', error);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 ${isDarkMode ? 'bg-transparent' : 'bg-gray-50'}`}>
      {/* Theme toggle */}
      <motion.div 
        className="absolute top-4 right-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800/30 backdrop-blur-md text-yellow-400 border border-white/5' : 'bg-white text-gray-800 shadow-md'}`}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </motion.div>

      {/* Section title */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-accent-pink to-brand-secondary">
            Connect Your Music Accounts
          </span>
        </h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Sign in to both platforms to easily convert playlists between services
        </p>
      </motion.div>

      {/* Main container */}
      <motion.div 
        className="w-full max-w-3xl mx-auto relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Main container with glass effect */}
        <motion.div
          className="relative rounded-2xl overflow-hidden backdrop-blur-lg p-6"
          style={{
            background: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
          }}
          whileHover={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)' }}
        >
          {/* Background glow effects */}
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-30 filter blur-3xl pointer-events-none" 
            style={{ background: 'linear-gradient(135deg, rgba(255, 122, 89, 0.2), rgba(255, 0, 122, 0.2))' }}
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-20 filter blur-3xl pointer-events-none" 
            style={{ background: 'linear-gradient(135deg, rgba(255, 0, 122, 0.2), rgba(0, 196, 204, 0.2))' }}
            animate={{
              opacity: [0.15, 0.25, 0.15],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Additional ambient gradient elements */}
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 filter blur-3xl pointer-events-none"
            style={{ background: 'linear-gradient(45deg, rgba(0, 196, 204, 0.15), rgba(255, 122, 89, 0.1))' }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [0.9, 1.05, 0.9],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute bottom-10 right-20 w-56 h-56 rounded-full opacity-15 filter blur-3xl pointer-events-none"
            style={{ background: 'linear-gradient(225deg, rgba(255, 0, 122, 0.15), rgba(0, 196, 204, 0.1))' }}
            animate={{
              opacity: [0.1, 0.18, 0.1],
              scale: [0.95, 1.1, 0.95],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />

            {/* User profile */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
                <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg mr-3 border-2 border-white/10"
                whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  M
                </motion.div>
                <div>
                  <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mich Michira</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>eliudsamwels7@gmail.com</p>
                </div>
            </motion.div>
            
              <div className="flex items-center">
                {/* Sign out button */}
                <motion.button 
                className={`px-4 py-1.5 rounded-full text-sm bg-black/20 text-white border border-white/10 backdrop-blur-md mr-3`}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
              
              {/* Add services button */}
              <div className="relative">
                  <motion.button
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg relative overflow-hidden"
                    onClick={(event) => {
                    setIsFlowerMenuOpen(!isFlowerMenuOpen);
                      handleIconRipple(event);
                    }}
                  whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}
                  whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                      d={isFlowerMenuOpen ? "M6 18L18 6M6 6l12 12" : "M12 6v12M6 12h12"} 
                      />
                    </svg>
                  
                    {/* Ripple effect */}
                    {showRipple && (
                      <motion.div
                      className="absolute rounded-full bg-white"
                      initial={{ width: 0, height: 0, opacity: 0.5 }}
                      animate={{ width: 80, height: 80, opacity: 0 }}
                      exit={{ width: 0, height: 0, opacity: 0 }}
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </motion.button>
                
                  {/* Flower menu */}
                    {isFlowerMenuOpen && (
                      <div className="absolute top-0 left-0 z-20">
                        {serviceItems.map((item, index) => {
                          const angle = index * (360 / serviceItems.length);
                          const radian = (angle * Math.PI) / 180;
                          const distance = 70;
                          const x = Math.cos(radian) * distance;
                          const y = Math.sin(radian) * distance;
                      
                          return (
                            <motion.div
                              key={item.label}
                              className={`absolute w-10 h-10 rounded-full ${item.color} shadow-lg flex items-center justify-center text-white cursor-pointer`}
                          style={{
                            transform: `translate(${x}px, ${y}px)`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.05
                          }}
                          whileHover={{ scale: 1.2, boxShadow: '0 0 12px rgba(255, 255, 255, 0.3)' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {/* Service icon */}
                          {item.icon === "apple" && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                            </svg>
                          )}
                          {/* Other icons would go here */}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
              </div>
            </div>
          </div>
          
          {/* Connection cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 relative z-10">
            {/* Spotify Card */}
            <ServiceConnectionCard
              service="spotify"
              isConnected={hasSpotifyAuth}
              isConnecting={isConnecting.spotify}
              userProfile={spotifyUserProfile ? {
                displayName: spotifyUserProfile.displayName,
                imageUrl: spotifyUserProfile.imageUrl
              } : undefined}
              onConnect={handleSpotifyConnect}
            />
            
            {/* YouTube Card */}
            <ServiceConnectionCard
              service="youtube"
              isConnected={hasYouTubeAuth}
              isConnecting={isConnecting.youtube}
              userProfile={youtubeUserProfile ? {
                displayName: youtubeUserProfile.displayName,
                imageUrl: youtubeUserProfile.imageUrl
              } : undefined}
              onConnect={handleYouTubeConnect}
            />
          </div>
        </motion.div>
        
        {/* Enhanced Dock Navigation */}
        <motion.div
          className="relative z-10 mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            className="rounded-full p-4 bg-gray-900/40 backdrop-blur-lg border border-gray-800/50"
            whileHover={{ boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25)' }}
          >
            <div className="flex items-center gap-8">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.label} 
                  className="relative"
                  onHoverStart={() => setDockHoverIndex(index)}
                  onHoverEnd={() => setDockHoverIndex(null)}
                  animate={{ scale: dockHoverIndex === index ? 1.1 : 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`p-4 rounded-full flex items-center justify-center ${
                      activeStep === index 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-gray-400'
                    }`}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: activeStep === index 
                        ? '0 0 15px rgba(139, 92, 246, 0.5)' 
                        : 'none'
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {step.icon === "settings" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      )}
                      {step.icon === "upload" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      )}
                      {step.icon === "list" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      )}
                      {step.icon === "download" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      )}
                    </svg>
                  </motion.div>
                  
                  <AnimatePresence>
                    {activeStep === index && (
                      <motion.div 
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs"
                    animate={{ 
                      color: activeStep === index ? '#fff' : 'rgb(156, 163, 175)'
                    }}
                  >
                    {step.label}
                  </motion.div>
                </motion.div>
              ))}
      </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Source Selection Dialog */}
      <motion.div 
        className="mt-8 p-6 rounded-xl backdrop-blur-lg border border-gray-700/30 max-w-3xl w-full"
        style={{
          background: 'rgba(15, 23, 42, 0.3)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {/* ... existing code ... */}
      </motion.div>

      {/* Connection status indicator */}
      {isRefreshing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/10"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Refreshing connections...</span>
        </motion.div>
      )}

      {/* Connection error indicator */}
      {connectionError && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-red-500/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/10"
        >
          <span className="text-sm">{connectionError}</span>
        </motion.div>
      )}

      {/* Manual refresh button */}
      <motion.button
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {isRefreshing ? 'Refreshing...' : 'Refresh Connections'}
      </motion.button>

      {/* Last refresh time */}
      {lastRefresh && (
        <p className="mt-2 text-sm text-white/50">
          Last refreshed: {lastRefresh.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default EnhancedConnectionSection;