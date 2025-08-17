import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn, filterDOMProps } from '../../lib/utils';

interface SafeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const SafeButton = forwardRef<HTMLButtonElement, SafeButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    // Filter out props that shouldn't be on DOM elements
    const domProps = filterDOMProps(props);
    
    const variantClasses = {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
      outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
      ghost: 'hover:bg-gray-100 text-gray-700'
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...domProps}
      >
        {children}
      </button>
    );
  }
);

SafeButton.displayName = 'SafeButton'; 