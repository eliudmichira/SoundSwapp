import { useState, useRef, useEffect } from 'react';
import AnimatedGradientText from './ui/AnimatedGradientText';
import AnimatedBorderTrail from './animata/container/AnimatedBorderTrail';
import SpotlightCard from './ui/SpotlightCard';
import LightingText from './ui/LightingText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpotify, faYoutube, 
  faGithub, faTwitter, faInstagram 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faLink, faSyncAlt, faBolt, 
  faShieldAlt, faUserShield, faDesktop,
  faInfoCircle, faPaperPlane, faSpinner,
  faCheckCircle, faExternalLinkAlt, faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { useMousePosition } from '../hooks/useMousePosition';
import { Link as LucideLink, RefreshCw, Youtube as LucideYoutube, Bolt, Shield, User as UserIcon, Monitor, Github, Twitter, Instagram, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// Add custom CSS for animations and orbital flow
const styles = {
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" }
  },
  "@keyframes float-slow": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-15px)" }
  },
  "@keyframes float-slower": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-20px)" }
  },
  "@keyframes pulse-slow": {
    "0%, 100%": { opacity: 0.4 },
    "50%": { opacity: 0.8 }
  },
  // Conversion flow styles
  ".conversion-flow": {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "800px",
    margin: "0 auto"
  },
  ".step-node-container": {
    position: "relative",
    display: "flex", 
    flexDirection: "column",
    alignItems: "center",
    width: "120px"
  },
  ".step-node": {
    position: "relative",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  ".step-node.active": {
    background: "linear-gradient(135deg, #9333EA, #38BDF8)",
    boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
    transform: "scale(1.1)"
  },
  ".step-content": {
    textAlign: "center"
  },
  ".connection-line": {
    position: "absolute",
    top: "30px",
    left: "60px",
    right: "60px",
    height: "2px",
    background: "linear-gradient(90deg, rgba(147, 51, 234, 0.3), rgba(56, 189, 248, 0.3))",
    zIndex: 1
  },
  ".progress-overlay": {
    position: "absolute",
    top: "30px",
    left: "60px",
    height: "2px",
    background: "linear-gradient(90deg, #9333EA, #38BDF8)",
    zIndex: 1,
    transition: "width 0.5s ease-out"
  },
  ".particle": {
    position: "absolute",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #9333EA, #38BDF8)",
    boxShadow: "0 0 10px rgba(147, 51, 234, 0.8)",
    top: "27px",
    zIndex: 3
  },
  // Animation classes
  ".animate-float": {
    animation: "float 3s ease-in-out infinite"
  },
  ".animate-float-slow": {
    animation: "float-slow 5s ease-in-out infinite"
  },
  ".animate-float-slower": {
    animation: "float-slower 7s ease-in-out infinite"
  },
  ".animate-pulse-slow": {
    animation: "pulse-slow 3s ease-in-out infinite"
  },
  ".hero-heading": {
    fontFamily: "'Cabinet Grotesk', sans-serif",
    fontVariationSettings: "'wght' 700",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    letterSpacing: "-0.02em"
  },
  ".sound-wave-background": {
    position: "absolute",
    inset: 0,
    zIndex: -1,
    filter: "blur(6px)",
    opacity: 0.8,
    mixBlendMode: "soft-light"
  },
  ".transform-gpu": {
    transform: "translateZ(0)"
  },
  ".translate-z-10": {
    transform: "translateZ(10px)"
  },
  ".translate-z-20": {
    transform: "translateZ(20px)"
  }
};

// Add styles to document
useEffect(() => {
  const styleElement = document.createElement('style');
  let cssText = '';
  
  Object.entries(styles).forEach(([selector, rules]) => {
    if (selector.startsWith('@')) {
      // Handle keyframes
      cssText += `${selector} {\n`;
      Object.entries(rules as Record<string, string>).forEach(([key, value]) => {
        cssText += `  ${key} { ${value} }\n`;
      });
      cssText += '}\n';
    } else {
      // Handle regular CSS rules
      cssText += `${selector} {\n`;
      Object.entries(rules as Record<string, string>).forEach(([property, value]) => {
        cssText += `  ${property.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};\n`;
      });
      cssText += '}\n';
    }
  });
  
  styleElement.textContent = cssText;
  document.head.appendChild(styleElement);
  
  return () => {
    document.head.removeChild(styleElement);
  };
}, []);

// TypeScript interfaces
interface Track {
  id: number;
  name: string;
  artist: string;
}

interface Playlist {
  name: string;
  owner: string;
  image: string;
  tracks: Track[];
}

// Mock data
const mockPlaylist: Playlist = {
  name: "Chill Vibes 2025",
  owner: "MusicFan365",
  image: "https://i.scdn.co/image/ab67706c0000bebb0f4b16c1a1a9e0a1c8a0f3e2",
  tracks: [
    { id: 1, name: "Sunflower", artist: "Post Malone, Swae Lee" },
    { id: 2, name: "Blinding Lights", artist: "The Weeknd" },
    { id: 3, name: "Watermelon Sugar", artist: "Harry Styles" },
    { id: 4, name: "Don't Start Now", artist: "Dua Lipa" },
    { id: 5, name: "Circles", artist: "Post Malone" },
    { id: 6, name: "Adore You", artist: "Harry Styles" },
    { id: 7, name: "Say So", artist: "Doja Cat" },
    { id: 8, name: "Dance Monkey", artist: "Tones And I" },
    { id: 9, name: "Roxanne", artist: "Arizona Zervas" },
    { id: 10, name: "Memories", artist: "Maroon 5" },
    { id: 11, name: "Good Days", artist: "SZA" },
    { id: 12, name: "Heat Waves", artist: "Glass Animals" },
  ]
};

// Toast type
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export default function PlaylistConverter() {
  // State for form inputs
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [youtubeName, setYoutubeName] = useState('');
  const [youtubeDesc, setYoutubeDesc] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  // UI state
  const [isFetching, setIsFetching] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Refs for spotlight effects
  const heroRef = useRef<HTMLDivElement>(null);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle fetch playlist
  const handleFetchPlaylist = () => {
    if (!spotifyUrl) {
      showToast('Please enter a Spotify playlist URL', 'error');
      return;
    }
    
    // Simple validation
    if (!spotifyUrl.includes('open.spotify.com/playlist/')) {
      showToast('Please enter a valid Spotify playlist URL', 'error');
      return;
    }
    
    setIsFetching(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsFetching(false);
      setPlaylist(mockPlaylist);
      setYoutubeName(mockPlaylist.name);
      setYoutubeDesc(`Converted from Spotify playlist "${mockPlaylist.name}" by ${mockPlaylist.owner}`);
      showToast('Playlist fetched successfully!', 'success');
    }, 1500);
  };
  
  // Handle convert to YouTube
  const handleConvertToYoutube = () => {
    if (!youtubeName) {
      showToast('Please enter a name for your YouTube playlist', 'error');
      return;
    }
    
    setIsConverting(true);
    
    // Simulate conversion
    setTimeout(() => {
      setIsConverting(false);
      setConversionComplete(true);
      showToast('Playlist converted successfully!', 'success');
    }, 2000);
  };
  
  // Show toast message
  const showToast = (message: string, type: ToastType = 'info') => {
    const newToast = {
      id: Date.now(),
      message,
      type
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
    }, 3000);
  };
  
  // Handle mouse movement for hero section lighting
  useMousePosition(heroRef, ({ x, y }) => {
    setSpotlightPosition({ x, y });
    setMousePosition({ x, y });
  });

  // Soundwave animation in canvas
  useEffect(() => {
    const canvas = document.getElementById('soundwave-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    
    // Update canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    let animationFrame: number;
    let startTime = Date.now();
    
    // Animated soundwave visualization
    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      const now = Date.now();
      const elapsed = now - startTime;
      
      // Draw multiple waves with different colors and phases
      const waves = [
        { color: 'rgba(147, 51, 234, 0.2)', frequency: 0.02, amplitude: 20, phase: elapsed * 0.001 },
        { color: 'rgba(56, 189, 248, 0.15)', frequency: 0.01, amplitude: 30, phase: elapsed * 0.0015 },
        { color: 'rgba(244, 114, 182, 0.1)', frequency: 0.04, amplitude: 15, phase: elapsed * 0.002 }
      ];
      
      waves.forEach(wave => {
        const { color, frequency, amplitude, phase } = wave;
        
        ctx.beginPath();
        for (let x = 0; x < canvas.width / dpr; x += 5) {
          // Add mouse interaction - waves respond to cursor position
          const distX = Math.abs(x - mousePosition.x);
          const interactionFactor = Math.max(0, 1 - distX / (canvas.width / 4));
          
          // Calculate y position for each point on the wave
          const y = (canvas.height / dpr / 2) + 
                    Math.sin(x * frequency + phase) * amplitude + 
                    Math.sin(x * frequency * 0.5 + phase * 1.3) * amplitude * 0.5 * interactionFactor;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Complete the wave path
        ctx.lineTo(canvas.width / dpr, canvas.height / dpr);
        ctx.lineTo(0, canvas.height / dpr);
        ctx.closePath();
        
        ctx.fillStyle = color;
        ctx.fill();
      });
      
      animationFrame = requestAnimationFrame(renderFrame);
    };
    
    renderFrame();
    
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [mousePosition]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Hero Section with Dynamic 3D Background */}
      <div 
        ref={heroRef}
        className="relative overflow-hidden py-20 px-4"
        style={{
          background: `radial-gradient(800px circle at ${spotlightPosition.x}px ${spotlightPosition.y}px, rgba(124, 58, 237, 0.3), transparent 40%)`,
          backgroundColor: "#080B1A",
        }}
      >
        {/* Dynamic soundwave background */}
        <canvas 
          id="soundwave-canvas" 
          className="absolute inset-0 w-full h-full sound-wave-background"
          style={{ filter: 'blur(6px)', opacity: 0.8, mixBlendMode: 'soft-light' }}
        ></canvas>
        
        {/* Floating music notes with variable depth */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => {
            // Random positioning and animation properties
            const size = Math.random() * 30 + 10;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.5 + 0.1;
            const blur = Math.random() * 2;
            const zIndex = Math.floor(Math.random() * 3) - 1;
            
            // Select random musical symbol: ♪ ♫ ♬ ♩ ♭ ♮ ♯
            const symbols = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            
            return (
              <div 
                key={i}
                className="absolute text-white select-none"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  fontSize: `${size}px`,
                  opacity: opacity,
                  filter: `blur(${blur}px)`,
                  transform: `translateZ(${zIndex * 50}px)`,
                  animation: `float ${duration}s ${delay}s infinite ease-in-out`,
                }}
              >
                {symbol}
              </div>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="hero-heading text-5xl md:text-7xl font-bold font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-400">
              Playlist Converter
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-xl text-white/90 leading-relaxed">
              Convert your Spotify playlists to YouTube in seconds with our modern, type-safe converter
            </p>
            
            <div className="mt-8 flex gap-4 justify-center">
              <a 
                href="#converter" 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                         text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 
                         transition-all hover:scale-105 shadow-lg shadow-green-500/20"
              >
                <FontAwesomeIcon icon={faSpotify} />
                <span>Get Started</span>
              </a>
              <a 
                href="#how-it-works" 
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 
                         text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 
                         transition-all hover:scale-105 border border-white/10 shadow-lg shadow-purple-500/10"
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>How It Works</span>
              </a>
            </div>
          </div>
          
          {/* Floating Music Icons with 3D depth effect */}
          <div className="hidden lg:block absolute -bottom-8 left-16 text-white/30 text-6xl animate-float-slow transform-gpu translate-z-20">
            <FontAwesomeIcon icon={faSpotify} />
          </div>
          <div className="hidden lg:block absolute -top-4 right-20 text-white/20 text-5xl animate-float transform-gpu translate-z-10">
            <FontAwesomeIcon icon={faYoutube} />
          </div>
        </div>
      </div>

      {/* Main Converter Section */}
      <div id="converter" className="max-w-5xl mx-auto px-4 py-16 -mt-10">
        <AnimatedBorderTrail 
          className="w-full" 
          duration="8s" 
          trailColor="linear-gradient(to right, #9333EA, #38BDF8)"
          trailSize="md"
          contentClassName="p-8 sm:p-10"
        >
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Spotify Section */}
            <div className="w-full lg:w-1/2">
              <motion.div 
                className="platform-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl p-6 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/0 pointer-events-none"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-500/10 rounded-full filter blur-xl"></div>
                
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                    <FontAwesomeIcon icon={faSpotify} className="text-xl" />
                  </div>
                  <h2 className="ml-4 text-2xl font-bold font-display text-gray-800 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                    Spotify Playlist
                  </h2>
              </div>
              
                <div className="mb-6 relative group">
                <label htmlFor="spotify-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Spotify Playlist URL
                </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faSpotify} className="text-green-500" />
                    </div>
                  <input 
                    type="text" 
                    id="spotify-url" 
                      className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur border border-gray-200/50 text-gray-800 rounded-lg shadow-inner focus:ring-2 focus:ring-green-500/30 focus:border-green-500/30 transition-all duration-300"
                    placeholder="https://open.spotify.com/playlist/..."
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                  />
                    <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity opacity-0 group-hover:opacity-100 duration-300">
                      <div className="absolute inset-0 rounded-lg border border-green-500/50 scale-105 animate-pulse-slow"></div>
                </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Paste the full URL of your Spotify playlist</p>
              </div>
              
                <motion.button 
                onClick={handleFetchPlaylist}
                disabled={isFetching}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-green-500/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
              >
                <span>Fetch Playlist</span>
                {isFetching && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                </motion.button>

              {/* Spotify Playlist Info */}
              {playlist && (
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                  <div className="flex items-center mb-5">
                      <div className="relative">
                    <img 
                      src={playlist.image} 
                      alt={`${playlist.name} cover`} 
                          className="w-20 h-20 rounded-lg object-cover shadow-lg"
                        />
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent rounded-lg"
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-xl text-gray-800 font-display">{playlist.name}</h3>
                      <p className="text-sm text-gray-600">Created by {playlist.owner}</p>
                      <div className="flex items-center mt-1">
                          <span className="text-sm bg-green-100 text-green-800 rounded-full px-3 py-0.5">
                          {playlist.tracks.length} tracks
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <SpotlightCard 
                      className="max-h-96 overflow-y-auto border rounded-lg border-white/10 bg-white/30 backdrop-blur-sm shadow-xl"
                    glowColor="rgba(29, 185, 84, 0.2)"
                    size={250}
                  >
                      <table className="min-w-full divide-y divide-gray-200/50">
                        <thead className="bg-white/20 backdrop-blur-sm sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                        </tr>
                      </thead>
                        <tbody className="bg-transparent divide-y divide-gray-200/30">
                        {playlist.tracks.map((track) => (
                            <motion.tr 
                              key={track.id} 
                              className="hover:bg-white/30 transition-colors duration-200"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: track.id * 0.05 }}
                              whileHover={{ 
                                backgroundColor: "rgba(255,255,255,0.4)",
                                scale: 1.01,
                              }}
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-xs font-medium">
                                  {track.id}
                                </div>
                              </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{track.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{track.artist}</td>
                            </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </SpotlightCard>
                  </motion.div>
              )}
              </motion.div>
            </div>

            {/* YouTube Section */}
            <div className="w-full lg:w-1/2">
              <motion.div 
                className="platform-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl p-6 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-500/0 pointer-events-none"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-500/10 rounded-full filter blur-xl"></div>
                
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                    <FontAwesomeIcon icon={faYoutube} className="text-xl" />
                  </div>
                  <h2 className="ml-4 text-2xl font-bold font-display text-gray-800 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    YouTube Playlist
                  </h2>
              </div>
              
                <div className="mb-5 relative group">
                <label htmlFor="youtube-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Playlist Name
                </label>
                <input 
                  type="text" 
                  id="youtube-name" 
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-gray-200/50 text-gray-800 rounded-lg shadow-inner focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all duration-300"
                  placeholder="My YouTube Playlist"
                  value={youtubeName}
                  onChange={(e) => setYoutubeName(e.target.value)}
                />
                  <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity opacity-0 group-hover:opacity-100 duration-300">
                    <div className="absolute inset-0 rounded-lg border border-red-500/50 scale-105 animate-pulse-slow"></div>
                  </div>
              </div>
              
                <div className="mb-5 relative group">
                <label htmlFor="youtube-desc" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  id="youtube-desc" 
                  rows={3} 
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-gray-200/50 text-gray-800 rounded-lg shadow-inner focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all duration-300 resize-none"
                  placeholder="Playlist description..."
                  value={youtubeDesc}
                  onChange={(e) => setYoutubeDesc(e.target.value)}
                  ></textarea>
                  <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity opacity-0 group-hover:opacity-100 duration-300">
                    <div className="absolute inset-0 rounded-lg border border-red-500/50 scale-105 animate-pulse-slow"></div>
                  </div>
              </div>
              
              <div className="flex items-center mb-5">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                  />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer 
                                    peer-checked:bg-gradient-to-r peer-checked:from-red-500 peer-checked:to-red-600 
                                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                                    after:bg-white after:border-gray-300 after:border after:rounded-full 
                                    after:h-5 after:w-5 after:transition-all relative"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">Make playlist public</span>
                </label>
              </div>
              
                <motion.button 
                onClick={handleConvertToYoutube}
                disabled={isConverting || !playlist}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-red-500/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
              >
                <span>Convert to YouTube</span>
                {isConverting && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                </motion.button>

              {/* YouTube Result */}
              {conversionComplete && (
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100/80 backdrop-blur-sm p-5 border border-green-100 shadow-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 20,
                              delay: 0.2
                            }}
                          >
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl" />
                          </motion.div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-green-800">Conversion successful!</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Your YouTube playlist has been created successfully.</p>
                            <motion.a 
                            href="https://www.youtube.com/playlist?list=mockplaylistid123" 
                            target="_blank" 
                            rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                          >
                            View on YouTube <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
                            </motion.a>
                            <motion.div 
                              className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              <motion.div 
                                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                              />
                            </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </motion.div>
              )}
              </motion.div>
            </div>
          </div>
        </AnimatedBorderTrail>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <AnimatedGradientText className="text-4xl font-bold font-display inline-block">
            How It Works
          </AnimatedGradientText>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Converting your playlists is simple with our streamlined process
          </p>
        </div>
        
        <div className="conversion-flow relative my-24">
          {/* Connection line background */}
          <div className="connection-line"></div>
          
          {/* Progress overlay - animated during conversion */}
          <motion.div 
            className="progress-overlay"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
          ></motion.div>
          
          <div className="flex justify-between relative z-10">
            {/* Step 1 */}
            <motion.div 
              className="step-node-container"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="step-node active">
                <LucideLink className="h-6 w-6 text-white" />
            </div>
              <div className="step-content mt-6">
                <h3 className="text-xl font-bold font-display text-gray-800 mb-2">Connect</h3>
                <p className="text-gray-600 max-w-[200px]">Link your Spotify account and select playlists</p>
              </div>
              
              {/* Floating particles */}
              <div className="absolute -top-4 -left-4 w-3 h-3 rounded-full bg-purple-400/50 animate-float-slow"></div>
              <div className="absolute top-12 -right-2 w-2 h-2 rounded-full bg-blue-400/40 animate-float-slower"></div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div
              className="step-node-container"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="step-node">
                <RefreshCw className="h-6 w-6 text-purple-500" />
              </div>
              <div className="step-content mt-6">
                <h3 className="text-xl font-bold font-display text-gray-800 mb-2">Transform</h3>
                <p className="text-gray-600 max-w-[200px]">Our algorithm matches songs across platforms</p>
              </div>
              
              <div className="absolute -bottom-2 -left-3 w-2 h-2 rounded-full bg-green-400/40 animate-float"></div>
              <div className="absolute -top-5 right-2 w-4 h-4 rounded-full bg-red-400/30 animate-float-slow"></div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div
              className="step-node-container"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="step-node">
                <LucideYoutube className="h-6 w-6 text-purple-500" />
              </div>
              <div className="step-content mt-6">
                <h3 className="text-xl font-bold font-display text-gray-800 mb-2">Create</h3>
                <p className="text-gray-600 max-w-[200px]">Generate your new YouTube playlist instantly</p>
              </div>
              
              <div className="absolute -top-3 -left-4 w-3 h-3 rounded-full bg-yellow-400/50 animate-float-slower"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-purple-400/40 animate-float"></div>
            </motion.div>
            
            {/* Animated particles along the path */}
            <motion.div 
              className="particle"
              animate={{
                left: ["0%", "100%"],
                y: [0, -20, 0, 20, 0],
              }}
              transition={{
                left: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
                y: { duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
              }}
            />
            
            <motion.div 
              className="particle"
              initial={{ left: "20%" }}
              animate={{
                left: ["20%", "100%", "20%"],
                y: [0, 15, 0, -15, 0],
              }}
              transition={{
                left: { duration: 5, ease: "easeInOut", repeat: Infinity },
                y: { duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
              }}
            />
            
            <motion.div 
              className="particle"
              initial={{ left: "50%" }}
              animate={{
                left: ["50%", "0%", "50%"],
                y: [0, -10, 0, 10, 0],
              }}
              transition={{
                left: { duration: 4, ease: "easeInOut", repeat: Infinity },
                y: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
              }}
            />
          </div>
        </div>
        
        <div className="parallax-container relative py-12">
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <SpotlightCard className="h-full p-8 text-center transform hover:-translate-y-1 transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-green-600/20 text-green-500 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto">
                  <LucideLink className="h-6 w-6 text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-display">1. Paste Spotify URL</h3>
            <p className="text-gray-600">Copy the link to your Spotify playlist and paste it into our converter</p>
          </SpotlightCard>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <SpotlightCard className="h-full p-8 text-center transform hover:-translate-y-1 transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-600/20 text-blue-500 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto">
                  <RefreshCw className="h-6 w-6 text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text animate-pulse" />
            </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-display">2. Fetch & Verify</h3>
            <p className="text-gray-600">We'll retrieve all songs from your playlist and display them for verification</p>
          </SpotlightCard>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <SpotlightCard className="h-full p-8 text-center transform hover:-translate-y-1 transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400/20 to-red-600/20 text-red-500 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto">
                  <LucideYoutube className="h-6 w-6 text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text" />
            </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-display">3. Convert to YouTube</h3>
            <p className="text-gray-600">Create a new YouTube playlist with matching songs with just one click</p>
          </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white via-gray-100/50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedGradientText className="text-4xl font-bold font-display inline-block">
              Features
            </AnimatedGradientText>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our TypeScript-powered converter offers top-notch performance and reliability
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SpotlightCard className="h-full p-6 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Bolt className="h-5 w-5 text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text" />
              </div>
                <h3 className="font-bold text-lg mb-2 text-transparent bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text">Fast Conversion</h3>
              <p className="text-gray-600 text-sm">Convert your playlists in seconds with our optimized algorithms</p>
            </SpotlightCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <SpotlightCard className="h-full p-6 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5 text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text" />
              </div>
                <h3 className="font-bold text-lg mb-2 text-transparent bg-gradient-to-r from-green-500 to-green-600 bg-clip-text">Type-Safe</h3>
              <p className="text-gray-600 text-sm">Built with TypeScript and React for maximum reliability</p>
            </SpotlightCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SpotlightCard className="h-full p-6 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <UserIcon className="h-5 w-5 text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text" />
              </div>
                <h3 className="font-bold text-lg mb-2 text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text">Privacy First</h3>
              <p className="text-gray-600 text-sm">We don't store your playlists or personal data</p>
            </SpotlightCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <SpotlightCard className="h-full p-6 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="h-5 w-5 text-transparent bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text" />
              </div>
                <h3 className="font-bold text-lg mb-2 text-transparent bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text">Modern UI</h3>
              <p className="text-gray-600 text-sm">Sleek, responsive design that works on all devices</p>
            </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4 inline-block">
                Playlist Converter
                </h2>
                <p className="text-gray-400 mb-6">Convert between music platforms effortlessly with our modern, type-safe solution.</p>
                <div className="flex space-x-5">
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    whileHover={{ y: -3, color: "#9333EA" }}
                  >
                    <Github className="h-6 w-6" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    whileHover={{ y: -3, color: "#38BDF8" }}
                  >
                    <Twitter className="h-6 w-6" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    whileHover={{ y: -3, color: "#F472B6" }}
                  >
                    <Instagram className="h-6 w-6" />
                  </motion.a>
              </div>
              </motion.div>
            </div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4 className="font-bold text-lg mb-4 text-white">Quick Links</h4>
                <ul className="space-y-3">
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <span className="h-px w-4 bg-purple-500"></span>
                      Home
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#how-it-works" 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <span className="h-px w-4 bg-blue-500"></span>
                      How It Works
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <span className="h-px w-4 bg-pink-500"></span>
                      About Us
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <span className="h-px w-4 bg-green-500"></span>
                      Contact
                    </motion.a>
                  </li>
              </ul>
              </motion.div>
            </div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="font-bold text-lg mb-4 text-white">Platform Support</h4>
                <ul className="space-y-3">
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <FontAwesomeIcon icon={faSpotify} className="text-green-500" />
                      Spotify
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <FontAwesomeIcon icon={faYoutube} className="text-red-500" />
                      YouTube
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <span className="inline-block w-4 h-4 rounded-full bg-gray-400"></span>
                      Apple Music
                    </motion.a>
                  </li>
                  <li>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <span className="inline-block w-4 h-4 rounded-full bg-gray-400"></span>
                      Deezer
                    </motion.a>
                  </li>
              </ul>
              </motion.div>
            </div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="font-bold text-lg mb-4 text-white">Stay Updated</h4>
                <p className="text-gray-400 mb-4">Subscribe to receive news and updates</p>
                <div className="relative">
                <input 
                  type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <button className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-blue-500 p-1.5 rounded-lg text-white">
                    <Send className="h-5 w-5" />
                </button>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="pt-10 mt-10 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Playlist Converter. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id} 
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className={cn(
                "p-4 rounded-lg shadow-lg backdrop-blur-md border flex items-start gap-3",
                toast.type === 'success' ? "bg-green-500/20 border-green-500/30 text-green-600" :
                toast.type === 'error' ? "bg-red-500/20 border-red-500/30 text-red-600" :
                toast.type === 'warning' ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-600" :
                "bg-blue-500/20 border-blue-500/30 text-blue-600"
              )}
            >
              <div className="p-1 rounded-full bg-white/20">
                {toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> :
                 toast.type === 'error' ? <FontAwesomeIcon icon={faCircleExclamation} className="h-5 w-5" /> :
                 toast.type === 'warning' ? <FontAwesomeIcon icon={faCircleExclamation} className="h-5 w-5" /> :
                 <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-current opacity-70 hover:opacity-100"
              >
                &times;
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 