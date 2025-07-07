import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ServiceConnectionCardProps {
  service: 'spotify' | 'youtube';
  isConnected: boolean;
  isConnecting: boolean;
  userProfile?: {
    displayName: string;
    imageUrl?: string;
  };
  onConnect: () => void;
}

export const ServiceConnectionCard = ({
  service,
  isConnected,
  isConnecting,
  userProfile,
  onConnect
}: ServiceConnectionCardProps) => {
  const serviceConfig = {
    spotify: {
      name: 'Spotify',
      icon: '/spotify-icon.svg',
      color: '#1DB954',
      hoverColor: '#1ed760'
    },
    youtube: {
      name: 'YouTube',
      icon: '/youtube-icon.svg',
      color: '#FF0000',
      hoverColor: '#ff1a1a'
    }
  }[service];

  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden backdrop-blur-lg p-6 border border-white/10"
      style={{
        background: 'rgba(15, 23, 42, 0.3)',
        backdropFilter: 'blur(16px)',
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={serviceConfig.icon} alt={serviceConfig.name} className="w-8 h-8" />
          <h3 className="text-xl font-semibold text-white">{serviceConfig.name}</h3>
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

      {isConnected && userProfile ? (
        <div className="text-white/80">
          <p>Connected as {userProfile.displayName}</p>
          {userProfile.imageUrl && (
            <img 
              src={userProfile.imageUrl} 
              alt={userProfile.displayName} 
              className="w-8 h-8 rounded-full mt-2"
            />
          )}
        </div>
      ) : (
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className={`w-full py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-90`}
          style={{
            backgroundColor: serviceConfig.color
          }}
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            `Connect ${serviceConfig.name}`
          )}
        </button>
      )}
    </motion.div>
  );
}; 