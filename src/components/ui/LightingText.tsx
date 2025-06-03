import React, { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { useMousePosition } from "../../hooks/useMousePosition";

interface LightingTextProps extends React.HTMLAttributes<HTMLDivElement> {
  baseColor?: string;
  highlightColor?: string;
  size?: number;
  children: React.ReactNode;
}

export default function LightingText({
  className,
  baseColor = "text-gray-800",
  highlightColor = "text-indigo-600",
  size = 150,
  children,
  ...props
}: LightingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useMousePosition(containerRef, ({ x, y }) => {
    setPosition({ x, y });
  });

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <div className={cn("transition-colors duration-200", baseColor)}>
        {children}
      </div>
      
      {isHovering && (
        <div 
          className={cn("absolute top-0 left-0 w-full h-full pointer-events-none", highlightColor)}
          style={{
            WebkitMaskImage: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, black 10%, transparent 70%)`,
            maskImage: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, black 10%, transparent 70%)`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
} 