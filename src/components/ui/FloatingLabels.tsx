import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface FloatingLabelsProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variant?: 'default' | 'minimal' | 'outlined';
  error?: string;
  helpText?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const FloatingLabels: React.FC<FloatingLabelsProps> = ({
  label,
  variant = 'default',
  error,
  helpText,
  className,
  containerClassName,
  labelClassName,
  inputClassName,
  required,
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uniqueId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  // Check if input has value
  useEffect(() => {
    if (props.value !== undefined) {
      setHasValue(Boolean(props.value));
    }
  }, [props.value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(Boolean(e.target.value));
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value));
    props.onChange?.(e);
  };

  // Base container styles
  const containerBaseClasses = "relative mb-4";
  
  // Base input styles
  const inputBaseClasses = "block w-full text-base transition-all duration-200 ease-in-out focus:outline-none focus:ring-2";
  
  // Base label styles
  const labelBaseClasses = "absolute left-3 transition-all duration-200 pointer-events-none";
  
  // Variant-specific styles
  const variantStyles = {
    default: {
      container: "",
      input: "px-3 pt-6 pb-2 rounded-lg border bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-400",
      label: "text-gray-500 dark:text-gray-400",
      labelActive: "text-xs -translate-y-3",
      labelInactive: "text-base translate-y-2"
    },
    minimal: {
      container: "",
      input: "px-0 pt-6 pb-1 border-0 border-b-2 border-gray-300 dark:border-slate-700 focus:ring-0 focus:border-indigo-500 dark:focus:border-indigo-400 bg-transparent",
      label: "text-gray-500 dark:text-gray-400 left-0",
      labelActive: "text-xs -translate-y-4 text-indigo-600 dark:text-indigo-400",
      labelInactive: "text-base translate-y-2"
    },
    outlined: {
      container: "",
      input: "px-3 py-3 border-2 rounded-xl focus:ring-0 focus:border-indigo-500 dark:focus:border-indigo-400 bg-transparent border-gray-300 dark:border-slate-700",
      label: "text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 px-1",
      labelActive: "text-xs -translate-y-5 text-indigo-600 dark:text-indigo-400 scale-90",
      labelInactive: "text-base translate-y-2"
    }
  };

  const variantStyle = variantStyles[variant];
  const isActive = isFocused || hasValue;

  return (
    <div className={cn(
      containerBaseClasses,
      variantStyle.container,
      containerClassName
    )}>
      <input
        id={uniqueId}
        ref={inputRef}
        className={cn(
          inputBaseClasses,
          variantStyle.input,
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
          inputClassName,
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${uniqueId}-error` : helpText ? `${uniqueId}-help` : undefined}
        required={required}
        {...props}
      />
      <label
        htmlFor={uniqueId}
        className={cn(
          labelBaseClasses,
          variantStyle.label,
          isActive ? variantStyle.labelActive : variantStyle.labelInactive,
          labelClassName
        )}
      >
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {error && (
        <p id={`${uniqueId}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p id={`${uniqueId}-help`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}; 