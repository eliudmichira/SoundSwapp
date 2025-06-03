import React from "react";
import { cn } from "../../../lib/utils";

/**
 * AnimatedBorderTrail
 *
 * A modern, customizable animated border component using conic-gradient.
 *
 * @param {React.PropsWithChildren<AnimatedTrailProps>} props
 */
export interface AnimatedTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation duration (e.g. '10s') */
  duration?: string;
  /** Border color (any valid CSS color) */
  trailColor?: string;
  /** Border thickness (px, rem, etc. or number for px) */
  trailSize?: number | string;
  /** Border radius (px, rem, etc. or number for px) */
  borderRadius?: number | string;
  /** Card background color */
  background?: string;
  /** Content className */
  contentClassName?: string;
  /** Add shadow? */
  shadow?: boolean;
  /** Add hover effect? */
  hoverEffect?: boolean;
  /** Accessibility: role */
  role?: string;
  /** Accessibility: aria-label */
  "aria-label"?: string;
}

export default function AnimatedBorderTrail({
  children,
  className,
  duration = "10s",
  trailColor = "#9333ea",
  trailSize = 8,
  borderRadius = 18,
  background = "#fff",
  contentClassName,
  shadow = true,
  hoverEffect = true,
  role,
  "aria-label": ariaLabel,
  ...props
}: React.PropsWithChildren<AnimatedTrailProps>) {
  // Normalize size
  const borderPx = typeof trailSize === "number" ? `${trailSize}px` : trailSize;
  const radius = typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  return (
    <div
      {...props}
      className={cn(
        "relative w-fit h-fit overflow-hidden",
        shadow && "shadow-xl",
        hoverEffect && "transition-transform hover:scale-[1.015] hover:shadow-2xl",
        className
      )}
      style={{ borderRadius: radius, ...props.style }}
      role={role}
      aria-label={ariaLabel}
    >
      {/* Animated border */}
      <div
        className="absolute inset-0 pointer-events-none animate-border-spin"
        style={{
          borderRadius: radius,
          padding: borderPx,
          zIndex: 1,
          // Animate the conic-gradient border
          background: `conic-gradient(from 0deg at 50% 50%, transparent 80%, ${trailColor} 100%)`,
          animationDuration: duration,
        } as React.CSSProperties}
      />
      {/* Content */}
      <div
        className={cn(
          "relative w-full h-full overflow-hidden",
          "bg-white",
          contentClassName
        )}
        style={{
          borderRadius: radius,
          background,
          zIndex: 2,
        }}
      >
        {children}
      </div>
      {/* Keyframes for border spin */}
      <style>{`
        @keyframes border-spin {
          0% { --angle: 0deg; }
          100% { --angle: 360deg; }
        }
        .animate-border-spin {
          animation: border-spin ${duration} linear infinite;
        }
      `}</style>
    </div>
  );
} 