import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { handleSpotifyCallback } from '../lib/spotifyAuth';
import { EnhancedGradientText } from './ui/EnhancedGradientText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faExclamationTriangle, faExclamationCircle, faArrowLeft, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { isMobileDevice, isAndroidDevice, detectConnectionQuality } from '../lib/utils';
import GlassmorphicContainer from './ui/GlassmorphicContainer';
import { cn } from '../lib/utils';
import { useTheme } from '../lib/ThemeContext';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'network-error' | 'auth-required'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'slow' | 'limited' | 'offline'>('good');
  const [retryCount, setRetryCount] = useState(0);
  const { isDark } = useTheme();
  
  useEffect(() => {
    // Detect device type for better error handling
    setIsMobile(isMobileDevice());
    setIsAndroid(isAndroidDevice());
    setConnectionQuality(detectConnectionQuality());
    
    const processCallback = async () => {
      try {
        // Wait for auth loading to complete
        if (authLoading) {
          console.log("Waiting for auth loading to complete...");
          return;
        }

        // Check network connectivity first
        const currentConnectionQuality = detectConnectionQuality();
        setConnectionQuality(currentConnectionQuality);
        
        if (currentConnectionQuality === 'offline') {
          setStatus('network-error');
          setError('You appear to be offline. Please check your internet connection.');
          return;
        }
        
        // Verify that user is logged in - CRITICAL CHECK!
        if (!user) {
          console.error("User not logged in during Spotify authentication");
          setStatus('auth-required');
          setError('You need to be logged in to connect your Spotify account');
          return;
        }
        
        // Handle the callback (token is in URL)
        const result = await handleSpotifyCallback();
        
        if (!result.success) {
          // For mobile devices, especially Android, check if error might be related to
          // network conditions or timeouts
          if (isMobileDevice() && 
              (result.error?.includes('timeout') || 
               result.error?.includes('network') || 
               result.error?.includes('connection'))) {
            setStatus('network-error');
            setError(result.error || 'Network issue during Spotify authentication');
          } else {
            setStatus('error');
            setError(result.error || 'Failed to authenticate with Spotify');
          }
          return;
        }
        
        setStatus('success');
        
        // Redirect after a short delay
        // Use a longer delay on mobile to ensure the success message is seen
        const redirectDelay = isMobileDevice() ? 3000 : 2000;
        setTimeout(() => {
          // Get return path from localStorage or default to home
          const returnPath = localStorage.getItem('spotify_auth_return_path') || '/';
          localStorage.removeItem('spotify_auth_return_path');
          navigate(returnPath);
        }, redirectDelay);
      } catch (error) {
        console.error('Error in Spotify callback:', error);
        
        // Check if it's a network error
        if (error instanceof Error && 
            (error.message.includes('network') || 
             error.message.includes('connection') || 
             error.message.includes('offline'))) {
          setStatus('network-error');
        } else {
          setStatus('error');
        }
        
        setError(error instanceof Error ? error.message : 'Failed to authenticate with Spotify');
      }
    };
    
    // Only run the callback processing if not still loading auth state
    if (!authLoading) {
      processCallback();
    }
  }, [navigate, user, retryCount, authLoading]);
  
  const handleRetry = () => {
    setStatus('loading');
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  const handleLogin = () => {
    // Save current URL to return after login
    localStorage.setItem('auth_return_path', window.location.pathname);
    navigate('/login');
  };
  
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 pt-safe pb-safe">
      <GlassmorphicContainer 
        className="max-w-md w-full p-6 sm:p-8 text-center"
        animate={true}
        rounded="2xl"
        shadow="lg"
      >
        <EnhancedGradientText
          variant="spotify"
          size="lg"
          className="mb-6"
        >
          Spotify Authentication
        </EnhancedGradientText>
        
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-green-500" />
            </div>
            <p className={cn(
              "text-base",
              isDark ? "text-gray-200" : "text-gray-700"
            )}>
              {isMobile ? 'Connecting to Spotify... Please wait' : 'Connecting to Spotify...'}
            </p>
            {isMobile && connectionQuality === 'slow' && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                Slow connection detected. This may take a bit longer.
              </p>
            )}
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-green-500" />
            </div>
            <p className={cn(
              "text-xl font-medium mb-2",
              isDark ? "text-white" : "text-gray-800"
            )}>
              Successfully Connected!
            </p>
            <p className={cn(
              "text-sm",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              Your Spotify account is now connected. Redirecting you back{isMobile ? ' to the app' : ''}...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-red-500" />
            </div>
            <p className={cn(
              "text-xl font-medium mb-2",
              isDark ? "text-white" : "text-gray-800"
            )}>
              Connection Error
            </p>
            {error && (
              <p className={cn(
                "text-sm mb-4 max-w-xs mx-auto",
                "text-red-500 dark:text-red-400"
              )}>
                {error}
              </p>
            )}
            {isAndroid && (
              <p className={cn(
                "text-xs mb-4",
                isDark ? "text-gray-400" : "text-gray-500"
              )}>
                If you're using Android, try closing your browser completely and trying again.
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => navigate('/')}
                className={cn(
                  "px-4 py-3 rounded-xl flex items-center justify-center transition-all",
                  "hover:scale-[1.02]",
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900",
                  "text-sm sm:text-base flex-1"
                )}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Go Back
              </button>
              <button
                onClick={handleRetry}
                className={cn(
                  "px-4 py-3 rounded-xl flex items-center justify-center transition-all",
                  "bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02]",
                  "text-sm sm:text-base flex-1"
                )}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {status === 'network-error' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl text-amber-500" />
            </div>
            <p className={cn(
              "text-xl font-medium mb-2",
              isDark ? "text-white" : "text-gray-800"
            )}>
              Network Issue Detected
            </p>
            {error && (
              <p className={cn(
                "text-sm mb-4 max-w-xs mx-auto",
                "text-amber-600 dark:text-amber-400"
              )}>
                {error}
              </p>
            )}
            <p className={cn(
              "text-sm mb-6",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              {isMobile 
                ? 'Mobile networks can sometimes interrupt authentication. Try switching to WiFi if available.'
                : 'Please check your internet connection and try again.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => navigate('/')}
                className={cn(
                  "px-4 py-3 rounded-xl flex items-center justify-center transition-all",
                  "hover:scale-[1.02]",
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900",
                  "text-sm sm:text-base flex-1"
                )}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Go Back
              </button>
              <button
                onClick={handleRetry}
                className={cn(
                  "px-4 py-3 rounded-xl flex items-center justify-center transition-all",
                  "bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.02]",
                  "text-sm sm:text-base flex-1"
                )}
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {status === 'auth-required' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl text-blue-500" />
            </div>
            <p className={cn(
              "text-xl font-medium mb-2",
              isDark ? "text-white" : "text-gray-800"
            )}>
              Authentication Required
            </p>
            {error && (
              <p className={cn(
                "text-sm mb-4 max-w-xs mx-auto",
                "text-blue-500 dark:text-blue-400"
              )}>
                {error}
              </p>
            )}
            <p className={cn(
              "text-sm mb-6",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              You need to sign in to your account before connecting Spotify.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => navigate('/')}
                className={cn(
                  "px-4 py-3 rounded-xl flex items-center justify-center transition-all",
                  "hover:scale-[1.02]",
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900",
                  "text-sm sm:text-base flex-1"
                )}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Go Back
              </button>
              <button
                onClick={handleLogin}
                className={cn(
                  "px-4 py-3 rounded-xl flex items-center justify-center transition-all",
                  "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]",
                  "text-sm sm:text-base flex-1"
                )}
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Sign In
              </button>
            </div>
          </div>
        )}
      </GlassmorphicContainer>
    </div>
  );
};

export default SpotifyCallback; 