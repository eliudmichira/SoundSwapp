// src/components/Login.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo, useReducer } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import '../styles/color-system.css'; // Import the new color system
import { cn } from '../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpotify, faYoutube, faGoogle, faApple 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope, faLock, faUser, faSpinner, 
  faEye, faEyeSlash, faArrowRight, faChevronLeft,
  faPhone, faCheck, faInfoCircle, faCircleExclamation, 
  faShieldHalved, faWifi, faMusic, faCompactDisc,
  faFingerprint, faKey, faCheckCircle, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

// Import UI components
import { ParticleField } from '../components/ui/ParticleField';
import { MorphingBlob } from '../components/ui/MorphingBlob';
import { FloatingElements } from './ui/FloatingElements';
import { GlowButton } from '../components/ui/GlowButton';

// Import Firebase utils
import { reconnectFirestore, handleAndroidAuth } from '../lib/firebase';

// Types
type FormTab = 'login' | 'register';
type NetworkStatusType = 'online' | 'offline' | 'slow';
type FieldError = Record<string, string>;
type SocialProvider = 'google' | 'apple';

// Enhanced security types
interface SecurityMetrics {
  failedAttempts: number;
  lastAttempt: number;
  isBlocked: boolean;
  blockExpiry?: number;
}

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
  honeypot: string; // Bot protection
}

// Action types for reducer
type FormAction = 
  | { type: 'SET_FIELD'; field: keyof FormState; value: string }
  | { type: 'RESET_FORM' }
  | { type: 'RESET_PASSWORDS' };

// Form reducer for better state management
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET_FORM':
      return {
        email: state.email, // Keep email
        password: '',
        confirmPassword: '',
        name: '',
        phoneNumber: '',
        honeypot: ''
      };
    case 'RESET_PASSWORDS':
      return { ...state, password: '', confirmPassword: '' };
    default:
      return state;
  }
};

// Constants
const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  special: /[!@#$%^&*(),.?":{}|<>]/
};

// List of supported authentication providers
const SOCIAL_PROVIDERS: {
  key: SocialProvider;
  label: string;
  icon: any;
  enabled: boolean;
  color: string;
}[] = [
  { key: 'google', label: 'Google', icon: faGoogle, enabled: true, color: 'hover:bg-red-50 hover:border-red-300' },
  { key: 'apple', label: 'Apple', icon: faApple, enabled: true, color: 'hover:bg-gray-50 hover:border-gray-400' },
];

// Helper functions
const isAndroidDevice = (): boolean => /Android/i.test(navigator.userAgent);
const isMobileDevice = (): boolean => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOSDevice = (): boolean => /iPad|iPhone|iPod/.test(navigator.userAgent);

// Security helper functions
const getSecurityMetrics = (): SecurityMetrics => {
  try {
    const stored = sessionStorage.getItem('auth_security_metrics');
    if (stored) {
      const metrics = JSON.parse(stored);
      // Check if block has expired
      if (metrics.isBlocked && metrics.blockExpiry && Date.now() > metrics.blockExpiry) {
        metrics.isBlocked = false;
        metrics.failedAttempts = 0;
        delete metrics.blockExpiry;
        sessionStorage.setItem('auth_security_metrics', JSON.stringify(metrics));
      }
      return metrics;
    }
  } catch (e) {
    console.error('Error reading security metrics:', e);
  }
  return { failedAttempts: 0, lastAttempt: 0, isBlocked: false };
};

const updateSecurityMetrics = (failed: boolean) => {
  const metrics = getSecurityMetrics();
  
  if (failed) {
    metrics.failedAttempts++;
    metrics.lastAttempt = Date.now();
    
    if (metrics.failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      metrics.isBlocked = true;
      metrics.blockExpiry = Date.now() + BLOCK_DURATION;
    }
  } else {
    // Reset on successful login
    metrics.failedAttempts = 0;
    metrics.isBlocked = false;
    delete metrics.blockExpiry;
  }
  
  sessionStorage.setItem('auth_security_metrics', JSON.stringify(metrics));
};

// Password strength calculator
const calculatePasswordStrength = (password: string): {
  score: number;
  feedback: string[];
  isSecure: boolean;
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= PASSWORD_MIN_LENGTH) score++;
  else feedback.push(`At least ${PASSWORD_MIN_LENGTH} characters`);
  
  if (password.length >= 12) score++;
  
  if (PASSWORD_REGEX.uppercase.test(password)) score++;
  else feedback.push('Include uppercase letters');
  
  if (PASSWORD_REGEX.lowercase.test(password)) score++;
  else feedback.push('Include lowercase letters');
  
  if (PASSWORD_REGEX.number.test(password)) score++;
  else feedback.push('Include numbers');
  
  if (PASSWORD_REGEX.special.test(password)) score++;
  else feedback.push('Include special characters');
  
  // Check for common patterns
  const commonPatterns = ['password', '12345', 'qwerty', 'admin'];
  const hasCommonPattern = commonPatterns.some(pattern => 
    password.toLowerCase().includes(pattern)
  );
  
  if (hasCommonPattern) {
    score = Math.max(1, score - 2);
    feedback.push('Avoid common patterns');
  }
  
  return {
    score: Math.min(5, score),
    feedback,
    isSecure: score >= 4
  };
};

/**
 * Enhanced FormField component with improved accessibility
 */
interface FormFieldProps {
  id: string;
  label?: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  placeholder?: string;
  icon: React.ReactNode;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  minLength?: number;
  maxLength?: number;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
  pattern?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    id, label, type, value, onChange, onBlur, onFocus, error, placeholder, icon, 
    required, autoComplete, inputMode, minLength, maxLength, className, 
    onKeyDown, rightElement, disabled, 'aria-label': ariaLabel, pattern
  }, ref) => {
    const fieldId = `field-${id}`;
    const errorId = `${fieldId}-error`;
    
    return (
      <div className="group relative">
        {label && (
          <label 
            htmlFor={fieldId} 
            className={cn(
              "block text-sm font-medium mb-2 transition-colors",
              "text-content-secondary",
              error ? "text-red-500" : "",
              disabled && "text-content-disabled"
            )}
          >
            {label} {required && <span className="text-red-500" aria-label="required">*</span>}
          </label>
        )}
        <div className={cn(
          "absolute left-0 pl-3 flex items-center pointer-events-none transition-all duration-200",
          "group-focus-within:text-brand-primary",
          error ? "text-red-400" : "text-content-tertiary",
          "top-1/2 -translate-y-1/2",
          label ? "mt-[0.875rem]" : "",
          disabled && "opacity-50"
        )}>
          {icon}
        </div>
        <input
          ref={ref}
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className={cn(
            "block w-full pl-10 py-3 border rounded-xl",
            rightElement ? "pr-10" : "pr-3",
            "transition-all duration-200 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-[color:var(--input-focus-ring)] focus:border-brand-primary",
            "bg-input/80 backdrop-blur-sm",
            "border-input hover:border-border-hover",
            "text-content-primary placeholder-content-tertiary",
            error ? "border-input-error-border focus:ring-red-500/50" : "",
            disabled && "opacity-50 cursor-not-allowed bg-input-error",
            className
          )}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          minLength={minLength}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-label={ariaLabel || label}
          pattern={pattern}
        />
        {rightElement && (
          <div className={cn(
            "absolute right-0 inset-y-0 pr-3 flex items-center",
            "top-1/2 -translate-y-1/2",
            label ? "mt-[0.875rem]" : ""
          )}>
            {rightElement}
          </div>
        )}
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-[color:var(--color-error)] flex items-center"
            id={errorId}
            role="alert"
          >
            <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

/**
 * Google One Tap Component
 */
const GoogleOneTap: React.FC<{ onSuccess: (credential: string) => void }> = ({ onSuccess }) => {
  useEffect(() => {
    if (!(window as any).google) return;
    
    try {
      (window as any).google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.credential) {
            onSuccess(response.credential);
          }
        },
        auto_select: true,
        cancel_on_tap_outside: false,
      });
      
      // Show One Tap UI
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('One Tap not displayed:', notification.getNotDisplayedReason());
        }
      });
    } catch (error) {
      console.error('Google One Tap initialization error:', error);
    }
  }, [onSuccess]);
  
  return null;
};

/**
 * Enhanced Main Login Component
 */
const Login: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    signInWithEmail, 
    signIn,
    signInWithCredential,
    loading: authLoading, 
    error: authError, 
    clearError,
    user,
    debugAuth
  } = useAuth();
  
  // Get the redirect path from location state
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  // Enhanced state management with reducer
  const [formState, dispatch] = useReducer(formReducer, {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
    honeypot: ''
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState<FormTab>('login');
  const [formStep, setFormStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatusType>('online');
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [authTimeout, setAuthTimeout] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Checking authentication...");
  const [sessionWarning, setSessionWarning] = useState(false);
  
  // Security state
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>(getSecurityMetrics());
  const [showSecurityTips, setShowSecurityTips] = useState(false);
  
  // Destructuring for convenience
  const { email, password, confirmPassword, name, phoneNumber, honeypot } = formState;
  
  // Combined loading state
  const loading = authLoading || isSubmitting || !!socialLoading;
  
  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Form field change handler
  const handleFieldChange = useCallback((field: keyof FormState, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [fieldErrors]);
  
  // Reset form error states
  const resetErrors = useCallback(() => {
    setError(null);
    setFieldErrors({});
    clearError();
  }, [clearError]);

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    [authTimeoutRef, sessionTimeoutRef, inactivityTimeoutRef].forEach(ref => {
      if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
      }
    });
  }, []);
  
  // Session management
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    
    // Warn after 25 minutes of inactivity
    inactivityTimeoutRef.current = setTimeout(() => {
      setSessionWarning(true);
      
      // Auto logout after 30 minutes
      sessionTimeoutRef.current = setTimeout(() => {
        setError('Your session has expired. Please log in again.');
        dispatch({ type: 'RESET_PASSWORDS' });
        setFormStep(0);
      }, 5 * 60 * 1000); // 5 more minutes
    }, 25 * 60 * 1000);
  }, []);
  
  // Monitor user activity
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      if (sessionWarning) {
        setSessionWarning(false);
        if (sessionTimeoutRef.current) {
          clearTimeout(sessionTimeoutRef.current);
        }
      }
      resetInactivityTimer();
    };
    
    events.forEach(event => window.addEventListener(event, handleActivity));
    
    // Start monitoring
    resetInactivityTimer();
    
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearAllTimeouts();
    };
  }, [sessionWarning, resetInactivityTimer, clearAllTimeouts]);
  
  // Enhanced focus management
  useEffect(() => {
    const focusDelay = 100;
    
    if (formStep === 0) {
      setIsSubmitting(false);
      setTimeout(() => emailInputRef.current?.focus(), focusDelay);
    } else if (formStep === 1) {
      setTimeout(() => {
        if (activeTab === 'register' && nameInputRef.current) {
          nameInputRef.current.focus();
        } else if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }, focusDelay);
    }
  }, [formStep, activeTab]);

  // Clean up on unmount
  useEffect(() => {
    return clearAllTimeouts;
  }, [clearAllTimeouts]);

  // Enhanced viewport configuration for mobile
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const originalContent = meta?.getAttribute('content');
    
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    return () => {
      if (meta && originalContent) {
        meta.setAttribute('content', originalContent);
      }
    };
  }, []);

  // Enhanced connection detection
  const detectConnectionSpeed = useCallback((): NetworkStatusType => {
    if (!navigator.onLine) return 'offline';
    
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn?.effectiveType && ['slow-2g', '2g'].includes(conn.effectiveType)) {
          return 'slow';
      }
    }
    
    return 'online';
  }, []);

  // Network monitoring with enhanced handling
  useEffect(() => {
    let lastStatus = detectConnectionSpeed();
    setNetworkStatus(lastStatus);
    
    const handleConnectionChange = () => {
      const newStatus = detectConnectionSpeed();
      if (newStatus !== lastStatus) {
        setNetworkStatus(newStatus);
        lastStatus = newStatus;
        
        // Show notification for connection changes
        if (newStatus === 'offline') {
          setError('You are now offline. Some features may be unavailable.');
        } else if (lastStatus === 'offline') {
          setError(null);
        }
      }
    };
    
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    // Connection API listener
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', handleConnectionChange);
    }
    
    // Periodic check for mobile
    const interval = isMobileDevice() ? setInterval(handleConnectionChange, 10000) : null;
    
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', handleConnectionChange);
      }
      if (interval) clearInterval(interval);
    };
  }, [detectConnectionSpeed]);

  // Enhanced field validation
  const validateField = useCallback((field: string, value: string): string | null => {
    switch (field) {
      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;
        
      case 'password':
        if (!value) return 'Password is required';
        if (activeTab === 'login') {
          if (value.length < 6) return 'Password must be at least 6 characters';
        } else {
          const strength = calculatePasswordStrength(value);
          if (!strength.isSecure) {
            return `Password is too weak. ${strength.feedback[0]}`;
          }
        }
        return null;
        
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
        return null;
        
      case 'name':
        if (!value && activeTab === 'register') return 'Name is required';
        if (value && value.length < 2) return 'Name must be at least 2 characters';
        if (value && !/^[a-zA-Z\s'-]+$/.test(value)) return 'Name contains invalid characters';
        return null;
        
      case 'phoneNumber':
        if (value && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) {
          return 'Please enter a valid phone number';
        }
        return null;
        
      case 'acceptTerms':
        if (!acceptTerms && activeTab === 'register') return 'You must accept the Terms of Service';
        return null;
        
      default:
        return null;
    }
  }, [activeTab, password, acceptTerms]);

  // Handle field blur
  const handleBlur = useCallback((field: string, value: string) => {
    const errorMessage = validateField(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: errorMessage || ''
    }));
  }, [validateField]);

  // Validate email step
  const validateEmailStep = useCallback((): boolean => {
    resetErrors();
    
    // Check for bot submission
    if (honeypot) {
      console.warn('Bot submission detected');
      return false;
    }
    
    const emailError = validateField('email', email);
    if (emailError) {
      setFieldErrors({ email: emailError });
      return false;
    }
    
    return true;
  }, [email, honeypot, resetErrors, validateField]);
  
  // Validate password step
  const validatePasswordStep = useCallback((): boolean => {
    resetErrors();
    
    const errors: FieldError = {};
    let isValid = true;
    
    // Check security metrics
    const metrics = getSecurityMetrics();
    if (metrics.isBlocked) {
      const remainingTime = Math.ceil((metrics.blockExpiry! - Date.now()) / 60000);
      setError(`Too many failed attempts. Please try again in ${remainingTime} minutes.`);
      return false;
    }
    
    // Validate all fields
    const fieldsToValidate = activeTab === 'register' 
      ? ['password', 'name', 'confirmPassword'] 
      : ['password'];
    
    fieldsToValidate.forEach(field => {
      const value = formState[field as keyof FormState];
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });
    
    if (activeTab === 'register' && !acceptTerms) {
      errors.acceptTerms = 'You must accept the Terms of Service';
          isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  }, [activeTab, acceptTerms, formState, resetErrors, validateField]);

  // Multi-step navigation
  const handleNextStep = useCallback(() => {
    if (formStep === 0 && validateEmailStep()) {
      setFormStep(1);
    }
  }, [formStep, validateEmailStep]);
  
  const handlePrevStep = useCallback(() => {
    setFormStep(0);
    setFieldErrors({});
    resetErrors();
    setIsSubmitting(false);
  }, [resetErrors]);

  // Tab switching
  const switchMode = useCallback((mode: FormTab) => {
    setActiveTab(mode);
    setFormStep(0);
    resetErrors();
    setFieldErrors({});
    dispatch({ type: 'RESET_FORM' });
    setAcceptTerms(false);
    setIsSubmitting(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [resetErrors]);

  // Enhanced email authentication
  const handleEmailAuth = useCallback(async () => {
    if (formStep === 0) {
      handleNextStep();
      return;
    }
    
    if (isSubmitting || honeypot) return;
    
    if (!validatePasswordStep()) return;

    const currentNetworkStatus = detectConnectionSpeed();
    if (currentNetworkStatus === 'offline') {
      setError('You appear to be offline. Please check your internet connection.');
      return;
    }
    
    setIsSubmitting(true);
    clearAllTimeouts();
    
    try {
      // Set appropriate timeout
      const timeout = isAndroidDevice() ? 30000 : 20000;
      
      authTimeoutRef.current = setTimeout(() => {
        setIsSubmitting(false);
        setError('Authentication timed out. Please try again.');
        updateSecurityMetrics(true);
      }, timeout);
      
      // Attempt reconnection
      if (isAndroidDevice()) {
        await reconnectFirestore().catch(() => {});
      }
      
      resetErrors();
      
      // Perform authentication
          let authPromise;
          if (activeTab === 'login') {
            authPromise = signInWithEmail(email, password, undefined, rememberMe);
          } else {
            authPromise = signInWithEmail(email, password, name, rememberMe, phoneNumber);
          }
          
      await authPromise;
      
      // Success
      updateSecurityMetrics(false);
      clearAllTimeouts();
      setIsSubmitting(false);
      
      // Navigate after brief delay
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      
    } catch (err) {
      console.error('Authentication error:', err);
      clearAllTimeouts();
      setIsSubmitting(false);
      updateSecurityMetrics(true);
      
      // Enhanced error messages
      if (err instanceof Error) {
        const errorMap: Record<string, string> = {
          'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
          'auth/user-not-found': 'No account exists with this email address.',
          'auth/wrong-password': 'Incorrect password. Please try again.',
          'auth/email-already-in-use': 'This email is already registered. Please sign in.',
          'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
          'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
          'auth/network-request-failed': 'Network error. Please check your connection.',
          'auth/user-disabled': 'This account has been disabled. Please contact support.',
        };
        
        const message = Object.entries(errorMap).find(([key]) => 
          err.message.includes(key)
        )?.[1] || err.message;
        
        setError(message);
        } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }, [
    activeTab, clearAllTimeouts, confirmPassword, detectConnectionSpeed, 
    email, formStep, handleNextStep, honeypot, isSubmitting, name, password, 
    phoneNumber, rememberMe, resetErrors, validatePasswordStep, navigate, 
    from, signInWithEmail
  ]);

  // Enhanced Google authentication
  const handleGoogleAuth = useCallback(async (credential?: string) => {
    setSocialLoading('google');
    
    try {
      setError(null);
      
      if (!navigator.onLine) {
        throw new Error('You appear to be offline. Please check your internet connection and try again.');
      }

      // Clear any existing timeouts
      if ((window as any).authTimeout) {
        clearTimeout((window as any).authTimeout);
      }
      
      // Add a safety timeout to prevent stuck UI state
      (window as any).authTimeout = setTimeout(() => {
        setSocialLoading(null);
        setError("Authentication request took too long. Please try again.");
      }, 25000); // 25 second timeout
      
      // Store current location as the return path
      const currentPath = window.location.pathname + window.location.search;
      const returnPath = from || currentPath;
      
      console.log('📝 Setting return path for after auth:', returnPath);
      localStorage.setItem('auth_return_path', returnPath);
      
      // Add timestamp for debugging
      localStorage.setItem('auth_request_timestamp', Date.now().toString());
      
      if (credential) {
        // One Tap sign-in
        console.log('🔄 Starting One Tap sign-in with credential');
        await signInWithCredential(credential);
        updateSecurityMetrics(false);
        
        // Clean up timeout
        if ((window as any).authTimeout) {
          clearTimeout((window as any).authTimeout);
        }
      } else {
        // Regular Google sign-in
        console.log('🔄 Starting regular Google sign-in flow');
        const isAndroid = isAndroidDevice();
        console.log(isAndroid ? '📱 Using Android-optimized flow' : '🖥️ Using standard flow');
        
        // Before starting auth, ensure no stale state remains
        localStorage.removeItem('auth_redirect_start');
        
        // Consider reconnecting Firestore before authentication
        try {
          await reconnectFirestore().catch(() => {});
        } catch (e) {
          console.warn('⚠️ Failed to reconnect Firestore before auth:', e);
        }
        
        // Add a DOM class to indicate authentication is in process
        document.body.classList.add('auth-in-progress');
        
        await signIn(isAndroid);
        
        // This code will only run for popup flows, not redirects
        console.log('✅ Google sign-in completed (likely popup method)');
        updateSecurityMetrics(false);
        document.body.classList.remove('auth-in-progress');
        
        // Clean up timeout since we completed
        if ((window as any).authTimeout) {
          clearTimeout((window as any).authTimeout);
        }
      }
    } catch (error: any) {
      console.error('❌ Google auth error:', error);
      updateSecurityMetrics(true);
      
      // Handle different error types with more specific messages
      let errorMessage = 'Error connecting to Google';
      
      if (error.message) {
        if (error.message.includes('popup-closed-by-user')) {
          errorMessage = 'Sign-in cancelled. Please try again when ready.';
        } else if (error.message.includes('popup-blocked')) {
          errorMessage = 'Sign-in popup was blocked. Please enable popups for this site and try again.';
        } else if (error.message.includes('redirect_uri_mismatch')) {
          errorMessage = 'Authentication configuration error. Please contact support.';
          console.error('❌ CRITICAL: OAuth redirect URI mismatch detected!');
          console.error('Current domain:', window.location.origin);
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Authentication timed out. Please try again.';
        } else if (error.message.includes('offline')) {
          errorMessage = 'You appear to be offline. Please check your internet connection.';
        } else if (error.message.includes('auth/invalid-credential')) {
          errorMessage = 'Invalid authentication credentials. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      // Clean up timeout if it exists
      if ((window as any).authTimeout) {
        clearTimeout((window as any).authTimeout);
      }
      
      setSocialLoading(null);
      document.body.classList.remove('auth-in-progress');
    }
  }, [signIn, signInWithCredential, from, updateSecurityMetrics]);

  // Handle social sign-in
  const handleSocialSignIn = useCallback(async (provider: SocialProvider) => {
    if (provider === 'google') {
      await handleGoogleAuth();
      } else {
      setError('Apple sign-in will be available soon');
    }
  }, [handleGoogleAuth]);
  
  // Password strength visualization
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    
    const { score } = calculatePasswordStrength(password);
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500'];
    
    return {
      score,
      label: labels[score] || labels[0],
      color: colors[score] || colors[0]
    };
  }, [password]);

  // Redirect if authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [authLoading, user, from, navigate]);

  // Session warning component
  const SessionWarning = () => (
    <AnimatePresence>
      {sessionWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-amber-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50"
        >
          <div className="flex items-start">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 mt-1" />
            <div>
              <p className="font-semibold">Session Expiring</p>
              <p className="text-sm mt-1">Your session will expire in 5 minutes due to inactivity.</p>
              <button
                onClick={() => {
                  setSessionWarning(false);
                  resetInactivityTimer();
                }}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Keep me signed in
              </button>
        </div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
    );
  
  // Loading screen
  if (authLoading && !authTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl shadow-xl text-center bg-white/90 backdrop-blur-md border border-gray-200/30"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <FontAwesomeIcon 
              icon={faKey} 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600"
            />
          </div>
          <p className="text-lg font-medium text-gray-700 mt-4">
            Authenticating...
          </p>
          <p className="text-sm mt-2 text-gray-500">
            {loadingMessage}
          </p>
        </motion.div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-background-primary">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <ParticleField 
          color="var(--particle-color, #7c3aed)"
          density={isMobileDevice() ? "low" : "high"}
          className="absolute inset-0"
        />
        
        <div className="absolute inset-0 overflow-hidden">
          <MorphingBlob 
            color="var(--morphing-blob-color-1, rgba(139, 92, 246, 0.1))" 
            position={{ top: '10%', left: '5%' }}
            size={400}
          />
          <MorphingBlob 
            color="var(--morphing-blob-color-2, rgba(168, 85, 247, 0.08))" 
            position={{ bottom: '20%', right: '10%' }}
            size={350}
            animationDuration={25}
          />
          
          <FloatingElements 
            count={15} 
            elements={[
              { icon: <FontAwesomeIcon icon={faMusic} />, color: 'var(--floating-element-music, rgba(139, 92, 246, 0.3))', size: 16 },
              { icon: <FontAwesomeIcon icon={faCompactDisc} />, color: 'var(--floating-element-disc, rgba(139, 92, 246, 0.25))', size: 22 },
              { icon: <FontAwesomeIcon icon={faSpotify} />, color: 'var(--floating-element-spotify, rgba(30, 215, 96, 0.3))', size: 18 },
              { icon: <FontAwesomeIcon icon={faYoutube} />, color: 'var(--floating-element-youtube, rgba(255, 0, 0, 0.2))', size: 20 },
            ]}
          />
        </div>
      </div>
      
      {/* Session warning */}
      <SessionWarning />
      
      {/* Google One Tap */}
      {formStep === 0 && !loading && (
        <GoogleOneTap onSuccess={handleGoogleAuth} />
      )}
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col lg:flex-row items-center">
        {/* Left side - Branding */}
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold leading-tight mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span 
                style={{ 
                  background: 'linear-gradient(to right, #FF7A59, #FF007A, #00C4CC)', 
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block',
                  fontWeight: 800,
                  textShadow: '0 0 30px rgba(255,122,89,0.3)',
                  fontSize: '4.5rem'
                }}
              >
              Sound<br />Swapp
              </span>
            </motion.h1>
            <p className="text-content-secondary text-xl md:text-2xl mb-8 max-w-md lg:max-w-lg mx-auto lg:mx-0">
              Seamlessly sync your music across all platforms
            </p>
            
            {/* Features */}
            <div className="space-y-6 mt-10 max-w-md mx-auto lg:mx-0">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start group"
              >
                <div className="bg-brand-primary/10 rounded-full p-3 mr-4 flex-shrink-0 border border-brand-primary/20 group-hover:border-brand-primary/40 transition-colors">
                  <FontAwesomeIcon icon={faMusic} className="text-brand-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-content-primary mb-1">Universal Access</h3>
                  <p className="text-content-secondary">Connect Spotify, YouTube Music, and more in one place</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start group"
              >
                <div className="bg-brand-primary/10 rounded-full p-3 mr-4 flex-shrink-0 border border-brand-primary/20 group-hover:border-brand-primary/40 transition-colors">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-brand-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-content-primary mb-1">Secure & Private</h3>
                  <p className="text-content-secondary">Your data is encrypted and never shared</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start group"
              >
                <div className="bg-brand-primary/10 rounded-full p-3 mr-4 flex-shrink-0 border border-brand-primary/20 group-hover:border-brand-primary/40 transition-colors">
                  <FontAwesomeIcon icon={faCompactDisc} className="text-brand-primary h-5 w-5" />
              </div>
                <div>
                  <h3 className="text-lg font-semibold text-content-primary mb-1">Smart Matching</h3>
                  <p className="text-content-secondary">Advanced algorithms find the right tracks every time</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface-card backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-border-default"
          >
            {/* Tabs */}
            <div className="flex border-b border-border-default">
              <button
                onClick={() => switchMode('login')}
                className={cn(
                  "flex-1 text-center py-4 font-medium transition-all duration-200",
                  activeTab === 'login' 
                    ? "text-brand-primary border-b-2 border-brand-primary bg-brand-primary/10" 
                    : "text-content-secondary hover:text-content-primary hover:bg-surface-hover"
                )}
                aria-selected={activeTab === 'login'}
                role="tab"
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode('register')}
                className={cn(
                  "flex-1 text-center py-4 font-medium transition-all duration-200",
                  activeTab === 'register' 
                    ? "text-brand-primary border-b-2 border-brand-primary bg-brand-primary/10" 
                    : "text-content-secondary hover:text-content-primary hover:bg-surface-hover"
                )}
                aria-selected={activeTab === 'register'}
                role="tab"
              >
                Sign Up
              </button>
            </div>
            
            {/* Form content */}
            <div className="p-6">
              {/* Security notice for high failed attempts */}
              {securityMetrics.failedAttempts > 2 && !securityMetrics.isBlocked && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm"
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 mr-2" />
                  <span className="text-amber-800">
                    {MAX_LOGIN_ATTEMPTS - securityMetrics.failedAttempts} attempts remaining
                  </span>
                </motion.div>
              )}
              
              {/* Honeypot field (hidden) */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => handleFieldChange('honeypot', e.target.value)}
                className="sr-only"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              
              {/* Title */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-content-primary">
                  {activeTab === 'login' ? 'Welcome back' : 'Get started'}
                </h2>
                <p className="text-content-secondary mt-1">
                  {activeTab === 'login' 
                    ? 'Sign in to continue to your playlists' 
                    : 'Create an account to start converting'
                  }
                </p>
              </div>
              
              {/* Multi-step form */}
              <AnimatePresence mode="wait">
                {formStep === 0 ? (
                  /* Step 1: Email */
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <FormField
                        id="email"
                        ref={emailInputRef}
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        onBlur={() => handleBlur('email', email)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                        placeholder="your@email.com"
                        icon={<FontAwesomeIcon icon={faEnvelope} />}
                        required
                        error={fieldErrors.email}
                        autoComplete="username"
                        inputMode="email"
                        disabled={loading || securityMetrics.isBlocked}
                      />
                    </div>
                    
                    {/* Error display */}
                    <AnimatePresence>
                    {(error || authError) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-4 overflow-hidden"
                        >
                          <div className="p-3 rounded-lg text-sm bg-[color:var(--input-error-bg)] text-[color:var(--color-error)] border border-[color:var(--input-error-border)] backdrop-blur-sm">
                        <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
                        {error || authError}
                      </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                    
                    {/* Continue button */}
                    <GlowButton
                      onClick={handleNextStep}
                      disabled={!email.trim() || loading || securityMetrics.isBlocked}
                      className="w-full"
                    >
                      <span>Continue</span>
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </GlowButton>
                    
                    {/* Social login */}
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border-default"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-3 bg-surface-card text-content-secondary">Or continue with</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {SOCIAL_PROVIDERS.filter(p => p.enabled).map(provider => (
                          <motion.button
                            key={provider.key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSocialSignIn(provider.key)}
                            disabled={loading || securityMetrics.isBlocked}
                            className={cn(
                              "flex items-center justify-center space-x-2 py-3 px-4 rounded-xl",
                              "border bg-surface-elevated backdrop-blur-sm",
                              "transition-all duration-200",
                              "hover:shadow-md hover:bg-surface-elevated-hover",
                              "focus:outline-none focus:ring-2 focus:ring-brand-primary/50",
                              "border-border-default hover:border-border-hover",
                              loading && "opacity-50 cursor-not-allowed",
                              provider.key === 'google' && "social-google",
                              provider.key === 'apple' && "social-apple"
                            )}
                          >
                            <FontAwesomeIcon 
                              icon={socialLoading === provider.key ? faSpinner : provider.icon} 
                              className={cn(
                                "w-5 h-5",
                                socialLoading === provider.key && "animate-spin",
                                provider.key === 'google' && "text-[color:var(--social-icon)]",
                                provider.key === 'apple' && "text-[color:var(--social-icon)]"
                              )} 
                            />
                            <span className={cn(
                              "font-medium",
                              provider.key === 'google' && "text-[color:var(--social-text)]",
                              provider.key === 'apple' && "text-[color:var(--social-text)]"
                            )}>{provider.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Security tips toggle */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowSecurityTips(!showSecurityTips)}
                        className="text-sm text-content-tertiary hover:text-content-primary flex items-center mx-auto"
                      >
                        <FontAwesomeIcon icon={faShieldHalved} className="mr-1" />
                        Security tips
                      </button>
                      
                      <AnimatePresence>
                        {showSecurityTips && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 text-left bg-surface-alt p-3 rounded-lg text-sm border border-border-default"
                          >
                            <ul className="space-y-1 text-content-secondary">
                              <li>• Always use a unique password</li>
                              <li>• Enable two-factor authentication when available</li>
                              <li>• Never share your login credentials</li>
                              <li>• Check for HTTPS in the address bar</li>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  /* Step 2: Password and additional fields */
                  <motion.div
                    key="password-step"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={handlePrevStep}
                      className="mb-4 flex items-center text-sm font-medium text-content-secondary hover:text-content-primary transition-colors"
                      type="button"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} className="mr-1" />
                      Back to email
                    </button>
                    
                    <div className="space-y-4">
                      {activeTab === 'register' && (
                        <>
                          <FormField
                            id="name"
                            ref={nameInputRef}
                            label="Full Name"
                            type="text"
                            value={name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            onBlur={() => handleBlur('name', name)}
                            placeholder="John Doe"
                            icon={<FontAwesomeIcon icon={faUser} />}
                            required
                            error={fieldErrors.name}
                            autoComplete="name"
                            maxLength={50}
                            disabled={loading}
                          />
                          
                          <FormField
                            id="phone"
                            label="Phone Number (optional)"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                            onBlur={() => handleBlur('phoneNumber', phoneNumber)}
                            placeholder="+1 (555) 123-4567"
                            icon={<FontAwesomeIcon icon={faPhone} />}
                            error={fieldErrors.phoneNumber}
                            autoComplete="tel"
                            inputMode="tel"
                            disabled={loading}
                          />
                        </>
                      )}
                      
                      <FormField
                        id="password"
                            ref={passwordInputRef}
                        label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => handleFieldChange('password', e.target.value)}
                            onBlur={() => handleBlur('password', password)}
                        onFocus={() => activeTab === 'register' && setShowPasswordHints(true)}
                            onKeyDown={(e) => {
                          if (e.key === 'Enter' && activeTab === 'login') {
                                handleEmailAuth();
                              }
                            }}
                            placeholder="Enter your password"
                        icon={<FontAwesomeIcon icon={faLock} />}
                            required
                        error={fieldErrors.password}
                        autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                        minLength={activeTab === 'register' ? 8 : 6}
                        disabled={loading}
                        rightElement={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-content-tertiary hover:text-content-primary focus:outline-none"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                          </button>
                        }
                      />
                      
                      {/* Password strength indicator */}
                      {activeTab === 'register' && password && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-content-secondary">Password strength:</span>
                            <span className={cn(
                              "font-medium",
                              passwordStrength.score <= 2 ? "text-[color:var(--color-error)]" :
                              passwordStrength.score <= 3 ? "text-[color:var(--color-warning)]" :
                              "text-[color:var(--color-success)]"
                            )}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="flex h-2 w-full rounded-full overflow-hidden bg-background-tertiary">
                            {[0, 1, 2, 3, 4].map((index) => (
                              <motion.div
                                key={index}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: index < passwordStrength.score ? 1 : 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={cn(
                                  "h-full origin-left",
                                  "w-1/5",
                                  index < passwordStrength.score && [
                                    "bg-[color:var(--color-error)]",        // Score 1
                                    "bg-orange-500",                       // Score 2 (Consider a CSS var e.g., --color-warning-light)
                                    "bg-[color:var(--color-warning)]",     // Score 3
                                    "bg-lime-500",                         // Score 4 (Consider a CSS var e.g., --color-success-light)
                                    "bg-[color:var(--color-success)]"      // Score 5
                                  ][passwordStrength.score - 1]
                                )}
                              />
                            ))}
                          </div>
                          
                          {showPasswordHints && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/20"
                            >
                              <p className="text-xs font-medium text-brand-primary mb-2">
                                <FontAwesomeIcon icon={faShieldHalved} className="mr-1" />
                                Strong passwords include:
                              </p>
                              <ul className="space-y-1 text-xs text-brand-primary/80">
                                {calculatePasswordStrength(password).feedback.map((tip, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="mr-1 text-brand-primary/60" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                      
                      {activeTab === 'register' && (
                          <FormField
                            id="confirmPassword"
                            label="Confirm Password"
                          type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                            onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                          placeholder="Re-enter your password"
                            icon={<FontAwesomeIcon icon={faLock} />}
                            required
                            error={fieldErrors.confirmPassword}
                          autoComplete="new-password"
                          disabled={loading}
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="text-content-tertiary hover:text-content-primary focus:outline-none"
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </button>
                          }
                        />
                      )}
                      
                      {/* Remember me / Forgot password */}
                      {activeTab === 'login' && (
                        <div className="flex items-center justify-between">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-border-default rounded"
                              disabled={loading}
                            />
                            <span className="ml-2 text-sm text-content-secondary">Remember me</span>
                            </label>
                          <button
                            type="button"
                            onClick={() => alert('Password reset coming soon')}
                            className="text-sm font-medium text-brand-primary hover:text-brand-secondary"
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}
                      
                      {/* Terms acceptance */}
                      {activeTab === 'register' && (
                        <div className="flex items-start">
                            <input
                              id="terms"
                              type="checkbox"
                              checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                              className={cn(
                              "mt-0.5 h-4 w-4 rounded border-border-default text-brand-primary",
                              "focus:ring-brand-primary",
                              fieldErrors.acceptTerms && "border-input-error-border"
                            )}
                            disabled={loading}
                          />
                          <label htmlFor="terms" className="ml-2 text-sm text-content-secondary">
                            I agree to the{' '}
                            <a href="#" className="text-brand-primary hover:text-brand-secondary underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-brand-primary hover:text-brand-secondary underline">
                              Privacy Policy
                            </a>
                            </label>
                        </div>
                      )}
                      
                            {fieldErrors.acceptTerms && (
                        <p className="text-sm text-color-error">
                          <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
                                {fieldErrors.acceptTerms}
                              </p>
                      )}
                      
                      {/* Error display */}
                      <AnimatePresence>
                      {(error || authError) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 rounded-lg text-sm bg-[color:var(--input-error-bg)] text-[color:var(--color-error)] border border-[color:var(--input-error-border)] backdrop-blur-sm">
                          <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
                          {error || authError}
                        </div>
                          </motion.div>
                      )}
                      </AnimatePresence>
                      
                      {/* Submit button */}
                      <GlowButton
                        onClick={handleEmailAuth}
                        disabled={loading || securityMetrics.isBlocked || (
                          activeTab === 'login' 
                            ? !password 
                            : !name || !password || !confirmPassword || !acceptTerms
                        )}
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon 
                              icon={activeTab === 'login' ? faFingerprint : faCheckCircle} 
                              className="mr-2" 
                            />
                            <span>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</span>
                          </>
                        )}
                      </GlowButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Network status */}
          <AnimatePresence>
            {networkStatus !== 'online' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={cn(
                  "mt-4 p-3 rounded-xl text-sm flex items-center backdrop-blur-sm",
                  networkStatus === 'offline' 
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                )}
              >
                <FontAwesomeIcon icon={faWifi} className="mr-2" />
                <span>
                  {networkStatus === 'offline' 
                    ? 'You are offline. Some features may be unavailable.'
                    : 'Slow connection detected. This may take longer.'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Platform badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-content-tertiary mb-3">Trusted by music lovers worldwide</p>
            <div className="flex justify-center gap-3">
              <div className="flex items-center bg-surface-elevated backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-border-default">
                <FontAwesomeIcon icon={faSpotify} className="text-green-500 mr-1.5" />
                <span className="text-xs font-medium text-content-primary">Spotify</span>
              </div>
              <div className="flex items-center bg-surface-elevated backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-border-default">
                <FontAwesomeIcon icon={faYoutube} className="text-red-500 mr-1.5" />
                <span className="text-xs font-medium text-content-primary">YouTube</span>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
    </div>
  );
};

export default Login;