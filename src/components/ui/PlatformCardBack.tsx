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
    // Enhanced Spotify-specific fields
    country?: string;
    followers?: number;
    product?: string; // Changed from strict union type to string for flexibility
    explicitContent?: boolean;
    totalTracks?: number;
    lastActive?: string;
    // Additional Spotify account information
    subscription?: string;
    accountCountry?: string;
    explicitContentFilter?: string;
    displayName?: string;
    publicPlaylists?: number;
    privatePlaylists?: number;
    collaborativePlaylists?: number;
    followedPlaylists?: number;
    recentlyPlayed?: string;
    topGenres?: string[];
    listeningTime?: string;
    favoriteArtists?: number;
    savedAlbums?: number;
    savedTracks?: number;
    monthlyListeners?: number;
    accountType?: string;
    familyPlanMembers?: number | null;
    studentVerification?: boolean;
    deviceLimit?: number;
    offlineDownloads?: string;
    audioQuality?: string;
    crossfade?: string;
    equalizer?: string;
    socialFeatures?: string;
    dataSaver?: boolean;
    privateSession?: boolean;
    lastSync?: string;
    nextBilling?: string;
    paymentMethod?: string;
    autoRenew?: boolean;
    // Enhanced YouTube-specific fields
    channelId?: string;
    subscriberCount?: number;
    totalVideos?: number;
    totalPlaylists?: number;
    totalViews?: number;
    channelType?: string; // Changed from strict union type to string for flexibility
    monetizationStatus?: string; // Changed from strict union type to string for flexibility
    verificationStatus?: string; // Changed from strict union type to string for flexibility
    contentRating?: string; // Changed from strict union type to string for flexibility
    language?: string;
    location?: string;
    joinDate?: string;
    lastUploadDate?: string;
    averageViews?: number;
    topCategories?: string[];
    collaborationStatus?: boolean;
    liveStreamingEnabled?: boolean;
    communityTabEnabled?: boolean;
    membershipsEnabled?: boolean;
    superChatEnabled?: boolean;
    channelMembershipLevel?: string; // Changed from strict union type to string for flexibility
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

// Settings interface
interface Settings {
  autoSync: boolean;
  backgroundSync: boolean;
  syncFavorites: boolean;
  shareListeningData: boolean;
  analyticsCollection: boolean;
  thirdPartySharing: boolean;
  realTimeSync: boolean;
  offlineSync: boolean;
  crossPlatformSync: boolean;
}

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
    name: 'YouTube',
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
    features: [
      'Upload & Manage Videos',
      'Create & Edit Playlists', 
      'Live Streaming',
      'Community Features',
      'Comments & Ratings',
      'Channel Analytics',
      'Monetization Tools',
      'Collaboration Features',
      'Content Moderation',
      'Multi-Language Support',
      'Advanced Privacy Controls',
      'Cross-Platform Sync'
    ],
    permissions: {
      basic: [
        'View your YouTube account',
        'View your videos and playlists',
        'View your YouTube activity'
      ],
      advanced: [
        'Manage your YouTube account',
        'View and manage your videos and playlists',
        'View and manage your YouTube activity',
        'Post, edit or delete your comments and captions',
        'Rate videos and manage ratings',
        'See, edit and permanently delete your YouTube videos',
        'Manage your channel settings and preferences'
      ],
      personal: [
        'See your personal info',
        'See your full name and profile picture',
        'See your primary Google Account email address',
        'Associate you with your personal info on Google'
      ]
    },
    capabilities: {
      content: [
        'Upload videos up to 12 hours long',
        'Create unlimited playlists',
        'Edit video metadata and descriptions',
        'Add custom thumbnails and end screens',
        'Schedule video releases',
        'Set video privacy settings',
        'Add captions and translations'
      ],
      community: [
        'Respond to comments',
        'Moderate community posts',
        'Create community posts',
        'Host live streams',
        'Enable super chat and memberships',
        'Collaborate with other creators'
      ],
      analytics: [
        'View detailed analytics',
        'Track video performance',
        'Monitor audience engagement',
        'Analyze viewer demographics',
        'Track revenue and monetization'
      ],
      monetization: [
        'Enable channel monetization',
        'Set up ad revenue sharing',
        'Create channel memberships',
        'Enable super chat and super thanks',
        'Sell merchandise through YouTube'
      ]
    }
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

// Settings Modal Component
const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  platform: 'spotify' | 'youtube';
  settings: Settings;
  onSettingChange: (key: keyof Settings) => void;
}> = ({ isOpen, onClose, platform, settings, onSettingChange }) => {
  const { isDark } = useTheme();
  const config = platformConfigs[platform];
  
  useEffect(() => {
    if (isOpen) {
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
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className={cn(
                "rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[98vh] overflow-y-auto",
                isDark ? "bg-gray-800" : "bg-white"
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="settings-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={cn(
                "flex items-center justify-between p-6 border-b",
                isDark ? "border-gray-700" : "border-gray-200"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    config.colors.background
                  )}>
                    <svg className={cn("w-5 h-5", config.colors.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 id="settings-modal-title" className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>
                      {config.name} Settings
                    </h2>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                      Configure your connection preferences
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  )}
                  aria-label="Close settings"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Settings Summary */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-blue-900/20 border-blue-800/50" : "bg-blue-50 border-blue-100"
                )}>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className={cn("text-sm font-medium", isDark ? "text-blue-300" : "text-blue-700")}>
                      Quick Overview
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${settings.autoSync ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className={cn(isDark ? "text-blue-300" : "text-blue-600")}>
                        Auto-sync: {settings.autoSync ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${settings.realTimeSync ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className={cn(isDark ? "text-blue-300" : "text-blue-600")}>
                        Real-time: {settings.realTimeSync ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${settings.analyticsCollection ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className={cn(isDark ? "text-blue-300" : "text-blue-600")}>
                        Analytics: {settings.analyticsCollection ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${settings.crossPlatformSync ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className={cn(isDark ? "text-blue-300" : "text-blue-600")}>
                        Cross-platform: {settings.crossPlatformSync ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
                )}>
                  <h3 className={cn("font-medium mb-3 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    Account Settings
                  </h3>
                  <p className={cn("text-sm mb-4", isDark ? "text-gray-400" : "text-gray-600")}>
                    Configure how your {config.name} account interacts with SoundSwapp.
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: 'autoSync', label: 'Auto-sync playlists', color: 'bg-green-400', description: 'Automatically sync your playlists when changes are detected' },
                      { key: 'backgroundSync', label: 'Background sync', color: 'bg-blue-400', description: 'Sync data in the background without interrupting your experience' },
                      { key: 'syncFavorites', label: 'Sync favorites', color: 'bg-purple-400', description: 'Keep your favorite tracks synchronized across platforms' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <div className={`w-2 h-2 rounded-full ${setting.color}`}></div>
                            <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
                              {setting.label}
                            </span>
                            <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>
                              ({settings[setting.key as keyof Settings] ? 'ON' : 'OFF'})
                            </span>
                          </div>
                          <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
                            {setting.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings[setting.key as keyof Settings]}
                            onChange={() => onSettingChange(setting.key as keyof Settings)}
                            data-setting={setting.key}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
                )}>
                  <h3 className={cn("font-medium mb-3 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privacy Settings
                  </h3>
                  <p className={cn("text-sm mb-4", isDark ? "text-gray-400" : "text-gray-600")}>
                    Manage data sharing preferences
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: 'shareListeningData', label: 'Share listening data', color: 'bg-yellow-400', description: 'Allow sharing of your listening habits for better recommendations' },
                      { key: 'analyticsCollection', label: 'Analytics collection', color: 'bg-orange-400', description: 'Help improve SoundSwapp by sharing anonymous usage data' },
                      { key: 'thirdPartySharing', label: 'Third-party sharing', color: 'bg-red-400', description: 'Allow data sharing with trusted third-party services' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <div className={`w-2 h-2 rounded-full ${setting.color}`}></div>
                            <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
                              {setting.label}
                            </span>
                            <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>
                              ({settings[setting.key as keyof Settings] ? 'ON' : 'OFF'})
                            </span>
                          </div>
                          <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
                            {setting.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings[setting.key as keyof Settings]}
                            onChange={() => onSettingChange(setting.key as keyof Settings)}
                            data-setting={setting.key}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sync Settings */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
                )}>
                  <h3 className={cn("font-medium mb-3 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sync Settings
                  </h3>
                  <p className={cn("text-sm mb-4", isDark ? "text-gray-400" : "text-gray-600")}>
                    Configure automatic sync options
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: 'realTimeSync', label: 'Real-time sync', color: 'bg-indigo-400', description: 'Sync changes immediately as they happen' },
                      { key: 'offlineSync', label: 'Offline sync', color: 'bg-teal-400', description: 'Queue sync operations when offline' },
                      { key: 'crossPlatformSync', label: 'Cross-platform sync', color: 'bg-pink-400', description: 'Keep data synchronized across all your devices' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <div className={`w-2 h-2 rounded-full ${setting.color}`}></div>
                            <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
                              {setting.label}
                            </span>
                            <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-500")}>
                              ({settings[setting.key as keyof Settings] ? 'ON' : 'OFF'})
                            </span>
                          </div>
                          <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
                            {setting.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={settings[setting.key as keyof Settings]}
                            onChange={() => onSettingChange(setting.key as keyof Settings)}
                            data-setting={setting.key}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={cn(
                "flex gap-3 p-6 border-t",
                isDark ? "border-gray-700" : "border-gray-200"
              )}>
                <GlowButton
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Close
                </GlowButton>
                <GlowButton
                  variant="soundswapp"
                  onClick={() => {
                    // Reset to defaults
                    const defaultSettings = {
                      autoSync: true,
                      backgroundSync: false,
                      syncFavorites: true,
                      shareListeningData: false,
                      analyticsCollection: true,
                      thirdPartySharing: false,
                      realTimeSync: true,
                      offlineSync: false,
                      crossPlatformSync: true
                    };
                    Object.keys(defaultSettings).forEach(key => {
                      onSettingChange(key as keyof Settings);
                    });
                  }}
                  className="flex-1"
                >
                  Reset to Defaults
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settings, setSettings] = useState<Settings>({
      autoSync: true,
      backgroundSync: false,
      syncFavorites: true,
      shareListeningData: false,
      analyticsCollection: true,
      thirdPartySharing: false,
      realTimeSync: true,
      offlineSync: false,
      crossPlatformSync: true
    });

    // Load saved settings from localStorage
    useEffect(() => {
      const savedSettings = localStorage.getItem(`${platform}_settings`);
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsedSettings }));
          console.log(`[DEBUG] Loaded ${platform} settings:`, parsedSettings);
        } catch (error) {
          console.error('Error loading saved settings:', error);
        }
      } else {
        console.log(`[DEBUG] No saved settings found for ${platform}, using defaults`);
      }
    }, [platform]);

    const handleSettingChange = (key: keyof Settings) => {
      const newSettings = {
        ...settings,
        [key]: !settings[key]
      };
      
      setSettings(newSettings);
      
      // Show feedback for setting changes
      const settingName = String(key).replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());
      console.log(`${settingName} ${!settings[key] ? 'enabled' : 'disabled'}`);
      
      // Save settings to localStorage
      localStorage.setItem(`${platform}_settings`, JSON.stringify(newSettings));
      
      // Add visual feedback
      const toggleElement = document.querySelector(`[data-setting="${key}"]`);
      if (toggleElement) {
        toggleElement.classList.add('scale-110');
        setTimeout(() => {
          toggleElement.classList.remove('scale-110');
        }, 150);
      }
    };
    
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
                      {/* Enhanced subscription status */}
                      <span 
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded shadow-sm cursor-default",
                          "border",
                          platform === 'spotify' && accountDetails.product === 'premium' 
                            ? "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300"
                            : platform === 'spotify' && accountDetails.product === 'free'
                            ? "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-900/30 dark:border-gray-500 dark:text-gray-300"
                            : isDark ? `bg-${platform}-600/30 border-${platform}-500 text-${platform}-200` 
                                   : `bg-${platform}-100 border-${platform}-300 text-${platform}-700`,
                        )}
                      >
                        {platform === 'spotify' && accountDetails.product 
                          ? `${accountDetails.product.charAt(0).toUpperCase() + accountDetails.product.slice(1)}`
                          : accountDetails.plan || `Link ${platformName}`}
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

                {/* Enhanced Spotify Account Details */}
                {platform === 'spotify' && (
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Account Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {accountDetails.country && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-.8-.4L2.2 8.4A1 1 0 012 7.6V6z" clipRule="evenodd" />
                          </svg>
                          Country: {accountDetails.country}
                        </div>
                      )}
                      {accountDetails.followers && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          Followers: {accountDetails.followers.toLocaleString()}
                        </div>
                      )}
                      {accountDetails.totalTracks && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          Tracks: {accountDetails.totalTracks}
                        </div>
                      )}
                      {accountDetails.publicPlaylists && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          Public Playlists: {accountDetails.publicPlaylists}
                        </div>
                      )}
                      {accountDetails.privatePlaylists && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Private Playlists: {accountDetails.privatePlaylists}
                        </div>
                      )}
                      {accountDetails.collaborativePlaylists && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          Collaborative: {accountDetails.collaborativePlaylists}
                        </div>
                      )}
                      {accountDetails.followedPlaylists && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Following: {accountDetails.followedPlaylists}
                        </div>
                      )}
                      {accountDetails.savedTracks && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Saved Tracks: {accountDetails.savedTracks}
                        </div>
                      )}
                      {accountDetails.savedAlbums && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                          Saved Albums: {accountDetails.savedAlbums}
                        </div>
                      )}
                      {accountDetails.favoriteArtists && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          Favorite Artists: {accountDetails.favoriteArtists}
                        </div>
                      )}
                      {accountDetails.listeningTime && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Listening Time: {accountDetails.listeningTime}
                        </div>
                      )}
                      {accountDetails.monthlyListeners && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          Monthly Listeners: {accountDetails.monthlyListeners}
                        </div>
                      )}
                      {accountDetails.explicitContentFilter && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-.8-.4L2.2 8.4A1 1 0 012 7.6V6z" clipRule="evenodd" />
                          </svg>
                          Content Filter: {accountDetails.explicitContentFilter}
                        </div>
                      )}
                      {accountDetails.familyPlanMembers && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          Family Members: {accountDetails.familyPlanMembers}
                        </div>
                      )}
                      {accountDetails.deviceLimit && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Device Limit: {accountDetails.deviceLimit}
                        </div>
                      )}
                      {accountDetails.audioQuality && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V5l8-1.6v6.114A4.369 4.369 0 0015 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                          Audio Quality: {accountDetails.audioQuality}
                        </div>
                      )}
                      {accountDetails.lastActive && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Last Active: {accountDetails.lastActive}
                        </div>
                      )}
                      {accountDetails.nextBilling && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Next Billing: {accountDetails.nextBilling}
                        </div>
                      )}
                      {accountDetails.paymentMethod && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                          </svg>
                          Payment: {accountDetails.paymentMethod}
                        </div>
                      )}
                      {accountDetails.autoRenew !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Auto Renew: {accountDetails.autoRenew ? 'Yes' : 'No'}
                        </div>
                      )}
                      {accountDetails.studentVerification !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Student Verified: {accountDetails.studentVerification ? 'Yes' : 'No'}
                        </div>
                      )}
                      {accountDetails.dataSaver !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Data Saver: {accountDetails.dataSaver ? 'On' : 'Off'}
                        </div>
                      )}
                      {accountDetails.privateSession !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Private Session: {accountDetails.privateSession ? 'Active' : 'Inactive'}
                        </div>
                      )}
                      {accountDetails.lastSync && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          Last Sync: {accountDetails.lastSync}
                        </div>
                      )}
                      {accountDetails.offlineDownloads && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Offline Downloads: {accountDetails.offlineDownloads}
                        </div>
                      )}
                      {accountDetails.crossfade && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V5l8-1.6v6.114A4.369 4.369 0 0015 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                          </svg>
                          Crossfade: {accountDetails.crossfade}
                        </div>
                      )}
                      {accountDetails.equalizer && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          Equalizer: {accountDetails.equalizer}
                        </div>
                      )}
                      {accountDetails.socialFeatures && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          Social Features: {accountDetails.socialFeatures}
                        </div>
                      )}
                      {accountDetails.recentlyPlayed && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Recently Played: {accountDetails.recentlyPlayed}
                        </div>
                      )}
                      {accountDetails.topGenres && accountDetails.topGenres.length > 0 && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300 col-span-2">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          Top Genres: {accountDetails.topGenres.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced YouTube Account Details */}
                {platform === 'youtube' && (
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Channel Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {accountDetails.subscriberCount && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          Subscribers: {accountDetails.subscriberCount.toLocaleString()}
                        </div>
                      )}
                      {accountDetails.totalVideos && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                          Videos: {accountDetails.totalVideos.toLocaleString()}
                        </div>
                      )}
                      {accountDetails.totalViews && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          Views: {accountDetails.totalViews.toLocaleString()}
                        </div>
                      )}
                      {accountDetails.totalPlaylists && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          Playlists: {accountDetails.totalPlaylists}
                        </div>
                      )}
                      {accountDetails.averageViews && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          Avg Views: {accountDetails.averageViews.toLocaleString()}
                        </div>
                      )}
                      {accountDetails.channelType && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Type: {accountDetails.channelType.charAt(0).toUpperCase() + accountDetails.channelType.slice(1)}
                        </div>
                      )}
                      {accountDetails.verificationStatus && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Status: {accountDetails.verificationStatus.charAt(0).toUpperCase() + accountDetails.verificationStatus.slice(1)}
                        </div>
                      )}
                      {accountDetails.monetizationStatus && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          Monetization: {accountDetails.monetizationStatus.charAt(0).toUpperCase() + accountDetails.monetizationStatus.slice(1)}
                        </div>
                      )}
                      {accountDetails.contentRating && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-.8-.4L2.2 8.4A1 1 0 012 7.6V6z" clipRule="evenodd" />
                          </svg>
                          Content Rating: {accountDetails.contentRating.charAt(0).toUpperCase() + accountDetails.contentRating.slice(1)}
                        </div>
                      )}
                      {accountDetails.language && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 10-2 0v2a1 1 0 102 0v-2h4v2a1 1 0 102 0v-2h4v2a1 1 0 102 0v-2h-4v-2.07z" clipRule="evenodd" />
                          </svg>
                          Language: {accountDetails.language.toUpperCase()}
                        </div>
                      )}
                      {accountDetails.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Location: {accountDetails.location}
                        </div>
                      )}
                      {accountDetails.joinDate && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          Joined: {accountDetails.joinDate}
                        </div>
                      )}
                      {accountDetails.lastUploadDate && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Last Upload: {accountDetails.lastUploadDate}
                        </div>
                      )}
                      {accountDetails.collaborationStatus !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          Collaborations: {accountDetails.collaborationStatus ? 'Enabled' : 'Disabled'}
                        </div>
                      )}
                      {accountDetails.liveStreamingEnabled !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Live Streaming: {accountDetails.liveStreamingEnabled ? 'Enabled' : 'Disabled'}
                        </div>
                      )}
                      {accountDetails.communityTabEnabled !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          Community Tab: {accountDetails.communityTabEnabled ? 'Enabled' : 'Disabled'}
                        </div>
                      )}
                      {accountDetails.membershipsEnabled !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Memberships: {accountDetails.membershipsEnabled ? 'Enabled' : 'Disabled'}
                        </div>
                      )}
                      {accountDetails.superChatEnabled !== undefined && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          Super Chat: {accountDetails.superChatEnabled ? 'Enabled' : 'Disabled'}
                        </div>
                      )}
                      {accountDetails.channelMembershipLevel && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Membership Level: {accountDetails.channelMembershipLevel.charAt(0).toUpperCase() + accountDetails.channelMembershipLevel.slice(1)}
                        </div>
                      )}
                      {accountDetails.topCategories && accountDetails.topCategories.length > 0 && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300 col-span-2">
                          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          Top Categories: {accountDetails.topCategories.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

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

                {/* Enhanced Spotify Permissions Summary */}
                {platform === 'spotify' && (
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 shadow border border-blue-100 dark:border-blue-800/50">
                    <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Permissions & Capabilities
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center text-blue-600 dark:text-blue-400">
                        <svg className="w-3 h-3 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Read & create playlists
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400">
                        <svg className="w-3 h-3 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Access profile & preferences
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400">
                        <svg className="w-3 h-3 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Cross-platform sync enabled
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400">
                        <svg className="w-3 h-3 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Real-time playlist updates
                      </div>
                    </div>
                  </div>
                )}
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
                    Connection Settings
                  </h4>
                </div>
                
                {/* Settings Hint */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>💡 Double-click the "Settings" tab above to open detailed settings</span>
                  </div>
                </div>

                {/* Settings Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300">Settings Summary</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${settings.autoSync ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-blue-600 dark:text-blue-400">Auto-sync: {settings.autoSync ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${settings.realTimeSync ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-blue-600 dark:text-blue-400">Real-time: {settings.realTimeSync ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${settings.analyticsCollection ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-blue-600 dark:text-blue-400">Analytics: {settings.analyticsCollection ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${settings.crossPlatformSync ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-blue-600 dark:text-blue-400">Cross-platform: {settings.crossPlatformSync ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h5 className="text-gray-900 dark:text-white font-medium mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    Account Settings
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Configure how your {config.name} account interacts with SoundSwapp.
                </p>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Auto-sync playlists</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({settings.autoSync ? 'ON' : 'OFF'})</span>
                        </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.autoSync}
                          onChange={() => handleSettingChange('autoSync')}
                          data-setting="autoSync"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Background sync</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({settings.backgroundSync ? 'ON' : 'OFF'})</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.backgroundSync}
                          onChange={() => handleSettingChange('backgroundSync')}
                          data-setting="backgroundSync"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Sync favorites</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({settings.syncFavorites ? 'ON' : 'OFF'})</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.syncFavorites}
                          onChange={() => handleSettingChange('syncFavorites')}
                          data-setting="syncFavorites"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h5 className="text-gray-900 dark:text-white font-medium mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                            Privacy Settings
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Manage data sharing preferences
                          </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Share listening data</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({settings.shareListeningData ? 'ON' : 'OFF'})</span>
                        </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.shareListeningData}
                          onChange={() => handleSettingChange('shareListeningData')}
                          data-setting="shareListeningData"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                      </label>
                      </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Analytics collection</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({settings.analyticsCollection ? 'ON' : 'OFF'})</span>
                    </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.analyticsCollection}
                          onChange={() => handleSettingChange('analyticsCollection')}
                          data-setting="analyticsCollection"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Third-party sharing</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({settings.thirdPartySharing ? 'ON' : 'OFF'})</span>
                        </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.thirdPartySharing}
                          onChange={() => handleSettingChange('thirdPartySharing')}
                          data-setting="thirdPartySharing"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Sync Settings */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h5 className="text-gray-900 dark:text-white font-medium mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sync Settings
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Configure automatic sync options
                          </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Real-time sync</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({settings.realTimeSync ? 'ON' : 'OFF'})</span>
                        </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.realTimeSync}
                          onChange={() => handleSettingChange('realTimeSync')}
                          data-setting="realTimeSync"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                      </label>
                      </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Offline sync</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({settings.offlineSync ? 'ON' : 'OFF'})</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.offlineSync}
                          onChange={() => handleSettingChange('offlineSync')}
                          data-setting="offlineSync"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Cross-platform sync</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({settings.crossPlatformSync ? 'ON' : 'OFF'})</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.crossPlatformSync}
                          onChange={() => handleSettingChange('crossPlatformSync')}
                          data-setting="crossPlatformSync"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white border border-white/20"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Debug Info */}
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Debug Info:</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Auto-sync: {settings.autoSync ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Background sync: {settings.backgroundSync ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Sync favorites: {settings.syncFavorites ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Share listening data: {settings.shareListeningData ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Analytics collection: {settings.analyticsCollection ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Third-party sharing: {settings.thirdPartySharing ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Real-time sync: {settings.realTimeSync ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Offline sync: {settings.offlineSync ? 'ON' : 'OFF'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Cross-platform sync: {settings.crossPlatformSync ? 'ON' : 'OFF'}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      console.log(`Refreshing ${platform} connection...`);
                      const button = event?.target as HTMLButtonElement;
                      if (button) {
                        const originalText = button.innerHTML;
                        button.innerHTML = `
                          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refreshing...
                        `;
                        setTimeout(() => {
                          button.innerHTML = `
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Refreshed!
                          `;
                          setTimeout(() => {
                            button.innerHTML = originalText;
                          }, 1000);
                        }, 2000);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    Refresh Connection
                  </button>
                  <button 
                    onClick={() => {
                      try {
                        const settingsData = {
                          platform,
                          settings,
                          exportDate: new Date().toISOString()
                        };
                        const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${platform}-settings.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.log(`${platform} settings exported successfully`);
                        
                        // Show success feedback
                        const button = event?.target as HTMLButtonElement;
                        if (button) {
                          const originalText = button.innerHTML;
                          button.innerHTML = `
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Exported!
                          `;
                          setTimeout(() => {
                            button.innerHTML = originalText;
                          }, 1000);
                        }
                      } catch (error) {
                        console.error('Error exporting settings:', error);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Settings
                  </button>
                    </div>
                
                {/* Reset Settings Button */}
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      const defaultSettings = {
                        autoSync: true,
                        backgroundSync: false,
                        syncFavorites: true,
                        shareListeningData: false,
                        analyticsCollection: true,
                        thirdPartySharing: false,
                        realTimeSync: true,
                        offlineSync: false,
                        crossPlatformSync: true
                      };
                      setSettings(defaultSettings);
                      localStorage.setItem(`${platform}_settings`, JSON.stringify(defaultSettings));
                      console.log(`${platform} settings reset to defaults`);
                      
                      // Show feedback
                      const button = event?.target as HTMLButtonElement;
                      if (button) {
                        const originalText = button.innerHTML;
                        button.innerHTML = `
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Reset Complete!
                        `;
                        setTimeout(() => {
                          button.innerHTML = originalText;
                        }, 1000);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset to Default Settings
                  </button>
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
                  onDoubleClick={() => {
                    if (tabId === 'settings') {
                      setShowSettingsModal(true);
                    }
                  }}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150",
                    activeTab === tabId 
                      ? cn(config.colors.tabActiveBg, config.colors.tabText, 'shadow-sm') 
                      : cn("hover:bg-gray-100 dark:hover:bg-gray-700", isDark ? "text-gray-400 hover:text-gray-100" : "text-gray-500 hover:text-gray-800"),
                    tabId === 'settings' ? "cursor-pointer" : ""
                  )}
                  aria-current={activeTab === tabId ? 'page' : undefined}
                  title={tabId === 'settings' ? "Double-click to open detailed settings" : undefined}
                >
                  {tabIconElement}
                  <span>{tabId.charAt(0).toUpperCase() + tabId.slice(1)}</span>
                  {tabId === 'settings' && (
                    <svg className="w-3 h-3 ml-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
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
          
          <SettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            platform={platform}
            settings={settings}
            onSettingChange={handleSettingChange}
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