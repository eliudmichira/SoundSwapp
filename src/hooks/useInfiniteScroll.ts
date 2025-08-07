import { useState, useEffect, useCallback, useRef } from 'react';

interface InfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger load
  rootMargin?: string;
  enabled?: boolean;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  isLoading?: boolean;
}

interface InfiniteScrollReturn {
  isNearBottom: boolean;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useInfiniteScroll = (options: InfiniteScrollOptions = {}): InfiniteScrollReturn => {
  const {
    threshold = 100,
    rootMargin = '0px',
    enabled = true,
    onLoadMore,
    hasMore = true,
    isLoading = false
  } = options;

  const [isNearBottom, setIsNearBottom] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load more content
  const loadMore = useCallback(async () => {
    if (!enabled || !hasMore || isLoading || internalLoading || !onLoadMore) return;

    try {
      setInternalLoading(true);
      await onLoadMore();
    } catch (error) {
      console.error('Error loading more content:', error);
    } finally {
      setInternalLoading(false);
    }
  }, [enabled, hasMore, isLoading, internalLoading, onLoadMore]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsNearBottom(entry.isIntersecting);
        
        if (entry.isIntersecting && hasMore && !isLoading && !internalLoading) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px ${rootMargin}`,
        threshold: 0.1
      }
    );

    observer.observe(sentinelRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, threshold, rootMargin, hasMore, isLoading, internalLoading, loadMore]);

  return {
    isNearBottom,
    isLoading: isLoading || internalLoading,
    hasMore,
    loadMore,
    scrollToTop,
    scrollToBottom,
    containerRef
  };
};

// Hook for virtual scrolling (for very long lists)
interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  totalItems: number;
  overscan?: number;
}

interface VirtualScrollReturn {
  virtualItems: Array<{
    index: number;
    start: number;
    end: number;
    size: number;
    offsetTop: number;
  }>;
  totalSize: number;
  scrollToItem: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useVirtualScroll = (options: VirtualScrollOptions): VirtualScrollReturn => {
  const { itemHeight, containerHeight, totalItems, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSize = totalItems * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => {
    const index = startIndex + i;
    return {
      index,
      start: index * itemHeight,
      end: (index + 1) * itemHeight,
      size: itemHeight,
      offsetTop: index * itemHeight
    };
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const scrollToItem = useCallback((index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }
  }, [itemHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll as any);
      return () => container.removeEventListener('scroll', handleScroll as any);
    }
  }, [handleScroll]);

  return {
    virtualItems,
    totalSize,
    scrollToItem,
    containerRef
  };
}; 