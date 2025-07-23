import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
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

// Helper for random values
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max));
const randomItem = <T,>(items: T[]): T => items[randomInt(0, items.length)];

// Helper to calculate distance between two points
const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const ParticleField: React.FC<ParticleFieldProps> = ({ 
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
  const [particles, setParticles] = useState<ParticleElement[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track each particle's current position separately to avoid hook issues
  const [particlePositions, setParticlePositions] = useState<{[key: number]: {x: number, y: number, scale?: number}}>({});
  
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  const { theme } = useTheme();
  
  // Adjust particle count based on density
  const getParticleCount = () => {
    const baseCounts = { low: 20, medium: 40, high: 70 };
    const baseCount = baseCounts[density];
    
    // Adjust for screen size
    const screenFactor = Math.min(dimensions.width, dimensions.height) / 1000;
    return Math.floor(baseCount * screenFactor);
  };
  
  // Get a color based on the color scheme
  const getParticleColor = (type: ParticleType): string => {
    if (colorScheme === 'monochrome') {
      return color;
    }
    
    if (colorScheme === 'brand') {
      if (type === 'platform') {
        const platformColors = ['#1DB954', '#FF0000', '#FF7700']; // Spotify, YouTube, SoundCloud
        return platformColors[randomInt(0, platformColors.length)];
      }
      
      return ['#9333ea', '#3b82f6', '#ec4899'][randomInt(0, 3)]; // Purple, blue, pink
    }
    
    // Colorful scheme
    const colors = [
      '#9333ea', // Purple
      '#3b82f6', // Blue
      '#ec4899', // Pink
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ef4444'  // Red
    ];
    
    return randomItem(colors);
  };
  
  // Generate a particle
  const generateParticle = (id: number): ParticleElement => {
    // Determine particle type based on enabled options
    let availableTypes: ParticleType[] = [];
    if (includeNotes) availableTypes.push('note');
    if (includeIcons) availableTypes.push('icon');
    if (includePlatforms) availableTypes.push('platform');
    if (includeCircles) availableTypes.push('circle');
    
    // Default to circles if nothing is enabled
    if (availableTypes.length === 0) availableTypes.push('circle');
    
    const type = randomItem(availableTypes);
    
    // Generate particle content based on type
    let content: string | React.ReactNode = '';
    if (type === 'note') {
      content = randomItem(MUSIC_NOTES);
    } else if (type === 'icon') {
      content = <FontAwesomeIcon icon={randomItem(MUSIC_ICONS)} />;
    } else if (type === 'platform') {
      content = <FontAwesomeIcon icon={randomItem(PLATFORM_ICONS)} />;
    }
    
    // Generate size based on type
    let size;
    switch (type) {
      case 'note':
        size = random(14, 30);
        break;
      case 'icon':
      case 'platform':
        size = random(10, 24);
        break;
      case 'circle':
      default:
        size = random(3, 8);
        break;
    }
    
    // Generate animation path
    const paths: Array<'wave' | 'zigzag' | 'curve' | 'circle' | 'linear'> = 
      ['wave', 'zigzag', 'curve', 'circle', 'linear'];
    
    const x = random(0, 100);
    const y = random(0, 100);
      
    return {
      id,
      type,
      content,
      x: x,
      y: y,
      startX: x, // Store original position
      startY: y, // Store original position
      size,
      color: getParticleColor(type),
      opacity: random(0.1, type === 'circle' ? 0.4 : 0.7),
      rotation: random(-30, 30),
      duration: random(20, 40) / speedFactor,
      delay: random(0, 15),
      path: randomItem(paths)
    };
  };
  
  // Generate particles on mount and when properties change
  useEffect(() => {
    const count = getParticleCount();
    const newParticles = Array.from({ length: count }).map((_, i) => 
      generateParticle(i)
    );
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
    
    // Handle resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions.width, dimensions.height, includeNotes, includeIcons, includePlatforms, 
      includeCircles, colorScheme, density, speedFactor, theme]);
  
  // Generate a unique animation based on the particle's path type
  const getAnimationForPath = (path: ParticleElement['path']) => {
    const intensity = 100; // Animation movement intensity
    
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
          scale: [1, 1.1, 1, 0.9, 1]
        };
      case 'linear':
      default:
        return {
          y: [0, -intensity*1.5, 0],
          opacity: [0.2, 1, 0.2]
        };
    }
  };
  
  // Handle mouse movement for particle repulsion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !interactive) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x: mouseX, y: mouseY });
      setIsMouseMoving(true);
      
      // Apply repulsion effect to particles near the mouse
      const newPositions = { ...particlePositions };
      let hasChanges = false;
      
      particles.forEach(particle => {
        const dist = distance(particle.x, particle.y, mouseX, mouseY);
        const repulsionRadius = 20; // Repulsion radius in percentage of container
        
        if (dist < repulsionRadius) {
          // Calculate repulsion vector (stronger when closer)
          const repulsionStrength = (1 - dist / repulsionRadius) * 15;
          const angle = Math.atan2(particle.y - mouseY, particle.x - mouseX);
          
          // Apply repulsion
          const newX = particle.x + Math.cos(angle) * repulsionStrength;
          const newY = particle.y + Math.sin(angle) * repulsionStrength;
          
          // Constrain to container bounds with some padding
          const padding = 5;
          const boundedX = Math.max(padding, Math.min(100 - padding, newX));
          const boundedY = Math.max(padding, Math.min(100 - padding, newY));
          
          // Update positions
          newPositions[particle.id] = { 
            x: boundedX,
            y: boundedY 
          };
          
          // Update particle in state
          particle.x = boundedX;
          particle.y = boundedY;
          
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setParticlePositions(newPositions);
      }
    };
    
    // Handle mouse click for adding particles
    const handleMouseClick = (e: MouseEvent) => {
      if (!containerRef.current || !interactive) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 100;
      const clickY = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Create 4 new particles at click position
      const newParticles = Array.from({ length: 4 }).map((_, i) => {
        const id = Date.now() + i;
        const particle = generateParticle(id);
        
        // Position near click
        particle.x = clickX + random(-5, 5);
        particle.y = clickY + random(-5, 5);
        particle.startX = particle.x;
        particle.startY = particle.y;
        
        return particle;
      });
      
      // Add new particles to position tracking
      const newPositions = { ...particlePositions };
      newParticles.forEach(particle => {
        newPositions[particle.id] = { 
          x: particle.x, 
          y: particle.y 
        };
      });
      
      // Add new particles
      setParticles(prev => [...prev, ...newParticles]);
      setParticlePositions(newPositions);
      
      // Create burst effect for existing particles
      const burstPositions: {[key: number]: {x: number, y: number, scale?: number}} = { ...particlePositions };
      let hasBurstChanges = false;
      
      particles.forEach(particle => {
        const dist = distance(particle.x, particle.y, clickX, clickY);
        if (dist < 20) {
          const angle = Math.atan2(particle.y - clickY, particle.x - clickX);
          const burstStrength = (1 - dist / 20) * 20;
          
          const newX = particle.x + Math.cos(angle) * burstStrength;
          const newY = particle.y + Math.sin(angle) * burstStrength;
          
          // Update positions with burst effect
          burstPositions[particle.id] = { 
            x: newX,
            y: newY,
            scale: 1.5 // Add a scale effect
          };
          
          // Update particle in state
          particle.x = newX;
          particle.y = newY;
          
          hasBurstChanges = true;
        }
      });
      
      if (hasBurstChanges) {
        setParticlePositions(burstPositions);
      }
    };
    
    // Reset particles slowly to their original positions when mouse stops moving
    const handleMouseStop = () => {
      setIsMouseMoving(false);
      
      const returnPositions = { ...particlePositions };
      let hasReturnChanges = false;
      
      particles.forEach(particle => {
        // Return to original position
        returnPositions[particle.id] = { 
          x: particle.startX,
          y: particle.startY 
        };
        
        // Update particle in state
        particle.x = particle.startX;
        particle.y = particle.startY;
        
        hasReturnChanges = true;
      });
      
      if (hasReturnChanges) {
        setParticlePositions(returnPositions);
      }
    };
    
    // Debounce mouse stop
    let mouseStopTimer: ReturnType<typeof setTimeout>;
    const resetMouseStopTimer = () => {
      clearTimeout(mouseStopTimer);
      mouseStopTimer = setTimeout(handleMouseStop, 200);
    };
    
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousemove', resetMouseStopTimer);
      window.addEventListener('click', handleMouseClick);
    }
    
    return () => {
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousemove', resetMouseStopTimer);
        window.removeEventListener('click', handleMouseClick);
        clearTimeout(mouseStopTimer);
      }
    };
  }, [particles, particlePositions, interactive]);
  
  return (
    <div 
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
    >
      {particles.map((particle) => {
        // Get current position from state or use default
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
            transition={{ type: 'spring', stiffness: 170, damping: 15 }}
          >
            {particle.type === 'circle' ? (
              <motion.div
                className="rounded-full"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                }}
                animate={isMouseMoving ? {} : animated ? {
                  y: [0, -50, 0, 50, 0],
                  opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity]
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
                animate={isMouseMoving ? {} : animated ? getAnimationForPath(particle.path) : {}}
                transition={{
                  repeat: Infinity,
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: "easeInOut"
                }}
                whileHover={interactive ? { scale: 1.3, opacity: 1 } : {}}
              >
                {particle.content}
              </motion.div>
            )}
          </motion.div>
        );
      })}

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
};