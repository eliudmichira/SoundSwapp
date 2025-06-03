import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../lib/ThemeContext';
import { cn } from '../../lib/utils';
import { getGlassmorphicStyles } from '../../lib/glassmorphic';
import GlassmorphicContainer from './GlassmorphicContainer';

// Simulates a loading process with different stages
const simulateLoading = (
  onProgress: (stage: string, percent: number) => void,
  onComplete: () => void,
  initialProgress: number = 0
) => {
  const stages = [
    { name: "Connecting APIs", duration: 600 },
    { name: "Fetching playlists", duration: 800 },
    { name: "Loading tracks", duration: 1000 },
    { name: "Preparing converter", duration: 600 }
  ];
  
  let currentStage = 0;
  let currentPercent = initialProgress;
  let interval: NodeJS.Timeout;
  
  // Determine which stage we're in based on initial progress
  if (initialProgress > 0) {
    if (initialProgress < 25) {
      currentStage = 0;
    } else if (initialProgress < 50) {
      currentStage = 1;
    } else if (initialProgress < 75) {
      currentStage = 2;
    } else {
      currentStage = 3;
    }
  }
  
  const updateProgress = () => {
    if (currentStage >= stages.length) {
      clearInterval(interval);
      onComplete();
      return;
    }
    
    const stage = stages[currentStage];
    
    if (currentPercent >= 100) {
      currentStage++;
      currentPercent = 0;
      
      if (currentStage < stages.length) {
        onProgress(stages[currentStage].name, 0);
      }
      return;
    }
    
    const increment = 100 / (stage.duration / 50); // Update every 50ms
    currentPercent = Math.min(100, currentPercent + increment);
    
    onProgress(stage.name, currentPercent);
  };
  
  interval = setInterval(updateProgress, 50);
  
  // Start with the first stage or continue from the current stage based on initialProgress
  onProgress(stages[currentStage].name, currentPercent);
  
  // Return cleanup function
  return () => clearInterval(interval);
};

interface PreloaderProps {
  onComplete?: () => void;
  initialDelay?: number;
  showProgressText?: boolean;
  theme?: 'spotify' | 'youtube' | 'default';
  customLogo?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  initialProgress?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  initialDelay = 500,
  showProgressText = true,
  theme = 'default',
  customLogo,
  size = 'md',
  initialProgress = 0,
}) => {
  const [visible, setVisible] = useState(true);
  const [currentStage, setCurrentStage] = useState("Initializing...");
  const [loadingProgress, setLoadingProgress] = useState(initialProgress);
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  const { isDark } = useTheme();
  
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      const cleanup = simulateLoading(
        (stage, percent) => {
          setCurrentStage(stage);
          setLoadingProgress(percent);
        },
        () => {
          setLoadingComplete(true);
          setCurrentStage("Ready!");
          setLoadingProgress(100);
          
          // Hide the preloader after a delay
          setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
          }, 800);
        },
        initialProgress
      );
      
      return cleanup;
    }, initialDelay);
    
    return () => clearTimeout(initialTimer);
  }, [initialDelay, onComplete, initialProgress]);
  
  // Get theme-specific colors
  const getThemeColors = () => {
    switch(theme) {
      case 'spotify':
        return {
          primary: '#1DB954',
          secondary: '#191414',
          glow: 'rgba(30, 215, 96, 0.3)',
          spinnerGradient: 'conic-gradient(from 90deg, #1DB954, #19141400)' // Spotify themed gradient
        };
      case 'youtube':
        return {
          primary: '#FF0000',
          secondary: '#282828',
          glow: 'rgba(255, 0, 0, 0.3)',
          spinnerGradient: 'conic-gradient(from 90deg, #FF0000, #28282800)' // YouTube themed gradient
        };
      default:
        return {
          primary: 'var(--brand-primary)', // Use CSS var
          secondary: 'var(--brand-secondary)', // Use CSS var
          glow: 'rgba(var(--brand-accent-pink-rgb), 0.4)', // Use CSS var
          spinnerGradient: 'conic-gradient(from 90deg, var(--brand-primary), var(--brand-accent-pink), var(--brand-secondary), var(--brand-primary-dark))' // SoundSwapp gradient
        };
    }
  };

  const themeColors = getThemeColors();
  const sizeConfig = getSizeConfig(size);
  
  // Glassmorphic styles for the preloader container
  const containerStyles = getGlassmorphicStyles({
    isDark,
    blurStrength: 12,
    bgOpacity: isDark ? 0.25 : 0.7,
    borderOpacity: 0.15
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className={cn(
              "absolute inset-0",
              isDark ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'
            )}
          ></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center p-8">
            {/* Logo and loader container */}
            <motion.div
              className={cn(
                "relative rounded-full overflow-hidden",
                sizeConfig.containerSize
              )}
              style={containerStyles}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2 
              }}
            >
              <GlassmorphicContainer 
                className="w-full h-full rounded-full" 
                rounded="full"
                shadow="lg"
              >
                {/* Animated spinner */}
                <motion.div
                  className={cn("absolute inset-0", 
                    loadingComplete ? "opacity-0" : "opacity-100"
                  )}
                  style={{
                    borderRadius: "50%",
                    border: `${sizeConfig.spinnerWidth}px solid transparent`,
                    // Split background shorthand into individual properties
                    backgroundColor: 'transparent', // Assuming the transparent part of the radial gradient is the base
                    backgroundImage: `radial-gradient(transparent ${sizeConfig.spinnerWidth*5}px, transparent ${sizeConfig.spinnerWidth*5}px), ${themeColors.spinnerGradient}`,
                    backgroundRepeat: 'no-repeat, no-repeat', // Adjust as needed for your gradients
                    backgroundPosition: 'center, center', // Adjust as needed
                    backgroundSize: 'cover, cover', // Adjust as needed
                    backgroundClip: 'padding-box, border-box',
                    backgroundOrigin: 'padding-box, border-box',
                    WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    WebkitMaskComposite: 'destination-out',
                    maskComposite: 'exclude',
                  }}
                  animate={{ 
                    rotate: 360,
                  }}
                  transition={{ 
                    duration: 1.5,
                    ease: "linear",
                    repeat: Infinity
                  }}
                />
                
                {/* Inner circle with the logo */}
                <GlassmorphicContainer
                  className={cn(
                    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center",
                    sizeConfig.innerCircleSize
                  )}
                  rounded="full"
                  shadow="sm"
                >
                  {/* Logo container - improved positioning */}
                  <div className="flex items-center justify-center w-full h-full">
                    {customLogo ? (
                      customLogo
                    ) : (
                      theme === 'spotify' ? (
                        <div className={cn("flex items-center justify-center", sizeConfig.logoContainerSize)}>
                          <svg viewBox="0 0 24 24" fill="currentColor" className="text-green-500 w-full h-full">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.36.12-.78-.12-.9-.48-.12-.36.12-.78.48-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.36 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.24-1.98-8.16-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </div>
                      ) : theme === 'youtube' ? (
                        <div className={cn("flex items-center justify-center", sizeConfig.logoContainerSize)}>
                          <svg viewBox="0 0 24 24" fill="currentColor" className="text-red-500 w-full h-full">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </div>
                      ) : (
                        <div className={cn("flex items-center justify-center", sizeConfig.logoContainerSize)}>
                          {/* New SoundSwapp Double S Logo - More Detailed */}
                          <svg viewBox="0 0 36 36" fill="currentColor" className="soundswapp-logo w-full h-full" 
                               style={{ 
                                animation: 'logoSpin 6s cubic-bezier(0.65, 0, 0.35, 1) infinite, logoPulse 3s ease-in-out infinite alternate' 
                               }}>
                            <defs>
                              <linearGradient id="preloader-soundswapp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="var(--brand-primary)" />
                                <stop offset="35%" stopColor="var(--brand-accent-pink)" />
                                <stop offset="100%" stopColor="var(--brand-secondary)" />
                              </linearGradient>
                              <filter id="preloader-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="1.8" result="blur" />
                                <feOffset dy="1" result="offsetBlur" />
                                <feMerge>
                                  <feMergeNode in="offsetBlur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                              <pattern id="preloader-bg-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                                <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                              </pattern>
                            </defs>
                            <circle cx="18" cy="18" r="18" fill="url(#preloader-soundswapp-grad)" opacity="0.9" />
                            <circle cx="18" cy="18" r="18" fill="url(#preloader-bg-pattern)" opacity="0.5"/>
                            
                            <g filter="url(#preloader-glow)" transform="translate(0.5, 0.5)">
                              <motion.path className="ss-letter-main" 
                                    d="M12.5 23.5 C10 23.5 8.5 21.5 9 19 C9.5 16.5 12.5 15.5 15 15.5 C17.5 15.5 19.5 14 19 11.5 C18.5 9 16.5 7.5 14 7.5" 
                                    stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                                    style={{ animation: 'pulseSSMain 2.8s ease-in-out infinite' }} />
                              <motion.path className="ss-letter-highlight" 
                                    d="M12.8 23 C10.5 23 9.3 21.3 9.7 19.2 C10.1 17.1 12.8 16.1 15 16.1 C17.2 16.1 18.8 14.7 18.4 12.5 C18.0 10.3 16.2 8.5 14 8.5"
                                    stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
                                    style={{ animation: 'pulseSSHighlight 2.8s ease-in-out infinite' }}/>
                              
                              <motion.path className="ss-letter-main" 
                                    d="M23.5 23.5 C26 23.5 27.5 21.5 27 19 C26.5 16.5 23.5 15.5 21 15.5 C18.5 15.5 16.5 14 17 11.5 C17.5 9 19.5 7.5 22 7.5"
                                    stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                                    style={{ animation: 'pulseSSMain 2.8s ease-in-out infinite 0.2s' }}/>
                              <motion.path className="ss-letter-highlight" 
                                    d="M23.2 23 C25.5 23 26.7 21.3 26.3 19.2 C25.9 17.1 23.2 16.1 21 16.1 C18.8 16.1 17.2 14.7 17.6 12.5 C18.0 10.3 19.8 8.5 22 8.5"
                                    stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
                                    style={{ animation: 'pulseSSHighlight 2.8s ease-in-out infinite 0.2s' }}/>
                            </g>
                          </svg>
                        </div>
                      )
                    )}
                  </div>
                </GlassmorphicContainer>
              </GlassmorphicContainer>
            </motion.div>
            
            {/* Progress indicator */}
            {showProgressText && (
              <motion.div 
                className="mt-8 max-w-md text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassmorphicContainer
                  className="px-6 py-4"
                  rounded="xl"
                  shadow="sm"
                  animate={false}
                >
                  <motion.div 
                    className={cn(
                      "font-medium mb-2 text-center",
                      isDark ? "text-white" : "text-gray-800"
                    )}
                    animate={{ opacity: loadingComplete ? 0.5 : 1 }}
                  >
                    {loadingComplete ? "Ready!" : currentStage}
                  </motion.div>
                  
                  <div className={`relative h-1 mt-5 rounded-full overflow-hidden ${sizeConfig.progressWidth} bg-white/10`}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: themeColors.primary }}
                      initial={{ width: `${initialProgress}%` }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ type: "tween" }}
                    />
                  </div>
                  
                  {/* Loading percentage */}
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <div>{Math.round(loadingProgress)}%</div>
                    <div>100%</div>
                  </div>
                  
                  {/* Loading dots animation */}
                  {!loadingComplete && (
                    <div className="flex justify-center mt-4 space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-white/50' : 'bg-gray-500/50'}`}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </GlassmorphicContainer>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper to get size configuration based on size prop
function getSizeConfig(size: string) {
  switch(size) {
    case 'sm':
      return {
        containerSize: 'w-24 h-24',
        innerCircleSize: 'w-16 h-16',
        logoContainerSize: 'w-7 h-7',
        spinnerWidth: 3,
        progressWidth: 'w-48'
      };
    case 'lg':
      return {
        containerSize: 'w-40 h-40',
        innerCircleSize: 'w-28 h-28',
        logoContainerSize: 'w-12 h-12',
        spinnerWidth: 5,
        progressWidth: 'w-80'
      };
    default: // 'md'
      return {
        containerSize: 'w-32 h-32',
        innerCircleSize: 'w-20 h-20',
        logoContainerSize: 'w-9 h-9',
        spinnerWidth: 4,
        progressWidth: 'w-64'
      };
  }
}

export default Preloader;