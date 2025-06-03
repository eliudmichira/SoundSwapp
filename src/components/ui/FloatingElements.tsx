import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingElementsProps {
  elements?: Array<{
    icon?: React.ReactNode;
    size?: number;
    color?: string;
  }>;
  count?: number;
  className?: string;
}

type FloatingItem = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  icon?: React.ReactNode;
  dispersed: boolean;
  respawnKey: number; // for AnimatePresence
};

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  elements = [],
  count = 10,
  className
}) => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  // Helper to generate a random item
  const generateItem = (id: number): FloatingItem => {
    const elementIndex = elements.length > 0 ? Math.floor(Math.random() * elements.length) : -1;
    const element = elementIndex >= 0 ? elements[elementIndex] : null;
    return {
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: element?.size || Math.random() * 20 + 10,
      duration: Math.random() * 15 + 30,
      delay: Math.random() * 5,
      color: element?.color || 
        `hsla(${Math.random() * 360}, ${70 + Math.random() * 30}%, ${70 + Math.random() * 30}%, ${0.1 + Math.random() * 0.5})`,
      icon: element?.icon,
      dispersed: false,
      respawnKey: 0,
    };
  };

  // Generate random floating elements
  useEffect(() => {
    setItems(Array.from({ length: count }, (_, i) => generateItem(i)));
    // eslint-disable-next-line
  }, [count, elements]);

  // Default icons if none provided
  const defaultIcons = ['♪', '♫', '🎵', '🎶', '🎹', '🎸', '🎺', '🎷', '🎤'];

  // Disperse handler with improved behavior
  const disperse = (id: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, dispersed: true } : item
    ));
    // Respawn after animation with longer duration for smoother effect
    setTimeout(() => {
      setItems(prev => prev.map(item =>
        item.id === id
          ? { ...generateItem(id), respawnKey: item.respawnKey + 1 }
          : item
      ));
    }, 2600); // Increased to 2600ms to match the new 2.5s animation duration
  };

  // Add subtle floating animation to make elements appear more "alive" but slower
  const floatingAnimation = {
    y: [0, 10], // Simplified to only 2 keyframes as required by spring animations
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-auto", className)}>
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id + '-' + item.respawnKey}
            className="absolute transform-gpu cursor-pointer pointer-events-auto"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: `${item.size}px`,
              color: item.color,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
              opacity: 0.7,
              zIndex: 2,
              userSelect: 'none',
            }}
            initial={{ scale: 1, opacity: 0.7, x: 0, y: 0 }}
            animate={item.dispersed ? {
              scale: 1.5,
              opacity: 0,
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200,
              transition: { 
                duration: 2.5,
                ease: 'easeOut'
              }
            } : {
              ...floatingAnimation,
              scale: 1,
              opacity: 0.7,
              transition: { 
                type: 'spring', 
                stiffness: 50,
                damping: 20 
              }
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
            whileHover={{ 
              scale: 1.2,
              opacity: 1,
              transition: { duration: 0.3 } 
            }}
            onClick={() => disperse(item.id)}
            onMouseEnter={() => disperse(item.id)}
          >
            {item.icon || defaultIcons[Math.floor(Math.random() * defaultIcons.length)]}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 