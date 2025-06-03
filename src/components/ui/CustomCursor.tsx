import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../lib/ThemeContext';

interface CustomCursorProps {
  showTrail?: boolean;
  trailColor?: string;
  trailLength?: number;
  magneticButtons?: boolean;
  magnetStrength?: number;
  cursorSize?: number;
  cursorBorderWidth?: number;
  children?: React.ReactNode;
  enabled?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({
  showTrail = false,
  trailColor = 'rgba(139, 92, 246, 0.3)', // Default is a violet color
  trailLength = 15,
  magneticButtons = true,
  magnetStrength = 0.4,
  cursorSize = 8,
  cursorBorderWidth = 2,
  enabled = false,
  children
}) => {
  // If not enabled, just return children without custom cursor
  if (!enabled) return <>{children}</>;

  const { isDark } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'click'>('default');
  const [trailPositions, setTrailPositions] = useState<Array<{ x: number, y: number, timestamp: number }>>([]);
  const [hasMoved, setHasMoved] = useState(false);
  
  // Store current mouse position in a ref to avoid re-renders
  const mousePositionRef = useRef({ x: 0, y: 0 });
  // Store magnetic elements in a ref to avoid re-querying on every mouse move
  const magneticElementsRef = useRef<Element[]>([]);
  // Animation frame reference to handle cancelation
  const animationFrameRef = useRef<number | null>(null);
  
  // Handle mouse down/up for click animation
  const onMouseDown = useCallback(() => {
    setCursorVariant('click');
  }, []);
  
  const onMouseUp = useCallback(() => {
    setCursorVariant(prevVariant => prevVariant === 'click' ? 'default' : prevVariant);
  }, []);
  
  // Function to update cursor position using RAF
  const updateCursorPosition = useCallback(() => {
    const { x: clientX, y: clientY } = mousePositionRef.current;
    
    // Update cursor position using direct DOM manipulation for better performance
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    }
    
    if (cursorOuterRef.current) {
      cursorOuterRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    }
    
    // Check if hovering over magnetic elements - only do this in RAF for better performance
    if (magneticButtons && magneticElementsRef.current.length > 0) {
      let hovering = false;
      
      magneticElementsRef.current.forEach(element => {
        const rect = element.getBoundingClientRect();
        
        // Check if cursor is over this element
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          hovering = true;
          setCursorVariant(prevVariant => prevVariant === 'click' ? 'click' : 'hover');
          
          // Calculate how much to shift the button (magnetic effect)
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Calculate distance from cursor to center
          const deltaX = (clientX - centerX) * magnetStrength;
          const deltaY = (clientY - centerY) * magnetStrength;
          
          // Apply transform to the button with transition
          const el = element as HTMLElement;
          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
      });
      
      if (!hovering && cursorVariant !== 'click') {
        setCursorVariant('default');
      }
    }
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(updateCursorPosition);
  }, [cursorVariant, magneticButtons, magnetStrength]);
  
  // Function to handle mouse movement
  const onMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    
    // Update mouse position ref without triggering re-renders
    mousePositionRef.current = { x: clientX, y: clientY };
    
    // Only update React state occasionally to avoid excessive re-rendering
    // Use a throttled approach for state updates that affect rendering
    setMousePosition({ x: clientX, y: clientY });
    
    if (!hasMoved) {
      setHasMoved(true);
    }
    
    // Add to trail if enabled - only do this on mousemove events, not in RAF
    if (showTrail) {
      setTrailPositions(prev => {
        const now = Date.now();
        const updatedPositions = [...prev, { x: clientX, y: clientY, timestamp: now }];
        // Keep only the last N positions for the trail
        return updatedPositions
          .filter(pos => now - pos.timestamp < 500) // Only keep trail points from last 500ms
          .slice(-trailLength);
      });
    }
  }, [hasMoved, showTrail, trailLength]);
  
  // Reset magnetic element transforms when not hovering
  const resetMagneticElements = useCallback(() => {
    if (magneticButtons && magneticElementsRef.current.length > 0) {
      magneticElementsRef.current.forEach(element => {
        const el = element as HTMLElement;
        el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        el.style.transform = 'translate(0, 0)';
      });
    }
  }, [magneticButtons]);
  
  // Setup event listeners and animation loop
  useEffect(() => {
    if (!enabled) return;
    
    // Cache magnetic elements once instead of querying on every move
    if (magneticButtons) {
      magneticElementsRef.current = Array.from(document.querySelectorAll('[data-magnetic="true"]'));
    }
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(updateCursorPosition);
    
    // Add event listeners
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    
    // Add data-cursored attribute to all links and buttons for style adjustments
    const links = document.querySelectorAll('a, button, input, select, textarea');
    
    // Use event delegation instead of adding listeners to each element
    const handleElementEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, input, select, textarea, [role="button"]')) {
        setCursorVariant(prev => prev === 'click' ? 'click' : 'hover');
      }
    };
    
    const handleElementLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, input, select, textarea, [role="button"]')) {
        setCursorVariant(prev => prev === 'click' ? 'click' : 'default');
      }
    };
    
    document.addEventListener('mouseover', handleElementEnter);
    document.addEventListener('mouseout', handleElementLeave);
    
    links.forEach(link => {
      link.setAttribute('data-cursored', 'true');
    });
    
    // Cleanup
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleElementEnter);
      document.removeEventListener('mouseout', handleElementLeave);
      
      resetMagneticElements();
      
      links.forEach(link => {
        link.removeAttribute('data-cursored');
      });
    };
  }, [onMouseDown, onMouseMove, onMouseUp, updateCursorPosition, magneticButtons, resetMagneticElements, enabled]);
  
  // Dynamic sizes based on props
  const innerSize = cursorSize;
  const outerSize = cursorSize * 3;
  const innerOffset = innerSize / 2;
  const outerOffset = outerSize / 2;
  
  // Get theme-aware colors
  const getThemeAwareColor = (alpha: number) => isDark 
    ? `rgba(255, 255, 255, ${alpha})` 
    : `rgba(0, 0, 0, ${alpha})`;
  
  const getPrimaryColor = (alpha: number) => isDark
    ? `rgba(139, 92, 246, ${alpha})`
    : `rgba(139, 92, 246, ${alpha})`;
  
  // Cursor variants for animations
  const cursorVariants = {
    default: {
      height: innerSize,
      width: innerSize,
      x: mousePosition.x - innerOffset,
      y: mousePosition.y - innerOffset,
      backgroundColor: getThemeAwareColor(0.2),
      opacity: hasMoved ? 1 : 0,
    },
    hover: {
      height: innerSize * 1.5,
      width: innerSize * 1.5,
      x: mousePosition.x - (innerSize * 1.5) / 2,
      y: mousePosition.y - (innerSize * 1.5) / 2,
      backgroundColor: getPrimaryColor(0.5),
      opacity: 1,
    },
    click: {
      height: innerSize * 1.2,
      width: innerSize * 1.2,
      x: mousePosition.x - (innerSize * 1.2) / 2,
      y: mousePosition.y - (innerSize * 1.2) / 2,
      backgroundColor: getPrimaryColor(0.8),
      opacity: 1,
    }
  };
  
  // Outer cursor variants
  const cursorOuterVariants = {
    default: {
      height: outerSize,
      width: outerSize,
      x: mousePosition.x - outerOffset,
      y: mousePosition.y - outerOffset,
      borderColor: getThemeAwareColor(0.15),
      opacity: hasMoved ? 0.8 : 0,
      borderWidth: cursorBorderWidth,
    },
    hover: {
      height: outerSize * 1.4,
      width: outerSize * 1.4,
      x: mousePosition.x - (outerSize * 1.4) / 2,
      y: mousePosition.y - (outerSize * 1.4) / 2,
      borderColor: getPrimaryColor(0.4),
      opacity: 1,
      borderWidth: cursorBorderWidth,
    },
    click: {
      height: outerSize * 0.8,
      width: outerSize * 0.8,
      x: mousePosition.x - (outerSize * 0.8) / 2,
      y: mousePosition.y - (outerSize * 0.8) / 2,
      borderColor: getPrimaryColor(0.6),
      opacity: 1,
      borderWidth: cursorBorderWidth * 1.5,
    }
  };
  
  // Hide default cursor with CSS
  useEffect(() => {
    if (!enabled) return;
    
    const style = document.createElement('style');
    style.innerHTML = `
      html, body {
        cursor: none !important;
      }
      [data-cursored="true"] {
        cursor: none !important;
      }
      a, button, input, select, textarea, [role="button"] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [enabled]);
  
  // Only render on client-side (avoid SSR issues)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return <>{children}</>;
  
  return (
    <>
      <AnimatePresence>
        {showTrail && trailPositions.map((pos, index) => {
          // Calculate how "old" this point is (0 = newest, 1 = oldest)
          const age = index / trailPositions.length;
          
          return (
            <motion.div
              key={`${pos.timestamp}-${index}`}
              className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
              style={{
                backgroundColor: trailColor,
                x: pos.x - (cursorSize * 0.4) / 2,
                y: pos.y - (cursorSize * 0.4) / 2,
                width: cursorSize * 0.4,
                height: cursorSize * 0.4,
                opacity: 0.1 + (1 - age) * 0.5,
                scale: 0.3 + (1 - age) * 0.7,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1 + (1 - age) * 0.5, scale: 0.3 + (1 - age) * 0.7 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </AnimatePresence>
      
      <motion.div
        ref={cursorOuterRef}
        className="fixed top-0 left-0 rounded-full border-solid pointer-events-none z-[9999]"
        variants={cursorOuterVariants}
        animate={cursorVariant}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20,
          mass: 0.5
        }}
      />
      
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 22,
          mass: 0.3
        }}
      />
      
      {children}
    </>
  );
}; 