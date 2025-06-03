import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface TypingEffectProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  cursor?: boolean;
  loop?: boolean;
  className?: string;
  onComplete?: () => void;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 50,
  delay = 1000,
  cursor = true,
  loop = false,
  className,
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const currentText = Array.isArray(text) ? text[currentTextIndex] : text;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isTyping) {
      // Add characters one by one
      if (currentIndex < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(prev => prev + currentText[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);
      } else {
        // Reached end of current text
        setIsTyping(false);
        
        if (Array.isArray(text) && loop) {
          // Wait before starting to delete
          timeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, delay);
        } else if (!Array.isArray(text) && onComplete) {
          // Call onComplete if not an array
          onComplete();
        }
      }
    } else {
      // Delete phase (only for array of texts)
      if (Array.isArray(text)) {
        if (displayText.length > 0) {
          // Delete characters one by one
          timeoutRef.current = setTimeout(() => {
            setDisplayText(prev => prev.slice(0, -1));
          }, speed / 2);
        } else {
          // Move to next text after deleting
          const nextTextIndex = (currentTextIndex + 1) % text.length;
          setCurrentTextIndex(nextTextIndex);
          setCurrentIndex(0);
          setIsTyping(true);
          
          // Check if we completed a full cycle
          if (nextTextIndex === 0 && !loop && onComplete) {
            onComplete();
          }
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, currentText, currentTextIndex, delay, displayText, isTyping, loop, onComplete, speed, text]);

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      {cursor && (
        <span className="inline-block w-[2px] h-[1.2em] bg-current ml-1 align-middle animate-blink" />
      )}
    </span>
  );
};

// Add required animation to tailwind config
// Add to tailwind.config.js extend.animation:
// blink: 'blink 1s step-end infinite'
// Add to tailwind.config.js extend.keyframes:
// blink: {
//   '0%, 100%': { opacity: 1 },
//   '50%': { opacity: 0 }
// } 