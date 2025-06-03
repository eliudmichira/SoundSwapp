import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

interface EnhancedGradientTextProps {
  variant?: "spotify" | "youtube" | "transition" | "default";
  size?: "sm" | "md" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  animationDuration?: number;
  showNoise?: boolean;
  letterSpacing?: string;
  className?: string;
  children: React.ReactNode;
}

const fontSizeMap = {
  sm: "text-lg md:text-xl",
  md: "text-xl md:text-2xl",
  lg: "text-2xl md:text-4xl",
  xl: "text-3xl md:text-5xl lg:text-6xl"
};

const fontWeightMap = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold"
};

export const EnhancedGradientText = ({
  className,
  children,
  variant = "default",
  size = "md",
  weight = "bold",
  animationDuration = 3,
  showNoise = true,
  letterSpacing = "-0.02em",
}: EnhancedGradientTextProps) => {
  const { isDark } = useTheme();
  const textRef = useRef<HTMLDivElement>(null);
  
  // More sophisticated gradient definitions
  const gradients = {
    spotify: "bg-gradient-to-r from-green-400 from-20% via-green-300 via-40% to-green-500 to-80%",
    youtube: "bg-gradient-to-r from-red-500 from-20% via-red-400 via-40% to-red-600 to-80%",
    transition: "bg-gradient-to-r from-green-400 from-10% via-purple-500 via-50% to-red-500 to-90%",
    default: isDark 
      ? "bg-gradient-to-r from-blue-400 from-20% via-violet-400 via-50% to-pink-400 to-80%" 
      : "bg-gradient-to-r from-blue-600 from-20% via-violet-600 via-50% to-pink-600 to-80%"
  };
  
  // Animation settings
  useEffect(() => {
    if (!textRef.current || !showNoise) return;
    
    // Add noise texture overlay - we'll simulate this with CSS
    const applyNoiseEffect = () => {
      if (!textRef.current) return;
      textRef.current.style.position = 'relative';
      
      // Apply a subtle noise pattern with CSS
      textRef.current.classList.add('noise-texture');
    };
    
    applyNoiseEffect();
  }, [showNoise]);
  
  return (
    <motion.div
      ref={textRef}
      className={cn(
        "inline-block bg-clip-text text-transparent relative",
        fontSizeMap[size],
        fontWeightMap[weight],
        gradients[variant],
        className,
      )}
      style={{
        letterSpacing,
        backgroundSize: "200% auto",
      }}
      initial={{
        backgroundPosition: "0% 50%"
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{
        duration: animationDuration,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  );
}; 