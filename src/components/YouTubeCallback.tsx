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
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0);
  const MAX_AUTH_CHECK_ATTEMPTS = 5;
  
  useEffect(() => {
    // Process the OAuth callback from YouTube
    const processCallback = async () => {
      try {
        setDebugInfo('Starting callback processing...');
        
        // Check if user is already signed in
        const isUserSignedIn = !!user || !!localStorage.getItem('user');
        setDebugInfo(prev => `${prev}\nUser signed in: ${isUserSignedIn}`);
        
        // If loading auth state and haven't exceeded max attempts, wait and retry
        if (authLoading && authCheckAttempts < MAX_AUTH_CHECK_ATTEMPTS) {
          console.log(`Waiting for auth state to stabilize... Attempt ${authCheckAttempts + 1}`);
          setDebugInfo(prev => `${prev}\nWaiting for auth system to initialize...`);
          
          // Wait 1 second before next attempt
          setTimeout(() => {
            setAuthCheckAttempts(prev => prev + 1);
          }, 1000);
          return;
        }
        
        // If we've exceeded max attempts and no sign of user being signed in
        if (!isUserSignedIn && authCheckAttempts >= MAX_AUTH_CHECK_ATTEMPTS) {
          console.error("User not logged in after maximum attempts");
          setStatus('auth-required');
          setError('You need to be logged in to connect your YouTube account');
          setDebugInfo(prev => `${prev}\nError: User not logged in after ${MAX_AUTH_CHECK_ATTEMPTS} attempts`);
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
      } catch (err) {
        console.error('Error handling YouTube callback:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to authenticate with YouTube');
        setDebugInfo(prev => `${prev}\nError: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    // Only run the callback processing if not still loading auth state or if we've exceeded max attempts
    if (!authLoading || authCheckAttempts >= MAX_AUTH_CHECK_ATTEMPTS) {
      processCallback();
    }
  }, [navigate, setHasYouTubeAuth, authLoading, user, authCheckAttempts]);
  
  const handleLogin = () => {
    // Save current URL with all parameters to return after login
    const fullCallbackUrl = window.location.href;
    localStorage.setItem('youtube_callback_url', fullCallbackUrl);
    localStorage.setItem('auth_return_path', '/youtube-callback');
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
              Authentication Failed
            </p>
            <p className={cn(
              "text-sm mb-4",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              {error || 'Failed to connect your YouTube account. Please try again.'}
            </p>
            
            <button
              onClick={() => navigate('/')}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Return Home
            </button>
            
            <GlassmorphicContainer 
              className="mt-4 p-3 text-xs text-left max-w-xs mx-auto overflow-auto"
              rounded="lg"
              shadow="sm"
            >
              <pre className="whitespace-pre-wrap break-words text-xs">{debugInfo}</pre>
            </GlassmorphicContainer>
          </div>
        )}
        
        {status === 'auth-required' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faSignInAlt} className="text-3xl text-blue-500" />
            </div>
            <p className={cn(
              "text-xl font-medium mb-2",
              isDark ? "text-white" : "text-gray-800"
            )}>
              Sign In Required
            </p>
            <p className={cn(
              "text-sm mb-4",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              Please sign in to your SoundSwapp account first. We'll automatically continue connecting your YouTube account after you log in.
            </p>
            
            <button
              onClick={handleLogin}
              className={cn(
                "flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-colors",
                "bg-blue-500 hover:bg-blue-600 text-white"
              )}
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Sign In to Continue
            </button>
            
            <p className={cn(
              "text-xs mt-4",
              isDark ? "text-gray-400" : "text-gray-500"
            )}>
              This ensures your YouTube account is securely linked to your SoundSwapp profile.
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
      </GlassmorphicContainer>
    </div>
  );
};

export default YouTubeCallback; 