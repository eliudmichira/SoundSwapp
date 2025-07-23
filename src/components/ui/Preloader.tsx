import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { getGlassmorphicStyles } from '../../lib/glassmorphic';
import { cn } from '../../lib/utils';
import GlassmorphicContainer from './GlassmorphicContainer';
import SoundSwappLogo from '../../assets/SoundSwappLogo';

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

  // Safely use theme context with fallback - don't use useTheme hook
  // Instead, check for system dark mode preference
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

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
                        theme === 'youtube' ? (
                          <div className={cn("flex items-center justify-center", sizeConfig.logoContainerSize)}>
                            <img
                              src="/images/yt_logo_rgb_dark.png"
                              alt="YouTube"
                              style={{ height: 32, minHeight: 20, maxHeight: 40, width: 'auto', objectFit: 'contain', display: 'block' }}
                            />
                          </div>
                        ) : (
                          <SoundSwappLogo width={parseInt(sizeConfig.logoContainerSize.replace('w-', '').replace('h-', ''))} height={parseInt(sizeConfig.logoContainerSize.replace('w-', '').replace('h-', ''))} />
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