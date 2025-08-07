import { useEffect, useRef, useCallback, useState } from 'react';

interface PullToRefreshConfig {
  threshold?: number;
  resistance?: number;
  onRefresh?: () => Promise<void>;
}

export const usePullToRefresh = (
  elementRef: React.RefObject<HTMLElement>,
  config: PullToRefreshConfig = {}
) => {
  const {
    threshold = 80,
    resistance = 2.5,
    onRefresh
  } = config;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const element = elementRef.current;
    if (!element || element.scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    isPulling.current = true;
  }, [elementRef]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current || !startY.current) return;

    currentY.current = e.touches[0].clientY;
    const distance = Math.max(0, (currentY.current - startY.current) / resistance);
    
    setPullDistance(distance);
    
    if (distance > 0) {
      e.preventDefault();
    }
  }, [resistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;

    if (pullDistance > threshold && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    startY.current = null;
    currentY.current = null;
    isPulling.current = false;
  }, [pullDistance, threshold, onRefresh]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isRefreshing,
    pullDistance,
    isPulling: isPulling.current
  };
}; 