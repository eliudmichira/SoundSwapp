import { motion } from 'framer-motion';
import { Loader2, Settings, Shield, Info, Calendar, User, Mail, Power, RefreshCw, Download, Upload, Bell, Lock, Globe, Database } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useState, useEffect } from 'react';

interface EnhancedServiceConnectionCardProps {
  service: 'spotify' | 'youtube';
  isConnected: boolean;
  isConnecting: boolean;
  userProfile?: {
    displayName: string;
    imageUrl?: string;
    email?: string;
  };
  onConnect: () => void;
  onDisconnect?: () => void;
  connectionDate?: string;
}

export const EnhancedServiceConnectionCard = ({
  service,
  isConnected,
  isConnecting,
  userProfile,
  onConnect,
  onDisconnect,
  connectionDate
}: EnhancedServiceConnectionCardProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'settings'>('overview');
  const [settings, setSettings] = useState({
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
    const savedSettings = localStorage.getItem(`${service}_settings`);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
        console.log(`[DEBUG] Loaded ${service} settings:`, parsedSettings);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    } else {
      console.log(`[DEBUG] No saved settings found for ${service}, using defaults`);
    }
  }, [service]);
  
  const serviceConfig = {
    spotify: {
      name: 'Spotify',
      icon: '/images/spotify_logo.png',
      color: '#1DB954',
      hoverColor: '#1ed760',
      features: ['Stream Music', 'Create Playlists', 'Share Tracks', 'Offline Download']
    },
    youtube: {
      name: 'YouTube Music',
      icon: '/images/yt_logo_rgb_dark.png',
      color: '#FF0000',
      hoverColor: '#ff1a1a',
      features: ['Stream Music', 'Create Playlists', 'Share Tracks', 'Background Play']
    }
  }[service];

  const handleConnect = () => {
    console.log(`[DEBUG] EnhancedServiceConnectionCard.handleConnect called for ${service}`);
    
    if (!user) {
      console.warn('User not authenticated, but allowing connection attempt for development');
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: proceeding with connection attempt');
        if (isConnecting) {
          console.log('Already connecting...');
          return;
        }
        console.log(`Initiating ${service} connection in development mode...`);
        onConnect();
        return;
      }
      
      console.error('User not authenticated');
      window.location.href = '/login';
      return;
    }
    
    if (isConnecting) {
      console.log('Already connecting...');
      return;
    }
    
    console.log(`Initiating ${service} connection...`);
    onConnect();
  };

  const formatConnectionDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Recently';
    }
  };

  const handleSettingChange = (key: keyof typeof settings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    
    setSettings(newSettings);
    
    // Show feedback for setting changes
    const settingName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${settingName} ${!settings[key] ? 'enabled' : 'disabled'}`);
    
    // Save settings to localStorage
    localStorage.setItem(`${service}_settings`, JSON.stringify(newSettings));
    
    // Add visual feedback
    const toggleElement = document.querySelector(`[data-setting="${key}"]`);
    if (toggleElement) {
      toggleElement.classList.add('scale-110');
      setTimeout(() => {
        toggleElement.classList.remove('scale-110');
      }, 150);
    }
  };

  const handleRefreshConnection = () => {
    console.log(`Refreshing ${service} connection...`);
    
    // Add loading state
    const refreshButton = document.querySelector(`[data-service="${service}"] .refresh-button`);
    if (refreshButton) {
      refreshButton.classList.add('animate-spin');
      
      // Simulate refresh process
      setTimeout(() => {
        refreshButton.classList.remove('animate-spin');
        console.log(`${service} connection refreshed successfully`);
        
        // Show success feedback
        const originalText = refreshButton.textContent;
        refreshButton.textContent = 'Refreshed!';
        setTimeout(() => {
          refreshButton.innerHTML = '<RefreshCw size={14} />Refresh Connection';
        }, 1000);
      }, 2000);
    }
  };

  const handleExportSettings = () => {
    try {
      const settingsData = {
        service,
        settings,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${service}-settings.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log(`${service} settings exported successfully`);
      
      // Show success feedback
      const exportButton = document.querySelector(`[data-service="${service}"] .export-button`);
      if (exportButton) {
        const originalText = exportButton.textContent;
        exportButton.textContent = 'Exported!';
        setTimeout(() => {
          exportButton.innerHTML = '<Download size={14} />Export Settings';
        }, 1000);
      }
    } catch (error) {
      console.error('Error exporting settings:', error);
    }
  };

  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden backdrop-blur-lg border border-white/10"
      style={{
        background: 'rgba(15, 23, 42, 0.3)',
        backdropFilter: 'blur(16px)',
      }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={serviceConfig.icon} alt={serviceConfig.name} className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-semibold text-white">{serviceConfig.name} Account</h3>
              <p className="text-sm text-white/60">Manage your connection</p>
            </div>
          </div>
          {isConnected ? (
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm border border-green-500/30">
              Connected
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-sm border border-gray-500/30">
              Not Connected
            </span>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview', icon: Info },
            { key: 'permissions', label: 'Permissions', icon: Shield },
            { key: 'settings', label: 'Settings', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {isConnected && userProfile ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  {userProfile.imageUrl ? (
                    <img 
                      src={userProfile.imageUrl} 
                      alt={userProfile.displayName} 
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{userProfile.displayName}</h4>
                    <p className="text-white/60 text-sm">{userProfile.email || 'No email available'}</p>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>{serviceConfig.name} Connected</span>
                </div>

                {/* Connection Date */}
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Calendar size={16} />
                  <span>Since {formatConnectionDate(connectionDate)}</span>
                </div>

                {/* Available Features */}
                <div>
                  <h5 className="text-white font-medium mb-2">Available Features</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceConfig.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disconnect Button */}
                {onDisconnect && (
                  <button
                    onClick={onDisconnect}
                    className="w-full mt-4 py-2 px-4 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Power size={16} />
                    Disconnect {serviceConfig.name}
                  </button>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                  <img src={serviceConfig.icon} alt={serviceConfig.name} className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Connect {serviceConfig.name}</h4>
                  <p className="text-white/60 text-sm mb-4">
                    Link your {serviceConfig.name} account to start converting playlists
                  </p>
                </div>
                <button
                  onClick={handleConnect}
                  disabled={isConnecting || (!user && process.env.NODE_ENV !== 'development')}
                  className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors ${
                    !user && process.env.NODE_ENV !== 'development' ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: serviceConfig.color
                  }}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : !user && process.env.NODE_ENV !== 'development' ? (
                    'Sign in to connect'
                  ) : !user && process.env.NODE_ENV === 'development' ? (
                    `Connect ${serviceConfig.name} (Dev Mode)`
                  ) : (
                    `Connect ${serviceConfig.name}`
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="space-y-4">
            <h4 className="text-white font-medium mb-4">Account Permissions</h4>
            <div className="space-y-3">
              {[
                { name: 'Read Playlists', description: 'Access your playlists for conversion', granted: isConnected },
                { name: 'Create Playlists', description: 'Create new playlists on your account', granted: isConnected },
                { name: 'Modify Playlists', description: 'Add/remove tracks from playlists', granted: isConnected },
                { name: 'Read Profile', description: 'Access your account information', granted: isConnected }
              ].map((permission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="text-white font-medium">{permission.name}</div>
                    <div className="text-white/60 text-sm">{permission.description}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    permission.granted 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {permission.granted ? 'Granted' : 'Not Granted'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h4 className="text-white font-medium mb-4">Connection Settings</h4>
            
            {/* Account Settings */}
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                <Settings size={16} />
                Account Settings
              </h5>
              <p className="text-white/60 text-sm mb-4">
                Configure how your {serviceConfig.name} account interacts with SoundSwapp.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white text-sm">Auto-sync playlists</span>
                    <span className="text-xs text-white/40">({settings.autoSync ? 'ON' : 'OFF'})</span>
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
                    <span className="text-white text-sm">Background sync</span>
                    <span className="text-xs text-white/40">({settings.backgroundSync ? 'ON' : 'OFF'})</span>
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
                    <span className="text-white text-sm">Sync favorites</span>
                    <span className="text-xs text-white/40">({settings.syncFavorites ? 'ON' : 'OFF'})</span>
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
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                <Lock size={16} />
                Privacy Settings
              </h5>
              <p className="text-white/60 text-sm mb-4">
                Manage data sharing preferences
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-white text-sm">Share listening data</span>
                    <span className="text-xs text-white/40">({settings.shareListeningData ? 'ON' : 'OFF'})</span>
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
                    <span className="text-white text-sm">Analytics collection</span>
                    <span className="text-xs text-white/40">({settings.analyticsCollection ? 'ON' : 'OFF'})</span>
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
                    <span className="text-white text-sm">Third-party sharing</span>
                    <span className="text-xs text-white/40">({settings.thirdPartySharing ? 'ON' : 'OFF'})</span>
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
            <div className="bg-white/5 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                <Globe size={16} />
                Sync Settings
              </h5>
              <p className="text-white/60 text-sm mb-4">
                Configure automatic sync options
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span className="text-white text-sm">Real-time sync</span>
                    <span className="text-xs text-white/40">({settings.realTimeSync ? 'ON' : 'OFF'})</span>
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
                    <span className="text-white text-sm">Offline sync</span>
                    <span className="text-xs text-white/40">({settings.offlineSync ? 'ON' : 'OFF'})</span>
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
                    <span className="text-white text-sm">Cross-platform sync</span>
                    <span className="text-xs text-white/40">({settings.crossPlatformSync ? 'ON' : 'OFF'})</span>
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

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleRefreshConnection}
                data-service={service}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors refresh-button"
              >
                <RefreshCw size={14} />
                Refresh Connection
              </button>
              <button 
                onClick={handleExportSettings}
                data-service={service}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors export-button"
              >
                <Download size={14} />
                Export Settings
              </button>
            </div>
            
            {/* Debug Info */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-white/60 mb-2">Debug Info:</p>
              <p className="text-xs text-white/40">Auto-sync: {settings.autoSync ? 'ON' : 'OFF'}</p>
              <p className="text-xs text-white/40">Background sync: {settings.backgroundSync ? 'ON' : 'OFF'}</p>
              <p className="text-xs text-white/40">Sync favorites: {settings.syncFavorites ? 'ON' : 'OFF'}</p>
              <p className="text-xs text-white/40">Share listening data: {settings.shareListeningData ? 'ON' : 'OFF'}</p>
              <p className="text-xs text-white/40">Analytics collection: {settings.analyticsCollection ? 'ON' : 'OFF'}</p>
              <p className="text-xs text-white/40">Third-party sharing: {settings.thirdPartySharing ? 'ON' : 'OFF'}</p>
              <p className="text-xs text-white/40">Real-time sync: {settings.realTimeSync ? 'ON' : 'OFF'}</p>
              <p className="text-xs text-white/40">Offline sync: {settings.offlineSync ? 'ON' : 'OFF'}</p>
              <p className="text-xs text-white/40">Cross-platform sync: {settings.crossPlatformSync ? 'ON' : 'OFF'}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 