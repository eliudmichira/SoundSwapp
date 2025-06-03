import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';
import { getGlassmorphicClasses } from '../../lib/glassmorphic';

interface GlassmorphicContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';
  animate?: boolean;
  hoverEffect?: boolean;
  animateProps?: any;
}

export const GlassmorphicContainer: React.FC<GlassmorphicContainerProps> = ({
  children,
  className,
  as: Component = motion.div,
  rounded = '2xl',
  shadow = 'lg',
  animate = false,
  hoverEffect = false,
  animateProps,
  ...props
}) => {
  const { isDark } = useTheme();
  
  const containerClasses = cn(
    getGlassmorphicClasses({ isDark, rounded, shadow }),
    className
  );

  const hoverAnimation = hoverEffect ? {
    whileHover: { 
      scale: 1.02,
      boxShadow: isDark 
        ? '0 10px 40px rgba(0, 0, 0, 0.3)'
        : '0 10px 40px rgba(0, 0, 0, 0.15)',
      transition: {
        duration: 0.2
      }
    }
  } : {};

  const animationProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
    ...animateProps
  } : {};

  return (
    <Component 
      className={containerClasses}
      {...hoverAnimation}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassmorphicContainer; 