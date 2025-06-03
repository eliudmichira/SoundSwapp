import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../lib/ThemeContext';
import { cn } from '../../lib/utils';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

// Define toast types and their properties
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: number) => void;
}

// Visual settings for different toast types
const toastSettings = {
  success: {
    icon: CheckCircle,
    lightStyles: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-500',
      iconColor: 'text-green-500',
      title: 'text-green-800',
      message: 'text-green-700',
    },
    darkStyles: {
      bg: 'bg-green-900/30',
      border: 'border-l-4 border-green-500',
      iconColor: 'text-green-400',
      title: 'text-green-300',
      message: 'text-green-400',
    }
  },
  error: {
    icon: XCircle,
    lightStyles: {
      bg: 'bg-red-50',
      border: 'border-l-4 border-red-500',
      iconColor: 'text-red-500',
      title: 'text-red-800',
      message: 'text-red-700',
    },
    darkStyles: {
      bg: 'bg-red-900/30',
      border: 'border-l-4 border-red-500',
      iconColor: 'text-red-400',
      title: 'text-red-300',
      message: 'text-red-400',
    }
  },
  warning: {
    icon: AlertTriangle,
    lightStyles: {
      bg: 'bg-yellow-50',
      border: 'border-l-4 border-yellow-500',
      iconColor: 'text-yellow-500',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
    },
    darkStyles: {
      bg: 'bg-yellow-900/30',
      border: 'border-l-4 border-yellow-500',
      iconColor: 'text-yellow-400',
      title: 'text-yellow-300',
      message: 'text-yellow-400',
    }
  },
  info: {
    icon: Info,
    lightStyles: {
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-500',
      iconColor: 'text-blue-500',
      title: 'text-blue-800',
      message: 'text-blue-700',
    },
    darkStyles: {
      bg: 'bg-blue-900/30',
      border: 'border-l-4 border-blue-500',
      iconColor: 'text-blue-400',
      title: 'text-blue-300',
      message: 'text-blue-400',
    }
  }
};

// Use forwardRef to properly handle refs passed by Framer Motion
export const ToastItem = forwardRef<HTMLDivElement, ToastProps>(
  ({ toast, onDismiss }, ref) => {
    const { isDark } = useTheme();
    const { type, message, title, id, actionLabel, onAction, duration = 5000 } = toast;
    const settings = toastSettings[type];
    const styles = isDark ? settings.darkStyles : settings.lightStyles;
    const [paused, setPaused] = React.useState(false);
    const [progress, setProgress] = React.useState(100);
    const progressRef = React.useRef<number>(100);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = React.useRef<number>(Date.now());
    const remainingRef = React.useRef<number>(duration);
    const [touchStartX, setTouchStartX] = React.useState<number | null>(null);
    const [touchDeltaX, setTouchDeltaX] = React.useState(0);

    // Progress bar logic (pause/resume)
    React.useEffect(() => {
      if (paused) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        remainingRef.current = remainingRef.current - (Date.now() - startTimeRef.current);
        return;
      }
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const percent = Math.max(0, 100 - (100 * (duration - remainingRef.current + elapsed) / duration));
        setProgress(percent);
        progressRef.current = percent;
        if (percent <= 0) {
          onDismiss(id);
        }
      }, 50);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [paused, duration, id, onDismiss]);

    // Touch swipe to dismiss (mobile)
    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
    };
    const handleTouchMove = (e: React.TouchEvent) => {
      if (touchStartX !== null) {
        setTouchDeltaX(e.touches[0].clientX - touchStartX);
      }
    };
    const handleTouchEnd = () => {
      if (Math.abs(touchDeltaX) > 80) {
        onDismiss(id);
      }
      setTouchStartX(null);
      setTouchDeltaX(0);
    };
    
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } }}
        className={cn(
          'p-4 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm relative',
          styles.bg,
          styles.border,
          'select-none',
          'transition-all duration-200',
          'focus-within:ring-2 focus-within:ring-purple-400',
          'outline-none',
          'z-[1000]',
          'mobile:py-6 mobile:px-5'
        )}
        role="alert"
        aria-live="assertive"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${touchDeltaX}px)` }}
      >
        <div className="flex items-start gap-3">
          <div className={cn("flex-shrink-0 w-6 h-6 mt-0.5 text-xl", styles.iconColor)}>
            <CheckCircle className="h-5 w-5 bg-gradient-to-r from-green-400 to-red-500 text-transparent bg-clip-text" />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className={cn("text-sm font-medium mb-1", styles.title)}>
                {title}
              </h3>
            )}
            <p className={cn("text-sm break-words", styles.message)}>{message}</p>
            {actionLabel && onAction && (
              <button
                onClick={() => {
                  onAction();
                  onDismiss(id);
                }}
                className={cn(
                  "mt-2 text-xs font-medium rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 px-2 py-1",
                  type === 'success' ? 'text-green-600 dark:text-green-400' :
                  type === 'error' ? 'text-red-600 dark:text-red-400' :
                  type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-blue-600 dark:text-blue-400'
                )}
                tabIndex={0}
              >
                {actionLabel}
              </button>
            )}
          </div>
          <button
            onClick={() => onDismiss(id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 p-2"
            aria-label="Close notification"
            tabIndex={0}
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
        {/* Progress bar for auto-dismiss */}
        <motion.div
          className={cn(
            "h-0.5 absolute bottom-0 left-0 right-0",
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          )}
          initial={{ width: "100%" }}
          animate={{ width: paused ? `${progress}%` : 0 }}
          transition={{ 
            duration: paused ? 0 : (progress / 100) * (duration / 1000),
            ease: "linear"
          }}
        />
      </motion.div>
    );
  }
);

// Set display name for easier debugging
ToastItem.displayName = 'ToastItem';

// Toast container
interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  onDismiss,
  position = 'bottom-right'
}) => {
  // Define position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  return (
    <div className={`fixed z-[1000] flex flex-col gap-2 max-w-full w-full pointer-events-none ${positionClasses[position]}`} style={{ maxWidth: '100vw' }} aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onDismiss={onDismiss} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}; 