import { cn } from './utils';

/**
 * Glassmorphic styling utility to ensure consistent styling across the application
 */

export interface GlassmorphicStyleProps {
  isDark?: boolean;
  blurStrength?: number;
  borderOpacity?: number;
  bgOpacity?: number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';
}

/**
 * Returns consistent glassmorphic styles as a className string
 */
export const getGlassmorphicClasses = ({
  isDark = false,
  rounded = '2xl',
  shadow = 'lg',
}: Pick<GlassmorphicStyleProps, 'isDark' | 'rounded' | 'shadow'>) => {
  return cn(
    `rounded-${rounded} overflow-hidden relative backdrop-blur-md`,
    shadow !== 'none' && shadow !== 'inner' && `shadow-${shadow}`,
    shadow === 'inner' && 'shadow-inner',
    isDark 
      ? "bg-gray-900/40 border border-gray-700/50" 
      : "bg-white/70 border border-gray-200"
  );
};

/**
 * Returns inline styles for glassmorphic elements
 */
export const getGlassmorphicStyles = ({
  isDark = false,
  blurStrength = 10,
  borderOpacity = 0.2,
  bgOpacity = 0.2,
}: Omit<GlassmorphicStyleProps, 'rounded' | 'shadow'>) => {
  // Determine colors based on theme
  const bgColor = isDark 
    ? `rgba(17, 24, 39, ${bgOpacity})` 
    : `rgba(255, 255, 255, ${bgOpacity})`;
  
  const borderColor = isDark 
    ? `rgba(255, 255, 255, ${borderOpacity})` 
    : `rgba(0, 0, 0, ${borderOpacity})`;
  
  return {
    backdropFilter: `blur(${blurStrength}px)`,
    WebkitBackdropFilter: `blur(${blurStrength}px)`,
    backgroundColor: bgColor,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: borderColor,
    boxShadow: isDark 
      ? '0 8px 32px rgba(0, 0, 0, 0.2)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  };
};

/**
 * Returns hover effect styles for glassmorphic elements
 */
export const getGlassmorphicHoverStyles = ({
  isDark = false,
  blurStrength = 10,
  hoverScale = 1.02,
}: Pick<GlassmorphicStyleProps, 'isDark' | 'blurStrength'> & { hoverScale?: number }) => {
  return {
    scale: hoverScale,
    boxShadow: isDark 
      ? '0 10px 40px rgba(0, 0, 0, 0.3)'
      : '0 10px 40px rgba(0, 0, 0, 0.15)',
    backdropFilter: `blur(${blurStrength * 1.5}px)`,
    WebkitBackdropFilter: `blur(${blurStrength * 1.5}px)`,
  };
};

/**
 * Simple glassmorphic component class names
 */
export const simpleGlassmorphic = (isDark = false) => cn(
  "backdrop-blur-md rounded-2xl overflow-hidden",
  isDark 
    ? "bg-gray-900/40 border border-gray-700/50" 
    : "bg-white/70 border border-gray-200"
); 