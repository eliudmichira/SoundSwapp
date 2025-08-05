import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Share2, 
  Settings, 
  Bell,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { pwaService, canInstallPWA, installPWA, isPWAInstalled, isStandalone } from '../lib/pwaService';

interface MobileAppFeaturesProps {
  className?: string;
}

export const MobileAppFeatures: React.FC<MobileAppFeaturesProps> = ({
  className = ''
}) => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [appInfo, setAppInfo] = useState(pwaService.getAppInfo());

  useEffect(() => {
    // Check if PWA can be installed
    const checkInstallability = () => {
      setShowInstallPrompt(canInstallPWA());
    };

    // Check online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Check notification permission
    const checkNotificationPermission = () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    };

    // Initial checks
    checkInstallability();
    checkNotificationPermission();

    // Event listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    window.addEventListener('beforeinstallprompt', checkInstallability);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('beforeinstallprompt', checkInstallability);
    };
  }, []);

  const handleInstallApp = async () => {
    try {
      await installPWA();
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleRequestNotifications = async () => {
    const granted = await pwaService.requestNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SoundSwapp - Playlist Converter',
          text: 'Convert playlists between Spotify and YouTube seamlessly',
          url: window.location.href
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className={`mobile-app-features ${className}`}>
      {/* PWA Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && !isPWAInstalled() && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl shadow-lg z-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Install SoundSwapp</h3>
                <p className="text-sm opacity-90">Get the full mobile app experience</p>
              </div>
              <button
                onClick={handleInstallApp}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Install
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online/Offline Status */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 right-4 bg-yellow-600 text-white p-3 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <WifiOff className="w-5 h-5" />
              <span className="text-sm">Working offline</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile App Features Panel */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="space-y-6">
          {/* App Status */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {isPWAInstalled() ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              )}
              <h2 className="text-xl font-bold text-white">
                {isPWAInstalled() ? 'App Installed' : 'Install App'}
              </h2>
            </div>
            <p className="text-white/80">
              {isPWAInstalled() 
                ? 'You have the full mobile app experience'
                : 'Install for the best mobile experience'
              }
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Install Card */}
            {!isPWAInstalled() && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 cursor-pointer"
                onClick={handleInstallApp}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Install App</h3>
                    <p className="text-sm text-white/70">Get the full mobile experience</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30 cursor-pointer"
              onClick={handleRequestNotifications}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {notificationPermission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
                  </h3>
                  <p className="text-sm text-white/70">
                    {notificationPermission === 'granted' 
                      ? 'Get notified about conversions'
                      : 'Stay updated on your conversions'
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Share Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30 cursor-pointer"
              onClick={handleShareApp}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Share App</h3>
                  <p className="text-sm text-white/70">Share with friends and family</p>
                </div>
              </div>
            </motion.div>

            {/* App Info Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-xl p-4 border border-gray-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">App Info</h3>
                  <p className="text-sm text-white/70">
                    {isStandalone() ? 'Running as app' : 'Running in browser'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile vs Desktop Indicator */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              {window.innerWidth < 768 ? (
                <>
                  <Smartphone className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">Mobile View</span>
                </>
              ) : (
                <>
                  <Monitor className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">Desktop View</span>
                </>
              )}
            </div>
          </div>

          {/* App Store Links */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-white">Get the Native App</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.a
                href="https://play.google.com/store/apps/details?id=com.soundswapp.app"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Google Play
              </motion.a>
              
              <motion.a
                href="https://apps.apple.com/app/soundswapp/id123456789"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                App Store
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 