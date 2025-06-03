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
import { faSpinner, faCheckCircle, faExclamationTriangle, faExclamationCircle, faArrowLeft, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import GlassmorphicContainer from './ui/GlassmorphicContainer';
import { cn } from '../lib/utils';
import { useTheme } from '../lib/ThemeContext';
import { simpleGlassmorphic } from '../lib/glassmorphic';

const YouTubeCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, setHasYouTubeAuth } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'auth-required'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { isDark } = useTheme();
  
  useEffect(() => {
    // Process the OAuth callback from YouTube
    const processCallback = async () => {
      try {
        setDebugInfo('Starting callback processing...');
        
        // Wait for auth loading to complete
        if (authLoading) {
          console.log("Waiting for auth loading to complete...");
          setDebugInfo(prev => `${prev}\nWaiting for auth system to initialize...`);
          return;
        }
        
        // Verify that user is logged in - CRITICAL CHECK!
        if (!user) {
          console.error("User not logged in during YouTube authentication");
          setStatus('auth-required');
          setError('You need to be logged in to connect your YouTube account');
          setDebugInfo(prev => `${prev}\nError: User not logged in`);
          return;
        }
        
        // Get URL parameters for manual debugging
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        
        setDebugInfo(prev => `${prev}\nURL params: code=${!!code}, state=${!!state}, error=${error || 'none'}`);
        
        // Check localStorage for existing tokens before we start
        const existingToken = localStorage.getItem('youtube_access_token');
        const existingRefresh = localStorage.getItem('youtube_refresh_token');
        const existingExpiry = localStorage.getItem('youtube_token_expiry');
        
        setDebugInfo(prev => `${prev}\nExisting tokens: access=${!!existingToken}, refresh=${!!existingRefresh}, expiry=${!!existingExpiry}`);
        
        if (!code) {
          throw new Error('No authorization code found in the URL');
        }
        
        // Check if there's a stored state in both sessionStorage and localStorage
        const sessionState = sessionStorage.getItem('youtube_auth_state');
        const localState = localStorage.getItem('youtube_auth_state');
        
        setDebugInfo(prev => `${prev}\nStored states: sessionStorage=${!!sessionState}, localStorage=${!!localState}`);
        
        // Call the OAuth callback handler
        await handleYouTubeCallback();
        
        // Add a small delay to ensure token is saved
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Double-check auth status
        const token = getYouTubeToken();
        const isAuth = await isYouTubeAuthenticated();
        setDebugInfo(prev => `${prev}\nAuth check after callback: token=${!!token}, isAuth=${isAuth}`);
        
        // Check localStorage for tokens after the callback
        const newToken = localStorage.getItem('youtube_access_token');
        const newRefresh = localStorage.getItem('youtube_refresh_token');
        const newExpiry = localStorage.getItem('youtube_token_expiry');
        
        setDebugInfo(prev => `${prev}\nNew tokens: access=${!!newToken}, refresh=${!!newRefresh}, expiry=${!!newExpiry}`);
        
        // Update auth context
        if (setHasYouTubeAuth) {
          setHasYouTubeAuth(true);
          setDebugInfo(prev => `${prev}\nsetHasYouTubeAuth called`);
        }
        
        setStatus('success');
        
        // Redirect after a short delay
        setTimeout(() => {
          // Get return path from localStorage or default to home
          const returnPath = localStorage.getItem('youtube_auth_return_path') || '/';
          localStorage.removeItem('youtube_auth_return_path');
          navigate(returnPath);
        }, 3000);
      } catch (err: unknown) {
        console.error('Error handling YouTube callback:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to authenticate with YouTube');
        setDebugInfo(prev => `${prev}\nError: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    // Only run the callback processing if not still loading auth state
    if (!authLoading) {
      processCallback();
    }
  }, [navigate, setHasYouTubeAuth, authLoading, user]);
  
  const handleLogin = () => {
    // Save current URL to return after login
    localStorage.setItem('auth_return_path', window.location.pathname);
    localStorage.setItem('youtube_auth_return_path', window.location.pathname);
    navigate('/login');
  };
  
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
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
            <p className={cn(
              "text-base",
              isDark ? "text-gray-200" : "text-gray-700"
            )}>
              Authenticating with YouTube...
            </p>
            
            <div className={cn(
              "mt-4 p-3 rounded-lg text-xs text-left max-w-xs mx-auto overflow-auto",
              simpleGlassmorphic(isDark)
            )}>
              <pre className="whitespace-pre-wrap break-words">{debugInfo}</pre>
            </div>
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
              "text-sm mb-4",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              Your YouTube account is now connected. Redirecting you back...
            </p>
            
            <GlassmorphicContainer 
              className="mt-4 p-3 text-xs text-left max-w-xs mx-auto overflow-auto"
              rounded="lg"
              shadow="sm"
            >
              <pre className="whitespace-pre-wrap break-words text-xs">{debugInfo}</pre>
            </GlassmorphicContainer>
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
            
            <GlassmorphicContainer 
              className="mt-2 mb-6 p-3 text-xs text-left max-w-xs mx-auto overflow-auto"
              rounded="lg"
              shadow="sm"
            >
              <pre className="whitespace-pre-wrap break-words text-xs">{debugInfo}</pre>
            </GlassmorphicContainer>
            
            <div className="flex gap-3 w-full">
              <button
                onClick={() => navigate('/')}
                className={cn(
                  "px-4 py-3 rounded-xl flex-1 flex items-center justify-center transition-all",
                  "hover:scale-[1.02]",
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                )}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className={cn(
                  "px-4 py-3 rounded-xl flex-1 flex items-center justify-center transition-all",
                  "bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02]"
                )}
              >
                Try Again
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
              You need to sign in to your account before connecting YouTube.
            </p>
            
            <div className="flex gap-3 w-full">
              <button
                onClick={() => navigate('/')}
                className={cn(
                  "px-4 py-3 rounded-xl flex-1 flex items-center justify-center transition-all",
                  "hover:scale-[1.02]",
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                )}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Go Back
              </button>
              <button
                onClick={handleLogin}
                className={cn(
                  "px-4 py-3 rounded-xl flex-1 flex items-center justify-center transition-all",
                  "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]"
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

export default YouTubeCallback; 