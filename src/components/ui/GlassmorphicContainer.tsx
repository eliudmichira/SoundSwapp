import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface GlassmorphicContainerProps {
  children: React.ReactNode;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  onClick?: () => void;
  animate?: boolean;
  hoverEffect?: boolean;
}

export const GlassmorphicContainer = forwardRef<HTMLDivElement, GlassmorphicContainerProps>(({
  children,
  className,
  rounded = 'lg',
  shadow = 'lg',
  blur = 'md',
  border = true,
  intensity = 'medium',
  onClick,
  animate = false,
  hoverEffect = true
}, ref) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  const blurClasses = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const intensityClasses = {
    light: 'bg-white/30 dark:bg-gray-900/30',
    medium: 'bg-white/40 dark:bg-gray-900/40',
    heavy: 'bg-white/50 dark:bg-gray-900/50'
  };

  const borderClasses = border ? 'border border-white/20 dark:border-gray-700/20' : '';

  const sharedProps = {
    ref,
    className: cn(
      'transition-all duration-300',
      roundedClasses[rounded],
      shadowClasses[shadow],
      blurClasses[blur],
      intensityClasses[intensity],
      borderClasses,
      hoverEffect && 'hover:bg-opacity-[0.45] dark:hover:bg-opacity-[0.45]',
      'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
      className
    ),
    onClick
  };

  if (animate) {
    return (
      <motion.div
        {...sharedProps}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div {...sharedProps}>{children}</div>;
});

GlassmorphicContainer.displayName = 'GlassmorphicContainer';

export default GlassmorphicContainer; 