import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMusic, faGuitar, faMicrophone, faHeadphones, 
  faDrum, faCompactDisc, faVolumeHigh 
} from '@fortawesome/free-solid-svg-icons';
import { faSpotify, faYoutube, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { useTheme } from '../../lib/ThemeContext';

// Musical notes and symbols
const MUSIC_NOTES = ['♪', '♫', '♬', '♭', '♮', '♯', '𝄞', '𝄢', '𝄪', '𝅘𝅥𝅮', '𝅘𝅥𝅯', '𝅘𝅥𝅰'];

// Icon options
const MUSIC_ICONS = [
  faMusic, faGuitar, faMicrophone, faHeadphones, faDrum, faCompactDisc, faVolumeHigh
];

// Platform icons
const PLATFORM_ICONS = [faSpotify, faYoutube, faSoundcloud];

// Performance constants
const MOUSE_THROTTLE_MS = 16; // ~60fps
const PARTICLE_UPDATE_THROTTLE_MS = 32; // ~30fps
const REPULSION_RADIUS = 15; // Reduced from 20
const MAX_PARTICLES = 50; // Limit particle count

// Types of particles
type ParticleType = 'note' | 'icon' | 'platform' | 'circle';

// Particle element data structure
interface ParticleElement {
  id: number;
  type: ParticleType;
  content: string | React.ReactNode;
  x: number;
  y: number;
  startX: number; // Original X position
  startY: number; // Original Y position
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  duration: number;
  delay: number;
  path: 'wave' | 'zigzag' | 'curve' | 'circle' | 'linear';
}

interface ParticleFieldProps {
  color?: string;
  className?: string;
  includeNotes?: boolean;
  includeIcons?: boolean;
  includePlatforms?: boolean;
  includeCircles?: boolean;
  animated?: boolean;
  colorScheme?: 'monochrome' | 'colorful' | 'brand';
  density?: 'low' | 'medium' | 'high';
  speedFactor?: number;
  interactive?: boolean;
}

// Utility functions
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max));
const randomItem = <T,>(items: T[]): T => items[randomInt(0, items.length)];
const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Throttle function for performance
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const ParticleField: React.FC<ParticleFieldProps> = React.memo(({ 
  color = "#ffffff", 
  className = "",
  includeNotes = true,
  includeIcons = true,
  includePlatforms = true,
  includeCircles = true,
  animated = true,
  colorScheme = 'colorful',
  density = 'medium',
  speedFactor = 1,
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<ParticleElement[]>([]);
  const [particlePositions, setParticlePositions] = useState<{[key: number]: {x: number, y: number}}>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Performance refs to avoid state updates
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isMouseMovingRef = useRef(false);
  const animationFrameRef = useRef<number>();
  const mouseStopTimerRef = useRef<NodeJS.Timeout>();

  // Memoized particle count based on density
  const getParticleCount = useCallback(() => {
    const baseCount = density === 'low' ? 15 : density === 'medium' ? 30 : 45;
    return Math.min(baseCount, MAX_PARTICLES);
  }, [density]);

  // Memoized color generation
  const getParticleColor = useCallback((type: ParticleType): string => {
    if (colorScheme === 'monochrome') {
      return color;
    }
    
    const colors = {
      note: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      icon: ['#A8E6CF', '#DCEDC8', '#FFD3B6', '#FFAAA5', '#FF8B94'],
      platform: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      circle: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    };
    
    return randomItem(colors[type] || colors.note);
  }, [colorScheme, color]);

  // Memoized particle generation
  const generateParticle = useCallback((id: number): ParticleElement => {
    const types: ParticleType[] = [];
    if (includeNotes) types.push('note');
    if (includeIcons) types.push('icon');
    if (includePlatforms) types.push('platform');
    if (includeCircles) types.push('circle');
    
    const type = randomItem(types);
    const paths: Array<'wave' | 'zigzag' | 'curve' | 'circle' | 'linear'> = ['wave', 'zigzag', 'curve', 'circle', 'linear'];
    
    const notes = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
    const icons = ['🎵', '🎶', '🎹', '🎸', '🎺', '🎷', '🎤', '🎧'];
    const platforms = ['🎵', '🎶', '🎹', '🎸', '🎺', '🎷', '🎤', '🎧'];
    
    const contentMap = {
      note: randomItem(notes),
      icon: randomItem(icons),
      platform: randomItem(platforms),
      circle: ''
    };
    
    return {
      id,
      type,
      content: contentMap[type],
      x: random(5, 95),
      y: random(5, 95),
      startX: random(5, 95),
      startY: random(5, 95),
      size: type === 'circle' ? random(4, 12) : random(12, 24),
      color: getParticleColor(type),
      opacity: random(0.1, type === 'circle' ? 0.3 : 0.6),
      rotation: random(-30, 30),
      duration: random(20, 40) / speedFactor,
      delay: random(0, 15),
      path: randomItem(paths) as 'wave' | 'zigzag' | 'curve' | 'circle' | 'linear'
    };
  }, [includeNotes, includeIcons, includePlatforms, includeCircles, getParticleColor, speedFactor]);

  // Optimized particle generation with reduced dependencies
  useEffect(() => {
    const count = getParticleCount();
    const newParticles = Array.from({ length: count }, (_, i) => generateParticle(i));
    setParticles(newParticles);
    
    // Initialize particle positions
    const initialPositions: {[key: number]: {x: number, y: number}} = {};
    newParticles.forEach(particle => {
      initialPositions[particle.id] = { 
        x: particle.x,
        y: particle.y
      };
    });
    setParticlePositions(initialPositions);
  }, [getParticleCount, generateParticle]);

  // Optimized resize handler
  useEffect(() => {
    const handleResize = throttle(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 100);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized animation paths
  const getAnimationForPath = useCallback((path: ParticleElement['path']) => {
    const intensity = 80; // Reduced from 100
    
    switch (path) {
      case 'wave':
        return {
          y: [0, -intensity, 0, intensity, 0],
          x: [0, intensity/2, intensity, intensity/2, 0]
        };
      case 'zigzag':
        return {
          y: [0, -intensity, intensity, -intensity, 0],
          x: [0, intensity, 0, -intensity, 0]
        };
      case 'curve':
        return {
          y: [0, -intensity/2, -intensity, -intensity/2, 0],
          rotate: [0, 45, 0, -45, 0]
        };
      case 'circle':
        return {
          y: [0, -intensity, 0, intensity, 0],
          x: [0, intensity, 0, -intensity, 0],
          scale: [1, 1.05, 1, 0.95, 1]
        };
      case 'linear':
      default:
        return {
          y: [0, -intensity*1.2, 0],
          opacity: [0.2, 0.8, 0.2]
        };
    }
  }, []);

  // Throttled mouse movement handler
  const handleMouseMove = useCallback(throttle((e: MouseEvent) => {
    if (!containerRef.current || !interactive) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
    
    mousePositionRef.current = { x: mouseX, y: mouseY };
    isMouseMovingRef.current = true;
    
    // Only update state occasionally to reduce re-renders
    if (!isMouseMoving) {
      setIsMouseMoving(true);
    }
    
    // Apply repulsion effect with throttling
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const newPositions = { ...particlePositions };
      let hasChanges = false;
      
      particles.forEach(particle => {
        const dist = distance(particle.x, particle.y, mouseX, mouseY);
        
        if (dist < REPULSION_RADIUS) {
          const repulsionStrength = (1 - dist / REPULSION_RADIUS) * 10; // Reduced from 15
          const angle = Math.atan2(particle.y - mouseY, particle.x - mouseX);
          
          const newX = particle.x + Math.cos(angle) * repulsionStrength;
          const newY = particle.y + Math.sin(angle) * repulsionStrength;
          
          const padding = 5;
          const boundedX = Math.max(padding, Math.min(100 - padding, newX));
          const boundedY = Math.max(padding, Math.min(100 - padding, newY));
          
          newPositions[particle.id] = { x: boundedX, y: boundedY };
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setParticlePositions(newPositions);
      }
    });
  }, MOUSE_THROTTLE_MS), [particles, particlePositions, interactive, isMouseMoving]);

  // Mouse event handlers
  useEffect(() => {
    if (!interactive) return;
    
    document.addEventListener('mousemove', handleMouseMove);
    
    const handleMouseStop = throttle(() => {
      isMouseMovingRef.current = false;
      setIsMouseMoving(false);
    }, 100);
    
    const resetMouseStopTimer = () => {
      if (mouseStopTimerRef.current) {
        clearTimeout(mouseStopTimerRef.current);
      }
      mouseStopTimerRef.current = setTimeout(handleMouseStop, 150);
    };
    
    document.addEventListener('mousemove', resetMouseStopTimer);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', resetMouseStopTimer);
      if (mouseStopTimerRef.current) {
        clearTimeout(mouseStopTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [interactive, handleMouseMove]);

  // Memoized particle rendering
  const renderedParticles = useMemo(() => {
    return particles.map(particle => {
      const position = particlePositions[particle.id] || { x: particle.x, y: particle.y };
      
      return (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            top: `${position.y}%`,
            left: `${position.x}%`,
            color: particle.color,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            willChange: 'transform, opacity',
            zIndex: particle.type === 'circle' ? 0 : 1,
          }}
          animate={position}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
          {particle.type === 'circle' ? (
            <motion.div
              className="rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
              }}
              animate={isMouseMovingRef.current ? {} : animated ? {
                y: [0, -30, 0, 30, 0],
                opacity: [particle.opacity, particle.opacity * 1.3, particle.opacity]
              } : {}}
              transition={{
                repeat: Infinity,
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            />
          ) : (
            <motion.div
              animate={isMouseMovingRef.current ? {} : animated ? getAnimationForPath(particle.path) : {}}
              transition={{
                repeat: Infinity,
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeInOut"
              }}
              whileHover={interactive ? { scale: 1.2, opacity: 1 } : {}}
            >
              {particle.content}
            </motion.div>
          )}
        </motion.div>
      );
    });
  }, [particles, particlePositions, animated, interactive, getAnimationForPath]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ willChange: 'transform' }}
    >
      <AnimatePresence>
        {renderedParticles}
      </AnimatePresence>

      {/* Mouse position indicator for debugging (hidden in production) */}
      {false && interactive && (
        <motion.div 
          className="absolute w-3 h-3 bg-red-500 rounded-full"
          style={{
            top: `${mousePosition.y}%`,
            left: `${mousePosition.x}%`,
            zIndex: 100,
          }}
        />
      )}

      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-100px) rotate(10deg); }
        }

        @keyframes float-wave {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(20px) rotate(5deg); }
          50% { transform: translateY(0) translateX(40px) rotate(0deg); }
          75% { transform: translateY(30px) translateX(20px) rotate(-5deg); }
        }

        @keyframes float-zigzag {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-40px) translateX(40px); }
          50% { transform: translateY(0) translateX(0); }
          75% { transform: translateY(40px) translateX(-40px); }
        }
      `}</style>
    </div>
  );
});

ParticleField.displayName = 'ParticleField';