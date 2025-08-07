import { useState, useEffect, useRef } from 'react';

interface ImageOptimizationConfig {
  src: string;
  alt: string;
  placeholder?: string;
  lazy?: boolean;
  sizes?: string;
}

export const useImageOptimization = (config: ImageOptimizationConfig) => {
  const { src, alt, placeholder, lazy = true, sizes } = config;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!lazy) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observerRef.current = observer;

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  // Generate optimized src for different screen sizes
  const getOptimizedSrc = (originalSrc: string, width: number) => {
    // For platform logos, return original src
    if (originalSrc.includes('spotify') || originalSrc.includes('youtube')) {
      return originalSrc;
    }
    
    // For other images, you could implement image optimization here
    // For now, return the original src
    return originalSrc;
  };

  return {
    imgRef,
    isLoaded,
    isInView,
    error,
    handleLoad,
    handleError,
    getOptimizedSrc,
    src: isInView ? src : placeholder || '',
    alt,
    sizes
  };
}; 