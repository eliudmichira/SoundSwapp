import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../lib/ThemeContext';

interface SuccessCelebrationProps {
  isActive: boolean;
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

export const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({
  isActive,
  message = "Successfully converted!",
  duration = 4000,
  onComplete
}) => {
  const { width, height } = useWindowSize();
  const { isDark } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // Handle celebration sequence
  useEffect(() => {
    if (isActive) {
      // Start confetti immediately
      setShowConfetti(true);
      
      // Show success message after a brief delay
      const messageTimer = setTimeout(() => {
        setShowMessage(true);
      }, 300);
      
      // Hide everything after duration
      const hideTimer = setTimeout(() => {
        setShowMessage(false);
        setShowConfetti(false);
        if (onComplete) onComplete();
      }, duration);
      
      return () => {
        clearTimeout(messageTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShowConfetti(false);
      setShowMessage(false);
    }
  }, [isActive, duration, onComplete]);

  // Colors for confetti - theme-aware
  const colors = isDark 
    ? ['#8B5CF6', '#EC4899', '#6EE7B7', '#3B82F6', '#F87171'] 
    : ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F87171'];

  return (
    <AnimatePresence>
      {showConfetti && (
        <>
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.15}
            colors={colors}
            tweenDuration={5000}
          />
          
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div 
                className={`px-8 py-4 rounded-xl shadow-xl ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                }`}
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: [0.8, 1.2, 1],
                    rotate: [-5, 5, 0] 
                  }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold mb-1">{message}</h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Your playlist is ready to use!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}; 