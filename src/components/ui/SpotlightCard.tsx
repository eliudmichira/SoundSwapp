import React, { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { useMousePosition } from "../../hooks/useMousePosition";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  size?: number;
  strength?: number;
  children: React.ReactNode;
}

export default function SpotlightCard({
  className,
  glowColor = "rgba(120, 119, 198, 0.4)",
  size = 350,
  strength = 0.3,
  children,
  ...props
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useMousePosition(containerRef, ({ x, y }) => {
    setPosition({ x, y });
    setOpacity(1);
  });

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-xl bg-white", className)}
      onMouseLeave={() => setOpacity(0)}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent ${strength * 100}%)`,
        }}
      />
      {children}
    </div>
  );
} 