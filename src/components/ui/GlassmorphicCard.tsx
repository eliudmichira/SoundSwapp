import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';
// import { getGlassmorphicStyles, getGlassmorphicHoverStyles } from '../../lib/glassmorphic'; // Assuming this is not used anymore or integrated

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  blurStrength?: number;
  borderOpacity?: number; // Potentially deprecated if border is fully CSS var controlled
  bgOpacity?: number; // Potentially deprecated if bg is fully CSS var controlled
  hoverScale?: number;
  gradientOverlay?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  variant?: 'default' | 'primary' | 'secondary' | 'vibrant' | 'spotify' | 'youtube';
  magneticEffect?: boolean;
  glowIntensity?: 'none' | 'low' | 'medium' | 'high';
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className,
  blurStrength = 10,
  // borderOpacity = 0.2, // Deprecated by CSS vars
  // bgOpacity = 0.2, // Deprecated by CSS vars
  hoverScale = 1.02,
  gradientOverlay = false,
  rounded = 'xl',
  variant = 'default',
  magneticEffect = false,
  glowIntensity = 'none'
}) => {
  const { isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      if (mobile) {
        document.documentElement.classList.add('has-glassmorphic-cards-mobile'); // More specific class for mobile cards
      } else {
        document.documentElement.classList.remove('has-glassmorphic-cards-mobile');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getGradientByVariant = () => {
    switch (variant) {
      case 'primary':
        return 'linear-gradient(135deg, hsl(var(--brand-primary-light)), hsl(var(--brand-primary)), hsl(var(--brand-primary-dark)))';
      case 'secondary':
        return 'linear-gradient(135deg, hsl(var(--brand-secondary-light)), hsl(var(--brand-secondary)), hsl(var(--brand-secondary-dark)))';
      case 'vibrant':
        return 'var(--brand-gradient-vibrant)';
      case 'spotify':
        return 'linear-gradient(135deg, hsl(var(--brand-accent-green)), hsl(var(--brand-accent-green) / 0.8), hsl(var(--brand-accent-green) / 0.6))'; // Example with HSL
      case 'youtube':
        return 'linear-gradient(135deg, hsl(var(--youtube-base-color-hsl)), hsl(var(--youtube-base-color-hsl) / 0.8), hsl(var(--youtube-base-color-hsl) / 0.6))'; // Example with HSL
      default:
        return isDark
          ? 'var(--default-card-gradient-dark)' 
          : 'var(--default-card-gradient-light)';
    }
  };

  const getGlowColorForVariant = () => { // Renamed to avoid conflict with a potential CSS var
    switch (variant) {
      case 'primary':
        return 'hsl(var(--button-primary-glow))';
      case 'secondary':
        return 'hsl(var(--button-secondary-glow))';
      case 'vibrant':
        return 'hsl(var(--brand-accent-yellow))';
      case 'spotify':
        return 'var(--spotify-glow-color)';
      case 'youtube':
        return 'var(--youtube-glow-color)';
      default:
        return isDark ? 'var(--surface-glow-color-dark)' : 'var(--surface-glow-color-light)';
    }
  };

  const getShadowByGlowIntensity = () => {
    if (glowIntensity === 'none') return '';
    
    const color = getGlowColorForVariant();
    
    // Enhanced glow effects for dark theme
    if (isDark) {
      const intensityMap = {
        high: `0 0 30px ${color}, 0 0 15px ${color}80`,  // Double glow with opacity variation
        medium: `0 0 20px ${color}, 0 0 10px ${color}60`, // Double glow with opacity variation
        low: `0 0 12px ${color}80`, // Single subtle glow
      };
      return intensityMap[glowIntensity];
    } else {
      // Light theme uses more subtle glow
      const intensityMap = {
        high: '0 0 25px',
        medium: '0 0 15px',
        low: '0 0 8px',
      };
      return `${intensityMap[glowIntensity]} ${color}`;
    }
  };

  // Mobile styles prioritize performance and use simpler variable-based styling
  const cardStyles: React.CSSProperties = isMobile ? {
    backgroundColor: 'hsl(var(--surface-card))',
    boxShadow: 'var(--shadow-elevation-medium)',
    padding: '16px',
    margin: '0',
    borderRadius: '12px',
    border: '1px solid hsl(var(--border-default))',
    overflow: 'hidden', // Ensure content respects border radius
  } : {
    // Apply backdrop filter based on theme and variant
    backdropFilter: variant === 'default' && !isDark ? 'none' : `blur(${blurStrength}px)`,
    WebkitBackdropFilter: variant === 'default' && !isDark ? 'none' : `blur(${blurStrength}px)`,
    // For default variant in dark theme, use a transparent background to allow className styling to take effect
    // For default variant in light theme, use surface-card for opacity
    // For all other variants, use surface-glass
    backgroundColor: variant === 'default' 
      ? !isDark 
        ? 'var(--surface-card)' 
        : 'transparent' // Allow bg color from className to show in dark theme
      : 'var(--surface-glass)',
    // Similar approach for border
    border: variant === 'default'
      ? !isDark
        ? '1px solid var(--border-default)'
        : '1px solid var(--surface-glass-border-dark, rgba(255,255,255,0.08))' // Fall back to a more visible border
      : '1px solid var(--surface-glass-border)',
    borderRadius: rounded === 'full' ? '9999px' : `var(--radius-${rounded}, 0.75rem)`,
    boxShadow: getShadowByGlowIntensity() || 'var(--shadow-elevation-low)',
    overflow: 'hidden',
    position: 'relative',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magneticEffect || isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePosition({ x, y });
  };
  
  const roundedClass = `rounded-${rounded}`;

  return (
    <motion.div
      className={cn(
        roundedClass, 
        "overflow-hidden relative glassmorphic-card", // glassmorphic-card class for potential global mobile overrides
        className
      )}
      style={cardStyles}
      whileHover={!isMobile ? {
        scale: hoverScale,
        boxShadow: glowIntensity !== 'none' ? getShadowByGlowIntensity() : 'var(--shadow-elevation-medium)',
        // rotateX: magneticEffect ? -mousePosition.y * 5 : 0, // Simplified, direct transform is better for perf
        // rotateY: magneticEffect ? mousePosition.x * 5 : 0,
      } : {}}
      animate={magneticEffect && isHovered && !isMobile ? {
        transform: `perspective(1000px) rotateX(${-mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
      } : {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      }}
      transition={{
        type: "spring",
        stiffness: magneticEffect ? 150 : 300,
        damping: magneticEffect ? 15 : 20,
        scale: { duration: 0.2 },
      }}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        if (magneticEffect) setMousePosition({ x: 0, y: 0 }); // Reset on hover end
      }}
    >
      {gradientOverlay && !isMobile && (
        <motion.div 
          className="absolute inset-0 opacity-20 pointer-events-none -z-10" // Ensure it's behind content
          style={{
            background: getGradientByVariant(),
            mixBlendMode: 'overlay'
          }}
          animate={{ opacity: isHovered && variant !== 'default' ? 0.35 : 0.15 }} // Adjusted opacities
          transition={{ duration: 0.3 }}
        />
      )}
      
      {!isMobile && (variant === 'primary' || variant === 'secondary' || variant === 'vibrant') && (
        <motion.div 
          className="absolute inset-0 pointer-events-none -z-10" // Ensure it's behind content
          style={{
            background: 'linear-gradient(45deg, transparent 40%, var(--surface-shine-color, rgba(255,255,255,0.1)) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: isHovered ? ['0% 0%', '200% 0%'] : '0% 0%'}}
          transition={{ duration: isHovered ? 0.8 : 0, ease: "easeOut" }}
        />
      )}
      
      <div className={cn("relative z-0", {
        "p-4 md:p-6": true // Default padding, can be overridden by className
      })}>
        {children}
      </div>
    </motion.div>
  );
}; 