import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { GlowButton } from './GlowButton';
import { useTheme } from '../../lib/ThemeContext';

// Icon components - Move these before platformConfigs!
function SpotifyIcon({ className }: { className?: string }) {
  return (
    <img
      src="/images/Spotify_Primary_Logo_RGB_Green.png"
      alt="Spotify"
      className={className}
      style={{ height: 24, width: 'auto', objectFit: 'contain', display: 'block' }}
    />
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

// Enhanced types with better organization
interface AccountDetails {
    username: string;
    email: string;
    profilePicture?: string;
    plan?: string;
    since?: string;
  isVerified?: boolean;
}

interface UsageStats {
    playlists?: number;
    tracks?: number;
    lastSynced?: string;
  storage?: string;
  playbackHours?: number;
}

interface PlatformCardBackProps {
  onBack: () => void;
  platform: 'spotify' | 'youtube';
  accountDetails: AccountDetails;
  permissions: string[];
  usage?: UsageStats;
  onDisconnect?: () => void;
  cardStyles?: React.CSSProperties;
  isLoading?: boolean;
  error?: string | null;
  isFlipped: boolean;
}

type TabId = 'overview' | 'permissions' | 'usage' | 'settings';

// Platform configuration with enhanced visual settings
const platformConfigs = {
    spotify: {
      name: 'Spotify',
    icon: SpotifyIcon,
    colors: {
      primary: 'var(--spotify-base-color-hsl)',
      secondary: 'var(--spotify-base-color-hsl)',
      background: 'bg-gradient-to-br from-spotify/20 to-surface-alt/10',
      text: 'text-spotify',
      border: 'border-spotify/50',
      hover: 'hover:bg-spotify/10',
      tabActiveBg: 'bg-spotify/20',
      tabText: 'text-spotify',
      buttonVariant: 'spotify' as const,
    },
    features: ['Stream Music', 'Create Playlists', 'Share Tracks', 'Offline Download']
    },
    youtube: {
    name: 'YouTube Music',
    icon: YouTubeIcon,
    colors: {
      primary: 'var(--youtube-base-color-hsl)',
      secondary: 'var(--youtube-base-color-hsl)',
      background: 'bg-gradient-to-br from-youtube/20 to-surface-alt/10',
      text: 'text-youtube',
      border: 'border-youtube/50',
      hover: 'hover:bg-youtube/10',
      tabActiveBg: 'bg-youtube/20',
      tabText: 'text-youtube',
      buttonVariant: 'youtube' as const,
    },
    features: ['Watch Videos', 'Upload Content', 'Live Streams', 'Music Library']
  }
};

// Tab icon components
const tabIcons = {
  overview: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  permissions: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  usage: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

// Enhanced confirmation dialog with better UX
const ConfirmationDialog: React.FC<{
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  platform: 'spotify' | 'youtube';
}> = ({ isOpen, onClose, onConfirm, platform }) => {
  const config = platformConfigs[platform];
  const Icon = config.icon;
  const { isDark } = useTheme();
  
  useEffect(() => {
    if (isOpen) {
      // Trap focus in dialog
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
        <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className={cn(
                "rounded-2xl shadow-2xl max-w-md w-full p-6",
                isDark ? "bg-bg-secondary" : "bg-surface-card"
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                "border-2",
                config.colors.border,
                config.colors.background
              )}>
                <Icon className={cn("w-8 h-8", config.colors.text)} />
            </div>
            
              {/* Content */}
              <h3 id="dialog-title" className={cn("text-xl font-bold text-center mb-2", isDark ? "text-content-primary" : "text-content-primary")}>
                Disconnect {config.name}?
              </h3>
              <p className={cn("text-center mb-6", isDark ? "text-content-secondary" : "text-content-secondary")}>
                This will remove access to your {config.name} account and delete all synced data. You can reconnect anytime.
              </p>
              
              {/* Actions */}
              <div className="flex gap-3">
                <GlowButton
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                  aria-label="Cancel Disconnect"
                >
                  Cancel
                </GlowButton>
                <GlowButton
                  variant="soundswapp"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1"
                  aria-label={`Confirm Disconnect from ${config.name}`}
                >
                  Disconnect
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Loading skeleton component
const LoadingSkeleton: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-4">
        <div className={cn("w-16 h-16 rounded-full", isDark ? "bg-surface-alt" : "bg-surface-alt")} />
        <div className="flex-1 space-y-2">
          <div className={cn("h-4 rounded w-3/4", isDark ? "bg-surface-alt" : "bg-surface-alt")} />
          <div className={cn("h-3 rounded w-1/2", isDark ? "bg-surface-alt" : "bg-surface-alt")} />
        </div>
      </div>
      <div className="space-y-2">
        <div className={cn("h-3 rounded", isDark ? "bg-surface-alt" : "bg-surface-alt")} />
        <div className={cn("h-3 rounded w-5/6", isDark ? "bg-surface-alt" : "bg-surface-alt")} />
      </div>
    </div>
  );
};

// Error state component
const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => {
  const { isDark } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", isDark ? "bg-state-error/20" : "bg-state-error/10")}>
        <svg className={cn("w-8 h-8", "text-state-error")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className={cn("mb-4", isDark ? "text-content-secondary" : "text-content-secondary")}>{message}</p>
      {onRetry && (
        <GlowButton
          variant="primary"
          onClick={onRetry}
          aria-label="Try Again"
        >
          Try Again
        </GlowButton>
      )}
    </div>
  );
};

// Main component
export const PlatformCardBack = React.forwardRef<HTMLDivElement, PlatformCardBackProps>(
  ({ onBack, platform, accountDetails, permissions, usage, onDisconnect, cardStyles = {}, isLoading = false, error, isFlipped }, ref) => {
    const { isDark } = useTheme();
    const config = platformConfigs[platform];
    const IconComponent = config.icon;
    
    console.log('[PlatformCardBack] Starting render', { platform, isLoading, error });
    
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    
    // Try/catch to identify potential errors with platformConfigs
    try {
      console.log('[PlatformCardBack] Config resolved:', platform, config?.name);
      
      // Keyboard navigation
      useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            // Let default tab behavior work
            return;
          }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const tabs: TabId[] = ['overview', 'permissions', 'usage', 'settings'];
            const currentIndex = tabs.indexOf(activeTab);
            let newIndex = currentIndex;
            
            if (e.key === 'ArrowLeft') {
              newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            } else {
              newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            }
            
            // Skip usage tab if no usage data
            if (tabs[newIndex] === 'usage' && !usage) {
              newIndex = e.key === 'ArrowLeft' ? newIndex - 1 : newIndex + 1;
              if (newIndex < 0) newIndex = tabs.length - 1;
              if (newIndex >= tabs.length) newIndex = 0;
            }
            
            setActiveTab(tabs[newIndex]);
            e.preventDefault();
          }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }, [activeTab, usage]);
      
      // Tab content renderer
      const renderTabContent = () => {
        console.log('[PlatformCardBack] Rendering tab content:', activeTab);
        
        if (isLoading) {
          console.log('[PlatformCardBack] Rendering loading state');
          return <LoadingSkeleton />;
        }
        
        if (error) {
          console.log('[PlatformCardBack] Rendering error state:', error);
          return <ErrorState message={error} onRetry={() => console.log("Retry logic not implemented yet")} />;
        }
        
        switch (activeTab) {
          case 'overview':
            // Get the specific platform name for button text, e.g., "Spotify" or "YouTube"
            const platformName = config.name.replace(' Music', ''); // Removes " Music" if present for YouTube Music

            return (
                <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-1 md:p-2 space-y-4" // Added space-y-4 for overall spacing
              >
                {/* Account Info Block */}
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow">
                  {accountDetails.profilePicture ? (
                    <img 
                      src={accountDetails.profilePicture} 
                      alt={`${accountDetails.username} profile`}
                      className="w-14 h-14 rounded-md object-cover border border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center border border-gray-300 dark:border-gray-500">
                      {/* Default User Icon from screenshot */}
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{accountDetails.username}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{accountDetails.email}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      {/* "Link [Platform]" styled as a button/tag */}
                      <span 
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded shadow-sm cursor-default", // cursor-default if not clickable
                          "border",
                          isDark ? `bg-${platform}-600/30 border-${platform}-500 text-${platform}-200` 
                                 : `bg-${platform}-100 border-${platform}-300 text-${platform}-700`,
                          // Example hover, if it were a button: `hover:bg-${platform}-200 dark:hover:bg-${platform}-500/50`
                        )}
                      >
                        {accountDetails.plan || `Link ${platformName}`}
                      </span>
                      {accountDetails.since && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                          {/* Calendar Icon from screenshot */}
                          <svg className="w-3.5 h-3.5 mr-1 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                          Since {accountDetails.since}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Available Features Block */}
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    {/* Sparkles Icon from screenshot */}
                    <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a.75.75 0 01.75.75V6h1.75a.75.75 0 010 1.5H10.75V9.25a.75.75 0 01-1.5 0V7.5H7.5a.75.75 0 010-1.5H9.25V4.25A.75.75 0 0110 3.5zM3.5 10a.75.75 0 01.75-.75H6V7.5a.75.75 0 011.5 0V9.25H9.25a.75.75 0 010 1.5H7.5v1.75a.75.75 0 01-1.5 0V10.75H4.25a.75.75 0 01-.75-.75zM10 16.5a.75.75 0 01-.75-.75V14H7.5a.75.75 0 010-1.5h1.75v-1.75a.75.75 0 011.5 0v1.75h1.75a.75.75 0 010 1.5H10.75v1.75a.75.75 0 01-.75.75z"></path></svg>
                    Available Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
                    {config.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                        {/* Checkmark Icon from screenshot */}
                        <svg className={cn("w-3.5 h-3.5 mr-1.5", config.colors.text)} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
            
          case 'permissions':
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Granted Permissions
                  </h4>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">
                  These permissions allow SoundSwapp to interact with your {config.name} account.
                </p>
                
                <div className="space-y-3">
              {permissions.map((permission, index) => (
                    <motion.div
                      key={permission}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      whileHover={{ 
                        x: 3, 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        borderColor: "rgba(var(--platform-base-color-rgb), 0.5)"
                      }}
                      className={cn(
                        "p-4 rounded-lg flex items-center gap-4",
                        "bg-gray-50 dark:bg-gray-800/50",
                        "border border-gray-200 dark:border-gray-700",
                        "hover:border-gray-300 dark:hover:border-gray-600",
                        "transition-all duration-200"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        "bg-gradient-to-br",
                        config.colors.background
                      )}>
                        <svg className={cn("w-5 h-5", config.colors.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                      </div>
                      <span className="text-base text-gray-700 dark:text-gray-300">
                  {permission}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
            
          case 'usage':
            if (!usage) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 mb-1">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Usage Statistics
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {usage.playlists !== undefined && (
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm"
                      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                    >
                      <p className={cn("text-3xl font-bold mb-1", config.colors.text)}>
                        {usage.playlists}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        Playlists
                      </p>
                    </motion.div>
                  )}
                  {usage.tracks !== undefined && (
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm"
                      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                    >
                      <p className={cn("text-3xl font-bold mb-1", config.colors.text)}>
                        {usage.tracks.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        Tracks
                      </p>
                    </motion.div>
                  )}
                  {usage.playbackHours !== undefined && (
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm"
                      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                    >
                      <p className={cn("text-3xl font-bold mb-1", config.colors.text)}>
                        {usage.playbackHours}h
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Playback
                      </p>
                    </motion.div>
                  )}
                  {usage.storage && (
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm"
                      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                    >
                      <p className={cn("text-3xl font-bold mb-1", config.colors.text)}>
                        {usage.storage}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        Storage
                      </p>
                    </motion.div>
                  )}
                </div>
                {usage.lastSynced && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50 flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Last synced: {usage.lastSynced}
                    </p>
                  </div>
                )}
              </motion.div>
            );
            
          case 'settings':
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Account Settings
                  </h4>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">
                  Configure how your {config.name} account interacts with SoundSwapp.
                </p>
                
                <div className="space-y-3">
                  <motion.button 
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700/70 transition-all text-left border border-gray-200 dark:border-gray-700 shadow-sm"
                    whileHover={{ 
                      x: 3, 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      borderColor: "rgba(var(--platform-base-color-rgb), 0.5)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          "bg-gradient-to-br",
                          config.colors.background
                        )}>
                          <svg className={cn("w-5 h-5", config.colors.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Privacy Settings
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Manage data sharing preferences
                          </p>
                        </div>
                      </div>
                      <motion.div 
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        className={cn("p-2 rounded-full", config.colors.hover)}
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700/70 transition-all text-left border border-gray-200 dark:border-gray-700 shadow-sm"
                    whileHover={{ 
                      x: 3, 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      borderColor: "rgba(var(--platform-base-color-rgb), 0.5)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          "bg-gradient-to-br",
                          config.colors.background
                        )}>
                          <svg className={cn("w-5 h-5", config.colors.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Sync Settings
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Configure automatic sync options
                          </p>
                        </div>
                      </div>
                      <motion.div 
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        className={cn("p-2 rounded-full", config.colors.hover)}
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            );
            
          default:
            return <div>Select a tab</div>;
        }
      };
      
      const tabs: Array<{ id: TabId; label: string; show: boolean }> = [
        { id: 'overview', label: 'Overview', show: true },
        { id: 'permissions', label: 'Permissions', show: true },
        { id: 'usage', label: 'Usage', show: !!usage },
        { id: 'settings', label: 'Settings', show: true }
      ];
      
      console.log('[PlatformCardBack] About to return JSX');
      
      const jsxToReturn = (
        <motion.div
          ref={ref}
          className={cn(
            "absolute inset-0 overflow-hidden rounded-xl shadow-xl",
            "flex flex-col",
            isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800",
            config.colors.background
          )}
          style={{
            ...cardStyles,
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
            transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            MozBackfaceVisibility: 'hidden',
            visibility: isFlipped ? 'visible' : 'hidden',
            padding: '0rem'
          }}
        >
          <div className={cn(
            "flex items-center justify-between p-4 border-b",
            isDark ? "border-gray-700" : "border-gray-200",
            `bg-${platform}-600 dark:bg-${platform}-700`
          )}>
            <div className="flex items-center space-x-3">
              <IconComponent className={cn("w-7 h-7", "text-white")} />
              <div>
                <h2 className="text-lg font-semibold text-white">{config.name} Account</h2>
                <p className="text-xs text-white opacity-80">Manage your connection</p>
              </div>
            </div>
            <button 
              onClick={onBack} 
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>

          <div className="flex justify-around border-b p-2" style={{ borderColor: isDark ? 'var(--gray-700)' : 'var(--gray-200)' }}>
            {(['overview', 'permissions', 'settings'] as TabId[]).map((tabId) => {
              if (tabId === 'usage' && !usage) return null;
              const tabIconElement = tabIcons[tabId];
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150",
                    activeTab === tabId 
                      ? cn(config.colors.tabActiveBg, config.colors.tabText, 'shadow-sm') 
                      : cn("hover:bg-gray-100 dark:hover:bg-gray-700", isDark ? "text-gray-400 hover:text-gray-100" : "text-gray-500 hover:text-gray-800")
                  )}
                  aria-current={activeTab === tabId ? 'page' : undefined}
                >
                  {tabIconElement}
                  <span>{tabId.charAt(0).toUpperCase() + tabId.slice(1)}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-grow p-3 md:p-4 overflow-y-auto">
            {renderTabContent()}
          </div>

          {onDisconnect && (
            <div className="px-4 py-3 border-t" style={{ borderColor: isDark ? 'var(--gray-700)' : 'var(--gray-200)' }}>
              <GlowButton
                variant="secondary"
                onClick={() => setShowConfirmDialog(true)}
                className="w-full !bg-red-600 hover:!bg-red-700 !text-white"
              >
                Disconnect Account
              </GlowButton>
            </div>
          )}

          <ConfirmationDialog 
            isOpen={showConfirmDialog} 
            onClose={() => setShowConfirmDialog(false)} 
            onConfirm={onDisconnect || (() => {})}
            platform={platform} 
          />
        </motion.div>
      );
      console.log('[PlatformCardBack] JSX created, returning');
      return jsxToReturn;
      
    } catch (err) {
      console.error('[PlatformCardBack] Error rendering component:', err);
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 text-red-500 p-4 text-center">
          <div>
            <h3 className="font-bold text-lg">Error rendering card</h3>
            <p>{err instanceof Error ? err.message : 'Unknown error'}</p>
          </div>
        </div>
      );
    }
  }
);

PlatformCardBack.displayName = 'PlatformCardBack';

export default PlatformCardBack; 