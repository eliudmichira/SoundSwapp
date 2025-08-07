import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useTheme } from '../lib/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Music, 
  Shield, 
  Zap, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import { SoundSwappLogo } from '../assets';
import { ParticleField } from './ui/ParticleField';
import { GlassmorphicCard } from './ui/GlassmorphicCard';
import { MobileButton } from './ResponsiveLayout';

// Brand gradients
const logoGradient = 'linear-gradient(to right, #FF7A59, #FF007A, #00C4CC)';
const buttonGradient = 'bg-gradient-to-r from-[#FF7A59] via-[#FF007A] to-[#00C4CC]';

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

const MobileLogin: React.FC = () => {
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
      console.log('[DEBUG] Mobile Login page in recovery mode');
      localStorage.removeItem('auth_recovery_data');
      sessionStorage.removeItem('youtube_callback_url');
    }
  }, []);
  
  // Get the redirect path from location state
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const youtubeCallback = localStorage.getItem('youtube_callback_url');
      if (youtubeCallback) {
        localStorage.removeItem('youtube_callback_url');
        window.location.href = youtubeCallback;
        return;
      }
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

  // Password strength
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Particles */}
      <ParticleField
        colorScheme="colorful"
        density="medium"
        interactive={true}
        className="fixed top-0 left-0 w-full h-full z-0"
      />
      
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="relative mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#FF7A59] via-[#FF007A] to-[#00C4CC] rounded-full flex items-center justify-center shadow-2xl">
                <SoundSwappLogo width={48} height={48} />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF7A59] via-[#FF007A] to-[#00C4CC] bg-clip-text text-transparent mb-3">
              {isRecoveryMode ? 'Authentication Recovery' : (isSignUp ? 'Create Account' : 'Welcome Back')}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {isRecoveryMode 
                ? 'Please sign in again to continue with your music service connection'
                : (isSignUp ? 'Join SoundSwapp to start converting playlists' : 'Sign in to continue your music journey')
              }
            </p>
          </motion.div>

          {/* Main Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassmorphicCard className="p-6 space-y-6">
              {/* Recovery Mode Indicator */}
              {isRecoveryMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    <p className="text-blue-300 text-sm">
                      Recovery mode: Please authenticate to continue
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Display */}
              <AnimatePresence>
                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <p className="text-red-300 text-sm">{displayError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Auth Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-[#FF7A59]" />
                      </div>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent transition-all duration-200"
                        placeholder="Full Name"
                        required={isSignUp}
                        aria-label="Full Name"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#FF7A59]" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent transition-all duration-200"
                      placeholder="Email Address"
                      required
                      aria-label="Email Address"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#FF7A59]" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent transition-all duration-200"
                      placeholder="Password"
                      required
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Password Strength Indicator */}
                {isSignUp && password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            index <= passwordScore ? passwordStrengthColor(passwordScore) : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {passwordScore < 2 ? 'Weak' : passwordScore < 4 ? 'Good' : 'Strong'} password
                    </p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/50 backdrop-blur-sm text-gray-400">or</span>
                </div>
              </div>

              {/* Google Sign In */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              {/* Toggle Sign Up/In */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-center"
              >
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <span className="text-[#FF7A59] hover:text-[#00C4CC] font-medium">
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </span>
                </button>
              </motion.div>

              {/* Terms */}
              <div className="text-center text-xs text-gray-400">
                By using this app, you agree to our
                <a href="/terms-of-service" className="underline ml-1">Terms of Use</a>
                and
                <a href="/privacy-policy" className="underline ml-1">Privacy Policy</a>.
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin; 