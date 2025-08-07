import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsVisible(true);
      if (triggerOnce) {
        setHasTriggered(true);
      }
    } else if (!triggerOnce) {
      setIsVisible(false);
    }
  }, [triggerOnce]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return { elementRef, isVisible: isVisible || hasTriggered };
};

interface UseScrollProgressOptions {
  containerRef?: React.RefObject<HTMLElement>;
  onProgressChange?: (progress: number) => void;
}

export const useScrollProgress = (options: UseScrollProgressOptions = {}) => {
  const { containerRef, onProgressChange } = options;
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const calculateProgress = useCallback((element: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = element;
    const progress = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
    return Math.min(Math.max(progress, 0), 1);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const progress = calculateProgress(target);
    
    setScrollProgress(progress);
    setIsScrolling(true);
    onProgressChange?.(progress);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Reset scrolling state after delay
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [calculateProgress, onProgressChange]);

  const scrollToTop = useCallback(() => {
    const element = containerRef?.current;
    if (element) {
      element.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [containerRef]);

  const scrollToBottom = useCallback(() => {
    const element = containerRef?.current;
    if (element) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [containerRef]);

  const scrollToElement = useCallback((element: HTMLElement, offset = 0) => {
    const container = containerRef?.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = container.scrollTop + elementRect.top - containerRect.top - offset;
      
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [containerRef]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollProgress,
    isScrolling,
    handleScroll,
    scrollToTop,
    scrollToBottom,
    scrollToElement
  };
};

interface UseScrollDirectionOptions {
  threshold?: number;
}

export const useScrollDirection = (options: UseScrollDirectionOptions = {}) => {
  const { threshold = 10 } = options;
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const diff = currentScrollY - lastScrollY.current;

    if (Math.abs(diff) > threshold) {
      setScrollDirection(diff > 0 ? 'down' : 'up');
      lastScrollY.current = currentScrollY;
    }
  }, [threshold]);

  return { scrollDirection, handleScroll };
}; 