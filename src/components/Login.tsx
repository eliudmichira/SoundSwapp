import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useTheme } from '../lib/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Music, Shield, Zap } from 'lucide-react';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import FaviconLogo from '../../public/favicon.svg';
import { SoundSwappLogo } from '../assets';
import { ParticleField } from './ui/ParticleField';

// Exact gradient from Login.tsx
const logoGradient = 'linear-gradient(to right, #FF7A59, #FF007A, #00C4CC)';
const cardGradient = 'bg-gradient-to-r from-[#FF7A59] via-[#FF007A] to-[#00C4CC]';
const buttonGradient = 'bg-gradient-to-r from-[#FF7A59] via-[#FF007A] to-[#00C4CC]';
const dividerGradient = 'bg-gradient-to-r from-[#FF7A59] via-[#FF007A] to-[#00C4CC]';

const featureList = [
  {
    icon: <Music className="w-6 h-6 text-[#FF7A59]" />,
    title: 'All Your Music, One Place',
    desc: 'Sync Spotify, YouTube, and more in a single click.'
  },
  {
    icon: <Shield className="w-6 h-6 text-[#00C4CC]" />,
    title: 'Private by Design',
    desc: 'Your playlists are yours. We never share your data.'
  },
  {
    icon: <Zap className="w-6 h-6 text-[#FF007A]" />,
    title: 'Lightning Fast',
    desc: 'Convert and transfer playlists in seconds.'
  }
];

const passwordStrengthColor = (score: number) => [
  'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-cyan-500'
][score] || 'bg-gray-300';

const passwordTip = 'Use 8+ characters, a number, and a symbol for a strong password.';

const SimpleLogin: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    signInWithEmail, 
    signInWithGoogle,
    signUpWithEmail,
    loading, 
    error, 
    user
  } = useUser();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  
  // Check if we're in recovery mode
  useEffect(() => {
    const isRecovery = window.location.search.includes('recovery=true');
    setIsRecoveryMode(isRecovery);
    
    if (isRecovery) {
      console.log('[DEBUG] Login page in recovery mode');
      // Clear any stale auth data when in recovery mode
      localStorage.removeItem('auth_recovery_data');
      sessionStorage.removeItem('youtube_callback_url');
    }
  }, []);
  
  // Get the redirect path from location state
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Check if we have a preserved YouTube callback
      const youtubeCallback = localStorage.getItem('youtube_callback_url');
      if (youtubeCallback) {
        // Clear the stored URL
        localStorage.removeItem('youtube_callback_url');
        // Redirect to the full callback URL
        window.location.href = youtubeCallback;
        return;
      }
      
      // Otherwise, use the normal redirect path
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    if (isSignUp && !displayName) {
      setLocalError('Please enter your name');
      return;
    }
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      // Success - navigation will happen via useEffect
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const handleGoogleAuth = async () => {
    setLocalError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Google sign-in failed');
    }
  };

  // Password strength (simple)
  const getPasswordScore = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[!@#$%^&*]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (pw.length >= 12) score++;
    return Math.min(score, 4);
  };
  const passwordScore = isSignUp ? getPasswordScore(password) : 0;

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden flex items-center justify-center">
      {/* Particle background */}
      <ParticleField
        colorScheme="colorful"
        density="medium"
        interactive={false}
        className="fixed top-0 left-0 w-full h-full z-0 opacity-80 dark:opacity-60"
      />
      {/* Animated orb background */}
      <motion.div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FF7A59] via-[#FF007A] to-[#00C4CC] blur-3xl opacity-30"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 360, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      {/* Floating notes */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/20 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
          style={{ left: `${20 + i * 30}%`, top: `${30 + i * 15}%` }}
          animate={{ y: [0, -24, 0], rotate: [0, 360], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i }}
        >
          <Music size={28} />
        </motion.div>
      ))}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 px-4 py-12">
        {/* Left: Branding & Features */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mb-10 lg:mb-0">
          <h1
            className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
            style={{
              background: logoGradient,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              fontWeight: 800,
              textShadow: '0 0 30px rgba(255,122,89,0.3)',
              fontSize: '4.5rem',
              letterSpacing: '-0.04em',
            }}
          >
            SoundSwapp
          </h1>
          <p className="text-lg text-neutral-600 dark:text-gray-300 mb-8 max-w-md">Seamlessly sync your music across all platforms. One click, pure magic.</p>
          <div className="space-y-6 mb-8 w-full max-w-xs mx-auto lg:mx-0">
            {featureList.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-white/10 rounded-xl p-3 flex items-center justify-center">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{f.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4 text-gray-400 text-sm mt-4">
            <span>Trusted by music lovers worldwide</span>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FaSpotify className="text-white w-5 h-5" />
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <FaYoutube className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 italic">“Playlist magic, powered by you.”</div>
        </div>
        {/* Right: Login Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-6">
                  <SoundSwappLogo width={48} height={48} />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF7A59] via-[#FF007A] to-[#00C4CC] bg-clip-text text-transparent mb-2">
                  {isRecoveryMode ? 'Authentication Recovery' : (isSignUp ? 'Create your account' : 'Welcome back')}
                </h2>
                <p className="text-neutral-600 dark:text-gray-300">
                  {isRecoveryMode 
                    ? 'Please sign in again to continue with your music service connection'
                    : (isSignUp ? 'Sign up to start swapping playlists' : 'Sign in to continue')
                  }
                </p>
              </div>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm"
                >
                  <p className="text-red-300 text-sm flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    {displayError}
                  </p>
                </motion.div>
              )}
              
              {/* Recovery mode indicator */}
              {isRecoveryMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl backdrop-blur-sm"
                >
                  <p className="text-blue-300 text-sm flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Recovery Mode: Your previous session expired. Please sign in again.
                  </p>
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleAuth}
                disabled={loading}
                className={"w-full py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg text-white bg-[linear-gradient(90deg,#4285F4_0%,#34A853_33%,#FBBC05_66%,#EA4335_100%)] hover:brightness-110 active:brightness-95 focus:outline-none focus:ring-2 focus:ring-white/70 disabled:opacity-50 disabled:cursor-not-allowed mb-6"}
                aria-label="Sign in with Google"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </motion.button>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 py-1 bg-transparent text-neutral-500 dark:text-gray-400">or</span>
                </div>
              </div>
              <form onSubmit={handleEmailAuth} className="space-y-4" encType="application/x-www-form-urlencoded">
                {isSignUp && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gradient bg-gradient-to-r from-[#FF7A59] via-[#FF007A] to-[#00C4CC] bg-clip-text text-transparent" />
                    </div>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-200
                                   bg-white text-neutral-900 placeholder-neutral-500 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A59]
                                   dark:bg-white/10 dark:text-white dark:placeholder-gray-400 dark:border-white/20`}
                      placeholder="Full Name"
                      required={isSignUp}
                      aria-label="Full Name"
                      autoComplete="name"
                    />
                  </div>
                )}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gradient bg-gradient-to-r from-[#FF7A59] via-[#FF007A] to-[#00C4CC] bg-clip-text text-transparent" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-200
                               bg-white text-neutral-900 placeholder-neutral-500 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A59]
                               dark:bg-white/10 dark:text-white dark:placeholder-gray-400 dark:border-white/20`}
                    placeholder="Email Address"
                    required
                    aria-label="Email Address"
                    autoComplete="email"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gradient bg-gradient-to-r from-[#FF7A59] via-[#FF007A] to-[#00C4CC] bg-clip-text text-transparent" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 rounded-xl transition-all duration-200
                               bg-white text-neutral-900 placeholder-neutral-500 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A59]
                               dark:bg-white/10 dark:text-white dark:placeholder-gray-400 dark:border-white/20`}
                    placeholder="Password"
                    required
                    minLength={6}
                    aria-label="Password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Password strength bar for sign up */}
                {isSignUp && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`h-2 w-32 rounded-full ${passwordStrengthColor(passwordScore)}`}></div>
                    <span className="text-xs text-gray-400">{passwordTip}</span>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 ${buttonGradient} text-white font-semibold rounded-xl hover:from-[#FF7A59] hover:to-[#00C4CC] focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </motion.button>
              </form>
              <div className="text-center mt-6">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <span className="text-[#FF7A59] hover:text-[#00C4CC] font-medium">
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </span>
                </button>
                <div className="mt-6 text-xs text-gray-400">
                  By using this app, you agree to our
                  <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="underline ml-1">Terms of Use</a>
                  and
                  <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline ml-1">Privacy Policy</a>.
                </div>
              </div>
            </div>
          </div>
                </div>
      </div>
   );
};

export default SimpleLogin; 