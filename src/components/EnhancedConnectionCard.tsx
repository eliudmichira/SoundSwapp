import React from 'react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGlassmorphicStyles } from '../lib/glassmorphic';
import { cn } from '../lib/utils';
import PlatformCardBack from './ui/PlatformCardBack';
import { GlowButton } from './ui/GlowButton';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext';

interface FlippedState {
  spotify: boolean;
  youtube: boolean;
}

interface EnhancedConnectionCardProps {
  platform: 'spotify' | 'youtube';
  onConnect: () => void;
  onDisconnect?: () => void;
  isConnecting?: boolean;
  connectionError?: string;
  userEmail?: string;
  userMeta?: any;
  connected?: boolean;
  userName?: string;
  userPhoto?: string;
}

const EnhancedConnectionCard: React.FC<EnhancedConnectionCardProps> = ({
  platform, 
  onConnect,
  onDisconnect, 
  isConnecting = false,
  connectionError = '',
  userEmail,
  userMeta,
  connected: externalConnected,
  userName,
  userPhoto,
}) => {
  const { isDark } = useTheme();
  const {
    hasSpotifyAuth,
    hasYouTubeAuth,
    spotifyUserProfile,
    youtubeUserProfile,
    fetchSpotifyProfile,
    fetchYouTubeProfile,
  } = useAuth();

  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const disconnectButtonRef = useRef<HTMLButtonElement>(null);

  // Determine connected status and current profile based on platform
  const connected = externalConnected !== undefined ? externalConnected : (platform === 'spotify' ? hasSpotifyAuth : hasYouTubeAuth);
  const userProfile = platform === 'spotify' ? spotifyUserProfile : youtubeUserProfile;

  // Refetch profile if connection status is true but profile is missing (e.g., after page reload)
  useEffect(() => {
    if (connected && !userProfile) {
      if (platform === 'spotify') {
        console.log('EnhancedConnectionCard: Spotify connected but profile missing, fetching...');
        fetchSpotifyProfile();
      } else if (platform === 'youtube') {
        console.log('EnhancedConnectionCard: YouTube connected but profile missing, fetching...');
        fetchYouTubeProfile();
      }
    }
  }, [connected, userProfile, platform, fetchSpotifyProfile, fetchYouTubeProfile]);

  const handleCardFlip = () => {
    if (!isConnecting) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isConnecting) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
    if (isFlipped && e.key === 'Escape') {
      e.preventDefault();
      setIsFlipped(false);
    }
  };

  // Focus management: when card flips to back, focus disconnect button.
  // When it flips to front, focus the card itself (or primary action button if appropriate).
  useEffect(() => {
    if (isFlipped) {
      disconnectButtonRef.current?.focus();
    } else {
      // Optional: focus card or main connect/details button when flipping to front
      // cardRef.current?.focus(); 
    }
  }, [isFlipped]);

  const platformConfig = useMemo(() => {
    const isSpotify = platform === 'spotify';
    const basePlatformStyle = {
      textColor: 'text-content-primary',
      userMetaDisplay: userMeta?.plan || (isSpotify ? 'Spotify Premium' : 'YouTube Premium'),
    };

    if (isSpotify) {
      return {
        ...basePlatformStyle,
        name: 'Spotify',
        icon: <FaSpotify className="w-10 h-10 text-white" />,
        iconContainerBg: 'bg-spotify',
        indicator: 'bg-spotify',
        accountTypeColor: 'text-spotify-text',
        glowHslVar: 'var(--spotify-base-color-hsl)',
        glowRgbVar: 'var(--spotify-base-color-rgb)',
        disconnectBg: 'bg-spotify/80 hover:bg-spotify',
        buttonVariant: 'soundswapp' as const,
        cardGradient: isDark ? 'from-spotify/20 to-bg-secondary/10' : 'from-spotify/10 to-bg-secondary/5',
        cssVariables: {
          '--platform-bg': 'hsl(var(--spotify-base-color-hsl))',
          '--platform-text': 'hsl(var(--text-on-primary-action-hsl))',
          '--platform-bg-hover': 'hsla(var(--spotify-base-color-hsl), 0.8)',
          '--platform-indicator': 'hsl(var(--spotify-base-color-hsl))',
          '--platform-glow-color': 'hsl(var(--spotify-base-color-hsl))',
          '--platform-glow-color-rgb': 'var(--spotify-base-color-rgb)',
        }
      };
    } else {
      return {
        ...basePlatformStyle,
        name: 'YouTube',
        icon: <FaYoutube className="w-10 h-10 text-white" />,
        iconContainerBg: 'bg-youtube',
        indicator: 'bg-youtube',
        accountTypeColor: 'text-youtube-text',
        glowHslVar: 'var(--youtube-base-color-hsl)',
        glowRgbVar: 'var(--youtube-base-color-rgb)',
        disconnectBg: 'bg-youtube/80 hover:bg-youtube',
        buttonVariant: 'soundswapp' as const,
        cardGradient: isDark ? 'from-youtube/20 to-bg-secondary/10' : 'from-youtube/10 to-bg-secondary/5',
        cssVariables: {
          '--platform-bg': 'hsl(var(--youtube-base-color-hsl))',
          '--platform-text': 'hsl(var(--text-on-primary-action-hsl))',
          '--platform-bg-hover': 'hsla(var(--youtube-base-color-hsl), 0.8)',
          '--platform-indicator': 'hsl(var(--youtube-base-color-hsl))',
          '--platform-glow-color': 'hsl(var(--youtube-base-color-hsl))',
          '--platform-glow-color-rgb': 'var(--youtube-base-color-rgb)',
        }
      };
    }
  }, [platform, userMeta, isDark]);

  const cardBaseStyles = cn(
    "rounded-xl border shadow-md transition-all duration-300",
    "backdrop-blur-md bg-opacity-90",
    "bg-surface-card border-border-default",
    "shadow-[0_0_12px_3px_rgba(var(--platform-glow-color-rgb),0.15)]",
    "hover:shadow-[0_0_20px_5px_rgba(var(--platform-glow-color-rgb),0.25)] hover:border-border-interactive hover:scale-[1.01] hover:brightness-102"
  );

  const permissions = useMemo(() => [
    "Read your playlists",
    `Access your ${platformConfig.name} profile information`,
    connected ? `Create and modify your ${platformConfig.name} playlists` : `Connect to manage ${platformConfig.name} playlists`
  ], [platformConfig.name, connected]);

  const accountDetails = useMemo(() => ({
    username: userProfile?.displayName || (platform === 'spotify' ? 'Spotify User' : 'YouTube User'),
    email: userEmail || (connected && userProfile ? 'Email associated with account' : 'Not available'),
    profilePicture: userProfile?.imageUrl,
    plan: userMeta?.plan || (connected ? `${platformConfig.name} Connected` : `Link ${platformConfig.name}`),
    since: userMeta?.lastSignInTime ? new Date(userMeta.lastSignInTime).toLocaleDateString() : (connected ? new Date().toLocaleDateString() : 'N/A')
  }), [userProfile, userEmail, platform, userMeta, platformConfig.name, connected]);

  return (
    <motion.div
      className="min-h-[320px] md:min-h-[360px] w-full max-w-[450px] relative rounded-xl overflow-hidden"
      style={{ 
        perspective: '2000px',
        ...platformConfig.cssVariables,
        backgroundImage: `linear-gradient(var(--surface-card), var(--surface-card)), 
                        linear-gradient(135deg, 
                          hsla(var(--platform-base-color-hsl), 0.7), 
                          hsla(var(--platform-base-color-hsl), 0.15), 
                          hsla(var(--platform-base-color-hsl), 0.7)
                        )`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor: 'transparent',
        animation: isHovered ? 'borderGradientFlow 2.5s ease infinite' : 'borderGradientFlow 5s ease infinite',
      } as React.CSSProperties}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Card background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl opacity-60">
        <motion.div 
          className={`absolute -bottom-8 -left-8 w-56 h-56 rounded-full filter blur-3xl bg-gradient-to-br ${platformConfig.cardGradient}`}
          animate={{
            opacity: isHovered ? [0.2, 0.35, 0.2] : [0.15, 0.25, 0.15],
            scale: isHovered ? [1, 1.15, 1] : [1, 1.05, 1],
          }}
          transition={{ 
            duration: isHovered ? 5 : 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={`absolute -top-8 -right-8 w-56 h-56 rounded-full filter blur-3xl bg-gradient-to-br ${platformConfig.cardGradient}`}
          animate={{
            opacity: isHovered ? [0.15, 0.3, 0.15] : [0.1, 0.2, 0.1],
            scale: isHovered ? [1.1, 1, 1.1] : [1.05, 1, 1.05],
          }}
          transition={{ 
            duration: isHovered ? 6 : 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>

      <div className="relative w-full h-full" style={{ perspective: '2000px' }}>
        {/* FRONT FACE */}
        <div 
          ref={cardRef}
          className={cn(
            "absolute inset-0",
            cardBaseStyles,
            isConnecting ? 'cursor-default' : 'cursor-pointer'
          )}
          onClick={handleCardFlip}
          onKeyDown={handleKeyDown}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            MozBackfaceVisibility: 'hidden',
            visibility: isFlipped ? 'hidden' : 'visible',
            padding: '0.5rem' 
          }}
          role="button"
          tabIndex={0}
          aria-label={`${platformConfig.name} connection card. ${connected ? 'Connected' : 'Not connected'}. Press Enter or Space to flip.`}
        >
          <div className="absolute inset-0 bg-surface-card z-0"></div>
          
          <motion.div
            className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full opacity-50 filter blur-3xl"
            style={{ backgroundColor: `hsl(${platformConfig.glowHslVar})` }}
            animate={{
              opacity: isHovered ? [0.3, 0.5, 0.3] : [0.2, 0.3, 0.2],
              scale: isHovered ? [1, 1.3, 1] : [1, 1.15, 1],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute inset-0 bg-white/0 backdrop-blur-0 transition-all duration-300 z-0"
            initial={false}
            animate={isHovered ? { 
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(3px)" 
            } : {
              backgroundColor: "rgba(255, 255, 255, 0)",
              backdropFilter: "blur(0px)"
            }}
            aria-hidden="true"
          />
          
          <div className="relative z-10 flex flex-col items-center justify-between h-full p-4 md:p-6 text-center">
            <div className={cn(
              "absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium shadow",
              connected ? platformConfig.indicator : (isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-700')
            )}>
              {isConnecting ? 'Connecting...' : (connected ? 'Connected' : 'Not Connected')}
            </div>
            
            <div className={`p-3 rounded-full ${platformConfig.iconContainerBg} shadow-lg mb-3 mt-6 flex items-center justify-center`}>
              {platformConfig.icon}
            </div>
            
            <h3 className={`text-2xl md:text-3xl font-bold ${platformConfig.textColor} mb-1`}>{platformConfig.name}</h3>
            
            {connected && userProfile?.displayName && (
              <p className={`text-sm ${platformConfig.textColor} opacity-80 mb-2 truncate max-w-[90%]`}>
                {userProfile.displayName}
              </p>
            )}
            {(!connected || !userProfile?.displayName) && (
                 <p className={`text-sm ${platformConfig.textColor} opacity-70 mb-2`}>
                    {connected ? 'Account linked' : `Connect your ${platformConfig.name} account`}
                 </p>
            )}

            {connected && userProfile?.imageUrl && (
              <img 
                src={userProfile.imageUrl} 
                alt={`${userProfile.displayName || platformConfig.name} profile`}
                className="w-10 h-10 rounded-full mb-3 border-2 border-[var(--platform-indicator)] shadow-md object-cover"
              />
            )}
            
            <AnimatePresence>
              {connectionError && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-red-500 dark:text-red-400 mt-1 mb-2 px-2 break-words"
                >
                  Error: {connectionError}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-auto w-full flex flex-col items-center space-y-2">
              {connected ? (
                <GlowButton 
                  variant='outline' 
                  className="w-full max-w-xs text-sm py-2.5"
                  onClick={(e) => { e.stopPropagation(); handleCardFlip(); }}
                  disabled={isConnecting}
                >
                  View Details / Disconnect
                </GlowButton>
              ) : (
                <GlowButton 
                  variant={platformConfig.buttonVariant} 
                  className="w-full max-w-xs py-2.5"
                  onClick={(e) => { e.stopPropagation(); onConnect(); }}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : `Connect ${platformConfig.name}`}
                </GlowButton>
              )}
              <p className="text-xs text-muted-foreground mt-2 px-1">
                {connected ? `Manage your ${platformConfig.name} connection.` : `Log in to link your ${platformConfig.name} account.`}
              </p>
            </div>
          </div>
        </div>
        
        {/* BACK FACE */}
        <PlatformCardBack
          platform={platform}
          accountDetails={accountDetails}
          permissions={permissions}
          onBack={handleCardFlip}
          onDisconnect={onDisconnect ? () => { onDisconnect(); setIsFlipped(false); } : undefined}
          isFlipped={isFlipped}
        />
      </div>
    </motion.div>
  );
};

export default EnhancedConnectionCard; 