import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { 
  handleYouTubeCallback,
  getYouTubeToken,
  isYouTubeAuthenticated 
} from '../lib/youtubeAuth';
import { EnhancedGradientText } from './ui/EnhancedGradientText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faCheckCircle, 
  faExclamationTriangle, 
  faExclamationCircle, 
  faArrowLeft, 
  faSignInAlt,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import GlassmorphicContainer from './ui/GlassmorphicContainer';
import { cn } from '../lib/utils';
import { useTheme } from '../lib/ThemeContext';

const MAX_AUTH_WAIT = 10000; // 10 seconds
const AUTH_CHECK_INTERVAL = 500; // 0.5 seconds

const YouTubeCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, setHasYouTubeAuth } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'auth-required' | 'auth-waiting'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { isDark } = useTheme();
  const [authWaitTime, setAuthWaitTime] = useState(0);
  
  useEffect(() => {
    let authCheckInterval: NodeJS.Timeout;
    let authTimeout: NodeJS.Timeout;
    let isMounted = true;

    const processCallback = async () => {
      try {
        // Save callback URL immediately
        const currentUrl = window.location.href;
        sessionStorage.setItem('youtube_callback_url', currentUrl);
        
        setDebugInfo('Starting callback processing...');
        console.log('User signed in:', !!user);
        
        // If not signed in, start waiting for auth
        if (!user && !authLoading) {
          setStatus('auth-waiting');
          let waitTime = 0;
          
          // Start auth check interval
          authCheckInterval = setInterval(() => {
            waitTime += AUTH_CHECK_INTERVAL;
            if (isMounted) {
              setAuthWaitTime(waitTime);
            }
            
            // Check if auth state has been restored
            const auth = getAuth();
            if (auth.currentUser) {
              clearInterval(authCheckInterval);
              if (isMounted) {
                setStatus('loading');
                processCallback();
              }
            }
          }, AUTH_CHECK_INTERVAL);
          
          // Set timeout for auth waiting
          authTimeout = setTimeout(() => {
            clearInterval(authCheckInterval);
            if (isMounted) {
              setStatus('auth-required');
              setError('Authentication session expired. Please sign in again.');
            }
          }, MAX_AUTH_WAIT);
          
          return;
        }
        
        // Clear intervals if we have a user
        clearInterval(authCheckInterval);
        clearTimeout(authTimeout);

        // Require authentication
        if (!user) {
          setStatus('auth-required');
          setError('You need to be logged in to connect your YouTube account');
          return;
        }
        
        // Handle the callback
        await handleYouTubeCallback();
        
        // Verify authentication was successful
        const isAuthenticated = await isYouTubeAuthenticated();
        if (!isAuthenticated) {
          throw new Error('Failed to verify YouTube authentication');
        }
        
        // Update auth context
          setHasYouTubeAuth(true);
        setStatus('success');
        
        // Notify about successful authentication
        notifyAuthComplete();
        
        // Clean up stored URL
        sessionStorage.removeItem('youtube_callback_url');
        
        // Redirect after success message
        setTimeout(() => {
          const returnPath = localStorage.getItem('youtube_auth_return_path') || '/';
          localStorage.removeItem('youtube_auth_return_path');
          navigate(returnPath);
        }, 2000);
      } catch (err) {
        console.error('YouTube callback error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to authenticate with YouTube');
        setDebugInfo(prev => `${prev}\nError: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    if (!authLoading) {
      processCallback();
    }

    return () => {
      isMounted = false;
      clearInterval(authCheckInterval);
      clearTimeout(authTimeout);
    };
  }, [navigate, setHasYouTubeAuth, authLoading, user]);

  const handleReturnHome = () => {
    navigate('/');
  };
  
  const handleLogin = () => {
    // Save current URL to return after login
    sessionStorage.setItem('youtube_callback_url', window.location.href);
    localStorage.setItem('auth_return_path', '/youtube-callback');
    navigate('/login');
  };

  const handleRetry = () => {
    window.location.reload();
  };
  
  // Add a function to dispatch authentication event
  const notifyAuthComplete = () => {
    try {
      // Notify opener if this is a popup
      if (window.opener && window.opener !== window) {
        window.opener.postMessage({ 
          type: 'youtube-auth-complete', 
          success: true 
        }, window.location.origin);
        console.log('Sent youtube-auth-complete message to opener');
      }
      
      // Also dispatch a custom event for direct listeners
      window.dispatchEvent(new CustomEvent('youtube-auth-changed', { 
        detail: { authenticated: true } 
      }));
      console.log('Dispatched youtube-auth-changed event');
    } catch (err) {
      console.error('Error notifying about YouTube authentication:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <GlassmorphicContainer 
        className="max-w-md w-full p-8 text-center"
        animate={true}
        rounded="2xl"
        shadow="lg"
      >
        <EnhancedGradientText
          variant="youtube"
          size="lg"
          className="mb-6"
        >
          YouTube Authentication
        </EnhancedGradientText>
        
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-red-500 mb-4" />
            <p className="text-gray-200">
              Authenticating with YouTube...
            </p>
          </div>
        )}

        {status === 'auth-waiting' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faSync} spin className="text-3xl text-blue-500" />
            </div>
            <p className="text-xl font-medium mb-2 text-white">
              Restoring Session
            </p>
            <p className="text-sm text-gray-300 mb-4">
              Please wait while we restore your session...
              {authWaitTime > 0 && ` (${(MAX_AUTH_WAIT - authWaitTime) / 1000}s)`}
            </p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-green-500" />
            </div>
            <p className="text-xl font-medium mb-2 text-white">
              Successfully Connected!
            </p>
            <p className="text-sm mb-4 text-gray-300">
              Your YouTube account is now connected. Redirecting you back...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl text-red-500" />
            </div>
            <p className="text-xl font-medium mb-2 text-white">
              Authentication Failed
            </p>
            <p className="text-sm mb-6 text-red-400">
              {error}
            </p>
            <div className="flex gap-4">
            <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faSync} />
                Try Again
            </button>
              <button
                onClick={handleReturnHome}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Go Back
              </button>
            </div>
          </div>
        )}
        
        {status === 'auth-required' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-yellow-500" />
            </div>
            <p className="text-xl font-medium mb-2 text-white">
              Authentication Required
            </p>
            <p className="text-sm mb-6 text-gray-300">
              {error || 'You need to be logged in to connect your YouTube account'}
            </p>
            <div className="flex gap-4">
            <button
              onClick={handleLogin}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
                <FontAwesomeIcon icon={faSignInAlt} />
                Sign In
            </button>
              <button
                onClick={handleReturnHome}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Go Back
              </button>
            </div>
          </div>
        )}
      </GlassmorphicContainer>
    </div>
  );
};

export default YouTubeCallback; 