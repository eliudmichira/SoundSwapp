import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    // Check if the device supports haptic feedback
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        warning: [20, 50, 20],
        error: [30, 50, 30]
      };

      const pattern = patterns[type] || patterns.light;
      navigator.vibrate(pattern);
    }
  }, []);

  const hapticSuccess = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
  const hapticWarning = useCallback(() => triggerHaptic('warning'), [triggerHaptic]);
  const hapticError = useCallback(() => triggerHaptic('error'), [triggerHaptic]);
  const hapticLight = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const hapticMedium = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
  const hapticHeavy = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);

  return {
    triggerHaptic,
    hapticSuccess,
    hapticWarning,
    hapticError,
    hapticLight,
    hapticMedium,
    hapticHeavy
  };
}; 