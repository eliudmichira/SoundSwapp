// Performance configuration for SoundSwapp
export interface PerformanceConfig {
  // Animation settings
  enableParticleAnimations: boolean;
  enableComplexAnimations: boolean;
  enableMouseInteractions: boolean;
  enableParallaxEffects: boolean;
  
  // Performance thresholds
  maxParticleCount: number;
  maxAnimationFPS: number;
  throttleMouseEvents: boolean;
  
  // Device-specific optimizations
  reduceMotion: boolean;
  lowPowerMode: boolean;
  mobileOptimizations: boolean;
}

// Detect device capabilities
const detectDeviceCapabilities = (): Partial<PerformanceConfig> => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowPower = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : true;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSlowConnection = (navigator as any).connection?.effectiveType === 'slow-2g' || 
                          (navigator as any).connection?.effectiveType === '2g';
  
  return {
    mobileOptimizations: isMobile,
    lowPowerMode: isLowPower || isSlowConnection,
    reduceMotion: prefersReducedMotion,
    enableMouseInteractions: !isMobile,
    enableParallaxEffects: !isMobile && !prefersReducedMotion,
    maxParticleCount: isMobile ? 20 : isLowPower ? 30 : 50,
    maxAnimationFPS: isMobile ? 30 : 60,
    throttleMouseEvents: isMobile || isLowPower
  };
};

// Default performance configuration
export const defaultPerformanceConfig: PerformanceConfig = {
  enableParticleAnimations: true,
  enableComplexAnimations: true,
  enableMouseInteractions: true,
  enableParallaxEffects: true,
  maxParticleCount: 50,
  maxAnimationFPS: 60,
  throttleMouseEvents: false,
  reduceMotion: false,
  lowPowerMode: false,
  mobileOptimizations: false
};

// Get optimized configuration based on device capabilities
export const getOptimizedPerformanceConfig = (): PerformanceConfig => {
  const deviceCapabilities = detectDeviceCapabilities();
  
  return {
    ...defaultPerformanceConfig,
    ...deviceCapabilities,
    enableParticleAnimations: !deviceCapabilities.reduceMotion && !deviceCapabilities.lowPowerMode,
    enableComplexAnimations: !deviceCapabilities.reduceMotion && !deviceCapabilities.mobileOptimizations,
    maxParticleCount: deviceCapabilities.maxParticleCount || defaultPerformanceConfig.maxParticleCount,
    maxAnimationFPS: deviceCapabilities.maxAnimationFPS || defaultPerformanceConfig.maxAnimationFPS,
    throttleMouseEvents: deviceCapabilities.throttleMouseEvents || false
  };
};

// Animation presets for different performance levels
export const animationPresets = {
  high: {
    particleCount: 50,
    animationFPS: 60,
    enableComplexEffects: true,
    enableMouseInteractions: true,
    throttleEvents: false
  },
  medium: {
    particleCount: 30,
    animationFPS: 45,
    enableComplexEffects: true,
    enableMouseInteractions: true,
    throttleEvents: true
  },
  low: {
    particleCount: 15,
    animationFPS: 30,
    enableComplexEffects: false,
    enableMouseInteractions: false,
    throttleEvents: true
  },
  minimal: {
    particleCount: 0,
    animationFPS: 0,
    enableComplexEffects: false,
    enableMouseInteractions: false,
    throttleEvents: true
  }
};

// Performance monitoring utilities
export const performanceUtils = {
  // Measure frame rate
  measureFPS: (callback: (fps: number) => void) => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        callback(fps);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFrame);
    };
    
    requestAnimationFrame(countFrame);
  },
  
  // Check if device can handle animations smoothly
  canHandleAnimations: (): boolean => {
    const config = getOptimizedPerformanceConfig();
    return config.enableParticleAnimations && !config.reduceMotion;
  },
  
  // Get recommended animation settings
  getRecommendedSettings: () => {
    const config = getOptimizedPerformanceConfig();
    
    if (config.lowPowerMode || config.reduceMotion) {
      return animationPresets.minimal;
    } else if (config.mobileOptimizations) {
      return animationPresets.low;
    } else if (config.maxAnimationFPS < 45) {
      return animationPresets.medium;
    } else {
      return animationPresets.high;
    }
  }
};

// Export current configuration
export const currentPerformanceConfig = getOptimizedPerformanceConfig(); 