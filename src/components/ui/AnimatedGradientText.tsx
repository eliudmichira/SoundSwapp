import React from "react";
import { cn } from "../../lib/utils";

interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "spotify" | "youtube" | "default";
}

export default function AnimatedGradientText({
  className,
  children,
  variant = "default",
  ...props
}: AnimatedGradientTextProps) {
  const gradients = {
    spotify: "bg-gradient-to-r from-green-400 from-20% via-blue-500 via-50% to-green-600 to-80%",
    youtube: "bg-gradient-to-r from-red-500 from-30% via-red-600 via-50% to-amber-500 to-80%",
    default: "bg-gradient-to-r from-yellow-500 from-30% via-purple-500 via-50% to-pink-500 to-80%"
  };

  return (
    <div
      {...props}
      className={cn(
        "bg-size animate-bg-position bg-[length:200%_auto] bg-clip-text text-transparent",
        gradients[variant],
        className,
      )}
    >
      {children}
    </div>
  );
} 