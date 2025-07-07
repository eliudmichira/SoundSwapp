import React, { useEffect, useRef } from 'react';
import { cn, addPassiveEventListener } from '../../lib/utils';

interface ScrollAreaProps {
  className?: string;
  children: React.ReactNode;
  onScroll?: (event: Event) => void;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({ className, children, onScroll }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    // Add scroll event listener with passive option
    const cleanup = addPassiveEventListener(scrollArea, 'scroll', (event) => {
      if (onScroll) onScroll(event);
    }, { passive: true });

    return cleanup;
  }, [onScroll]);

  return (
    <div
      ref={scrollAreaRef}
      className={cn(
        "relative overflow-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ScrollArea; 