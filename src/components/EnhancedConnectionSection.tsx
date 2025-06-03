import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  // State management
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCard, setActiveCard] = useState<null | string>(null);
  const [isFlipped, setIsFlipped] = useState<FlippedState>({ spotify: false, youtube: false });
  const [showRipple, setShowRipple] = useState<false | { x: number; y: number; timestamp?: number }>(false);
  const [dockHoverIndex, setDockHoverIndex] = useState<number | null>(null);
  const [isFlowerMenuOpen, setIsFlowerMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
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
            <motion.div 
              className="h-56"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className="w-full h-full relative cursor-pointer rounded-xl overflow-hidden"
                onClick={() => handleCardFlip('spotify')}
                style={{
                  transform: isFlipped.spotify ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s',
                }}
              >
                {/* Front side */}
                <div 
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <div 
                    className="h-full p-5 relative overflow-hidden" 
                    style={{
                      background: isDarkMode ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Card shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                      style={{ 
                        skewX: '20deg',
                        transform: 'translateX(-100%)'
                      }}
                      animate={{
                        x: ['-100%', '200%'],
                        opacity: [0, 0, 0.3, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 4
                      }}
                    />
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mr-3">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.36.12-.78-.12-.9-.48-.12-.36.12-.78.48-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.36 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.24-1.98-8.16-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Spotify</h3>
                        <div className="flex items-center">
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-green-500 mr-2"
                            animate={{
                              boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 6px rgba(34, 197, 94, 0)"],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                          />
                          <span className="text-gray-300">Connected</span>
                        </div>
                      </div>
                      <div className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-black/20">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <button
                      className="w-full py-3 rounded-lg font-medium text-white mt-2 relative overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(to right, #1DB954, #1ed760)' 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Reconnect logic would go here
                      }}
                    >
                      <span className="relative z-10">Reconnect</span>
                    </button>
                    
                    <p className="mt-4 text-xs text-gray-400 text-center flex items-center justify-center">
                      <motion.span
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Click card to see account details
                        <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                      </motion.span>
                    </p>
                  </div>
                </div>
                
                {/* Back side */}
                <div 
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div 
                    className="h-full p-5 relative overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                    style={{
                      background: isDarkMode ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Card shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                      style={{ 
                        skewX: '20deg',
                        transform: 'translateX(-100%)'
                      }}
                      animate={{
                        x: ['-100%', '200%'],
                        opacity: [0, 0, 0.3, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 4
                      }}
                    />
                    <div className="absolute top-0 right-0 left-0 h-20 bg-gradient-to-b from-green-500/10 to-transparent opacity-50 pointer-events-none" />
                  
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mr-3">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.36.12-.78-.12-.9-.48-.12-.36.12-.78.48-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.36 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.24-1.98-8.16-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Account Details</h3>
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                          <span className="text-green-400 text-xs">Verified</span>
                        </div>
                      </div>
                      <motion.div 
                        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardFlip('spotify');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.div>
                    </div>
                    
                    {/* User info section */}
                    <div className="bg-black/20 p-2 rounded-lg mb-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-gray-400">Username</div>
                          <div className="text-sm text-white font-medium">mich_michira</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Plan Type</div>
                          <div className="text-sm text-white font-medium flex items-center">
                            Premium
                            <span className="ml-1 bg-green-500 text-white text-xs px-1 rounded-sm">PRO</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Followers</div>
                          <div className="text-sm text-white font-medium">243</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Following</div>
                          <div className="text-sm text-white font-medium">127</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subscription info */}
                    <div className="bg-black/20 p-2 rounded-lg mb-2">
                      <div className="text-xs text-gray-300 mb-1 flex justify-between">
                        <span>Premium Subscription</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <span>Renews on May 18, 2025</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-500 mx-1.5"></span>
                        <span className="text-green-400">$9.99/month</span>
                      </div>
                    </div>
                    
                    {/* Recent playlists */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-300 mb-1.5">Recently Played</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center bg-black/20 p-1.5 rounded-md">
                          <div className="w-8 h-8 bg-purple-800 rounded-md flex items-center justify-center mr-2 text-xs">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-medium truncate">Workout Mix 2025</div>
                            <div className="text-gray-400 text-xs truncate">32 songs • 2h 17m</div>
                          </div>
                          <div className="ml-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex items-center bg-black/20 p-1.5 rounded-md">
                          <div className="w-8 h-8 bg-blue-800 rounded-md flex items-center justify-center mr-2 text-xs">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-medium truncate">Chill Vibes 2025</div>
                            <div className="text-gray-400 text-xs truncate">48 songs • 3h 22m</div>
                          </div>
                          <div className="ml-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connected devices */}
                    <div className="mt-3 text-xs text-gray-300">
                      <div className="mb-1.5">Connected Devices</div>
                      <div className="text-xs flex items-center text-gray-400 mb-1">
                        <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                        </svg>
                        <span>iPhone 15 Pro</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-green-500 ml-1.5 mr-1"></span>
                        <span className="text-green-400">Current</span>
                      </div>
                      <div className="text-xs flex items-center text-gray-400">
                        <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                        </svg>
                        <span>MacBook Pro</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-500 ml-1.5 mr-1"></span>
                        <span>Last active: 2h ago</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Account Health</span>
                        <span className="text-xs text-green-400">Excellent</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-500"
                          style={{ width: '95%' }}
                        />
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-full py-1.5 text-xs">
                        Sync Playlists
                      </button>
                      <button className="flex-1 bg-gray-700 hover:bg-gray-600 transition-colors text-white rounded-full py-1.5 text-xs">
                        Manage Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* YouTube Card */}
            <motion.div 
              className="h-56"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className="w-full h-full relative cursor-pointer rounded-xl overflow-hidden"
                onClick={() => handleCardFlip('youtube')}
                style={{
                  transform: isFlipped.youtube ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s',
                }}
              >
                {/* Front side */}
                <div 
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <div 
                    className="h-full p-5 relative overflow-hidden" 
                    style={{
                      background: isDarkMode ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Card shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                      style={{ 
                        skewX: '20deg',
                        transform: 'translateX(-100%)'
                      }}
                      animate={{
                        x: ['-100%', '200%'],
                        opacity: [0, 0, 0.3, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 6
                      }}
                    />
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg mr-3">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">YouTube</h3>
                        <div className="flex items-center">
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-red-500 mr-2"
                            animate={{
                              boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.4)", "0 0 0 6px rgba(239, 68, 68, 0)"],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                          />
                          <span className="text-gray-300">Connected</span>
                        </div>
                      </div>
                      <div className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-black/20">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <button
                      className="w-full py-3 rounded-lg font-medium text-white mt-2 relative overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(to right, #FF0000, #FF4500)' 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Reconnect logic would go here
                      }}
                    >
                      <span className="relative z-10">Reconnect</span>
                    </button>
                    
                    <p className="mt-4 text-xs text-gray-400 text-center flex items-center justify-center">
                      <motion.span
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Click card to see account details
                        <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                      </motion.span>
                    </p>
                  </div>
                </div>
                
                {/* Back side */}
                <div 
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div 
                    className="h-full p-5 relative overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                    style={{
                      background: isDarkMode ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Card shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                      style={{ 
                        skewX: '20deg',
                        transform: 'translateX(-100%)'
                      }}
                      animate={{
                        x: ['-100%', '200%'],
                        opacity: [0, 0, 0.3, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 6
                      }}
                    />
                    <div className="absolute top-0 right-0 left-0 h-20 bg-gradient-to-b from-red-500/10 to-transparent opacity-50 pointer-events-none" />
                  
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg mr-3">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Account Details</h3>
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
                          <span className="text-red-400 text-xs">Content Creator</span>
                        </div>
                      </div>
                      <motion.div 
                        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardFlip('youtube');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.div>
                    </div>
                    
                    {/* Channel info section */}
                    <div className="bg-black/20 p-2 rounded-lg mb-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-gray-400">Channel</div>
                          <div className="text-sm text-white font-medium">MichMusic</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Email</div>
                          <div className="text-sm text-white font-medium truncate">eliudsamwels7@gmail.com</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Subscribers</div>
                          <div className="text-sm text-white font-medium">1.2K</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Total Views</div>
                          <div className="text-sm text-white font-medium">47.8K</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Channel stats */}
                    <div className="bg-black/20 p-2 rounded-lg mb-2">
                      <div className="text-xs text-gray-300 mb-1 flex justify-between">
                        <span>Channel Statistics</span>
                        <span className="text-xs text-white px-1.5 py-0.5 bg-red-600 rounded-sm">MUSIC</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <div className="text-center">
                          <div className="text-white text-sm font-medium">16</div>
                          <div className="text-gray-400 text-xs">Playlists</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white text-sm font-medium">187</div>
                          <div className="text-gray-400 text-xs">Videos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white text-sm font-medium">32</div>
                          <div className="text-gray-400 text-xs">Likes</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent playlists */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-300 mb-1.5">Recent Playlists</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center bg-black/20 p-1.5 rounded-md">
                          <div className="w-8 h-8 bg-red-900 rounded-md flex items-center justify-center mr-2 text-xs relative overflow-hidden">
                            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                            <svg className="w-4 h-4 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10 8l6 4-6 4V8z"/>
                              <path d="M21 19H3c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2zm0-12H3v10h18V7z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-medium truncate">Top Hits 2025 Mix</div>
                            <div className="text-gray-400 text-xs truncate">24 videos • 2.7K views</div>
                          </div>
                          <div className="ml-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex items-center bg-black/20 p-1.5 rounded-md">
                          <div className="w-8 h-8 bg-red-900 rounded-md flex items-center justify-center mr-2 text-xs relative overflow-hidden">
                            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                            <svg className="w-4 h-4 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M10 8l6 4-6 4V8z"/>
                              <path d="M21 19H3c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2zm0-12H3v10h18V7z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-medium truncate">Lo-Fi Beats for Study</div>
                            <div className="text-gray-400 text-xs truncate">18 videos • 1.3K views</div>
                          </div>
                          <div className="ml-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Activity stats */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-300 mb-1.5">Recent Activity</div>
                      <div className="bg-black/20 p-2 rounded-lg">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-400">Last upload</span>
                          <span className="text-xs text-white">3 days ago</span>
                        </div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-400">Last comment</span>
                          <span className="text-xs text-white">Yesterday</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Watch time (30 days)</span>
                          <span className="text-xs text-white">143 hours</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Account Health</span>
                        <span className="text-xs text-green-400">Good</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-400"
                          style={{ width: '85%' }}
                        />
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-red-600 hover:bg-red-700 transition-colors text-white rounded-full py-1.5 text-xs">
                        Sync Playlists
                      </button>
                      <button className="flex-1 bg-gray-700 hover:bg-gray-600 transition-colors text-white rounded-full py-1.5 text-xs">
                        Studio Dashboard
                      </button>
                    </div>
                </div>
              </div>
            </div>
            </motion.div>
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
    </div>
  );
};

export default EnhancedConnectionSection;