import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

interface Enhanced3DCardProps {
  glowColor?: string;
  children: React.ReactNode;
  depth?: number;
  glassEffect?: boolean;
  hoverScale?: number;
  className?: string;
}

export const Enhanced3DCard = ({
  className,
  glowColor = "rgba(120, 119, 198, 0.4)",
  children,
  depth = 20,
  glassEffect = false,
  hoverScale = 1.02,
}: Enhanced3DCardProps) => {
  const { isDark } = useTheme();
  
  // Motion values for tracking mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth out the mouse movement with springs
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-100, 100], [depth, -depth]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-depth, depth]), springConfig);
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Default styles based on theme
  const baseStyles = isDark 
    ? "bg-gray-800 border border-gray-700 text-white"
    : "bg-white border border-gray-200 text-gray-800";
  
  // Glass effect styles
  const glassStyles = glassEffect
    ? "backdrop-blur-md bg-opacity-20 border-opacity-20 backdrop-saturate-150"
    : "";
    
  // Handling mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate position relative to the center of the card
    const xPos = e.clientX - rect.left - rect.width / 2;
    const yPos = e.clientY - rect.top - rect.height / 2;
    
    x.set(xPos);
    y.set(yPos);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "rounded-xl shadow-md overflow-hidden transition-shadow relative",
        baseStyles,
        glassStyles,
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: hoverScale, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    >
      {/* Light effect that follows cursor */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
          opacity: useTransform(
            // Calculate distance from center to determine opacity
            useMotionValue(0), 
            [0, 100], 
            [0.7, 0]
          ),
          x,
          y
        }}
      />
      
      {/* Content container that preserves 3D for children */}
      <div 
        className="relative z-10" 
        style={{ transform: "translateZ(20px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
}; 