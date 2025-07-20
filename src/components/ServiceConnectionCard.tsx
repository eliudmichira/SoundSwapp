import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

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
  const { user } = useAuth();
  
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

  const handleConnect = () => {
    console.log(`[DEBUG] ServiceConnectionCard.handleConnect called for ${service}`);
    console.log(`[DEBUG] User state:`, { 
      user: !!user, 
      userUid: user?.uid,
      isConnecting,
      service 
    });
    
    if (!user) {
      console.warn('User not authenticated, but allowing connection attempt for development');
      // For development, allow connection attempts even without authentication
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
      // Instead of just returning, let's try to redirect to login
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
          onClick={handleConnect}
          disabled={isConnecting || (!user && process.env.NODE_ENV !== 'development')}
          className={`w-full py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-90 ${
            !user && process.env.NODE_ENV !== 'development' ? 'opacity-50 cursor-not-allowed' : ''
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
      )}
    </motion.div>
  );
}; 