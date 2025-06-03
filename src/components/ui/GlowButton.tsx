// src/components/ui/GlowButton.tsx
import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Enhanced GlowButton with gradient support and accessibility
 */
interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'soundswapp' | 'outline' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variants = {
  primary: "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover shadow-glow",
  secondary: "bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover shadow-glow",
  soundswapp: "soundswapp-button shadow-glow",
  outline: "bg-transparent text-content-primary border border-border-default hover:border-border-hover hover:bg-surface-elevated",
  glass: "bg-surface-card/50 backdrop-blur-sm border border-border-default text-content-primary hover:bg-surface-card/70",
  minimal: "bg-transparent text-content-secondary hover:text-content-primary hover:bg-surface-card/30",
};

const sizes = {
  sm: "py-1 px-3 text-sm",
  md: "py-2 px-4",
  lg: "py-3 px-6 text-lg",
};

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({
    children,
    className = '',
    disabled = false,
    variant = 'soundswapp',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center font-medium rounded-lg select-none",
          "transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50",
          "active:scale-[0.98]",
          
          // Variant styles
          variants[variant],
          
          // Size styles
          sizes[size],
          
          // Width styles
          fullWidth ? "w-full" : "",
          
          // Disabled styles
          disabled && "opacity-60 pointer-events-none cursor-not-allowed",
          
          // Custom styles
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {/* Content */}
        <span className={cn("flex items-center justify-center gap-2", isLoading && "opacity-0")}>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

GlowButton.displayName = 'GlowButton';

export { GlowButton };