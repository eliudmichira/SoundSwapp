import React, { useState, useCallback } from 'react';
import { cn } from '../../lib/utils';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  showFallbackOnError?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = '/images/placeholder-image.svg',
  showFallbackOnError = true,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (showFallbackOnError && !hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
    
    // Call the original onError if provided
    if (onError) {
      onError(event);
    }
  }, [fallbackSrc, hasError, onError, showFallbackOnError]);

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn('object-cover', className)}
      onError={handleError}
      {...props}
    />
  );
}; 