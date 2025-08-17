import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn, filterDOMProps } from '../../lib/utils';

interface UniversalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  // Explicitly exclude asChild to prevent warnings
  asChild?: never;
}

const variants = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-sm",
  secondary: "bg-gray-500 hover:bg-gray-600 text-white shadow-sm",
  outline: "border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white",
  ghost: "hover:bg-gray-100 text-gray-700 bg-transparent",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
  success: "bg-green-500 hover:bg-green-600 text-white shadow-sm"
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl"
};

export const UniversalButton = forwardRef<HTMLButtonElement, UniversalButtonProps>(
  ({
    children,
    className = '',
    disabled = false,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    ...props
  }, ref) => {
    // Filter out props that shouldn't be on DOM elements
    const domProps = filterDOMProps(props);
    
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center font-medium rounded-lg select-none",
          "transition-all duration-200 ease-in-out focus:outline-none focus:visible:ring-2 focus:visible:ring-blue-500 focus:visible:ring-offset-2",
          "active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
          
          // Variant styles
          variants[variant],
          
          // Size styles
          sizes[size],
          
          // Width styles
          fullWidth ? "w-full" : "",
          
          // Custom styles
          className
        )}
        disabled={disabled || isLoading}
        {...domProps}
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

UniversalButton.displayName = 'UniversalButton';

// Export a higher-order component that wraps any button component
export const withSafeProps = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const safeProps = filterDOMProps(props as any);
    return <Component {...(safeProps as P)} ref={ref} />;
  });
};

// Export a function to create safe button props
export const createSafeButtonProps = (props: Record<string, any>): Record<string, any> => {
  return filterDOMProps(props);
}; 