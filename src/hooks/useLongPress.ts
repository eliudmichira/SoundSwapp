import { useCallback, useRef, useEffect } from 'react';

interface LongPressConfig {
  delay?: number;
  preventDefault?: boolean;
  onLongPress?: () => void;
  onPress?: () => void;
}

export const useLongPress = (
  elementRef: React.RefObject<HTMLElement>,
  config: LongPressConfig = {}
) => {
  const {
    delay = 500,
    preventDefault = true,
    onLongPress,
    onPress
  } = config;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const startLongPress = useCallback(() => {
    isLongPress.current = false;
    timeoutRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress?.();
    }, delay);
  }, [delay, onLongPress]);

  const endLongPress = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (!isLongPress.current && onPress) {
      onPress();
    }
  }, [onPress]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (preventDefault) e.preventDefault();
    startLongPress();
  }, [preventDefault, startLongPress]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (preventDefault) e.preventDefault();
    endLongPress();
  }, [preventDefault, endLongPress]);

  const handleTouchCancel = useCallback((e: TouchEvent) => {
    if (preventDefault) e.preventDefault();
    endLongPress();
  }, [preventDefault, endLongPress]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: !preventDefault });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [elementRef, handleTouchStart, handleTouchEnd, handleTouchCancel, preventDefault]);

  return {
    isLongPress: isLongPress.current
  };
}; 