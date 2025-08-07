import { useEffect, useRef, useCallback } from 'react';

interface SwipeConfig {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  preventDefault?: boolean;
}

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipeGestures = (
  elementRef: React.RefObject<HTMLElement>,
  callbacks: SwipeCallbacks,
  config: SwipeConfig = {}
) => {
  const {
    minSwipeDistance = 50,
    maxSwipeTime = 300,
    preventDefault = false // Changed default to false to avoid conflicts
  } = config;

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwiping = useRef(false);

  const onTouchStart = useCallback((e: TouchEvent) => {
    // Only prevent default if explicitly configured and not during scroll
    if (preventDefault && e.cancelable) {
      e.preventDefault();
    }
    
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()
    };
    isSwiping.current = false;
  }, [preventDefault]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const distanceX = Math.abs(currentX - touchStart.current.x);
    const distanceY = Math.abs(currentY - touchStart.current.y);

    // Only prevent default if we're actually swiping (not just scrolling)
    if (preventDefault && (distanceX > 10 || distanceY > 10) && e.cancelable) {
      e.preventDefault();
      isSwiping.current = true;
    }

    touchEnd.current = {
      x: currentX,
      y: currentY,
      time: Date.now()
    };
  }, [preventDefault]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const timeDiff = touchEnd.current.time - touchStart.current.time;

    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const isLongEnough = Math.abs(distanceX) > minSwipeDistance || Math.abs(distanceY) > minSwipeDistance;
    const isFastEnough = timeDiff < maxSwipeTime;

    if (isLongEnough && isFastEnough && isSwiping.current) {
      if (isHorizontalSwipe) {
        if (distanceX > 0 && callbacks.onSwipeLeft) {
          callbacks.onSwipeLeft();
        } else if (distanceX < 0 && callbacks.onSwipeRight) {
          callbacks.onSwipeRight();
        }
      } else {
        if (distanceY > 0 && callbacks.onSwipeUp) {
          callbacks.onSwipeUp();
        } else if (distanceY < 0 && callbacks.onSwipeDown) {
          callbacks.onSwipeDown();
        }
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
    isSwiping.current = false;
  }, [callbacks, minSwipeDistance, maxSwipeTime]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', onTouchStart, { passive: !preventDefault });
    element.addEventListener('touchmove', onTouchMove, { passive: !preventDefault });
    element.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [elementRef, onTouchStart, onTouchMove, onTouchEnd, preventDefault]);

  return {
    touchStart: touchStart.current,
    touchEnd: touchEnd.current
  };
}; 