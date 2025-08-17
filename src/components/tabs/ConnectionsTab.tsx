import React from 'react';
import { motion } from 'framer-motion';
import { useUIState } from '../../contexts/UIStateContext';
import { usePlatformAuth } from '../../hooks/usePlatformAuth';
import { useNotification } from '../../contexts/NotificationContext';
import { PlatformConnectionCard } from '../connections/PlatformConnectionCard';
import { ANIMATION_VARIANTS } from '../../config/animations';
import { PLATFORMS } from '../../config/platforms';

export const ConnectionsTab: React.FC = () => {
  const { activeTab } = useUIState();
  const { connections, connectPlatform, disconnectPlatform, isLoading } = usePlatformAuth();
  const { showSuccess, showError } = useNotification();

  if (activeTab !== 'connections') {
    return null;
  }

  const handleConnect = async (platform: string) => {
    try {
      await connectPlatform(platform as any);
      showSuccess(`Successfully connected to ${platform}`);
    } catch (error) {
      showError(`Failed to connect to ${platform}`);
    }
  };

  const handleDisconnect = (platform: string) => {
    disconnectPlatform(platform as any);
    showSuccess(`Disconnected from ${platform}`);
  };

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full"
    >
      <div className="p-4 space-y-4 pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Platform Connections
          </h2>
          <p className="text-gray-300">
            Connect your music platforms to start converting
          </p>
        </div>
        
        <div className="space-y-4">
          {PLATFORMS.map((platform) => {
            const connection = connections.find(c => c.platform === platform.key);
            const isConnected = connection?.isConnected || false;
            
            return (
              <PlatformConnectionCard
                key={platform.key}
                platform={platform}
                isConnected={isConnected}
                isLoading={isLoading}
                onConnect={() => handleConnect(platform.key)}
                onDisconnect={() => handleDisconnect(platform.key)}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}; 