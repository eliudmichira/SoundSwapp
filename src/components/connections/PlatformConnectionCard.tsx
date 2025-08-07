import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Link, Unlink } from 'lucide-react';
import { PlatformInfo } from '../../types/platform';
import { ANIMATION_VARIANTS } from '../../config/animations';

interface PlatformConnectionCardProps {
  platform: PlatformInfo;
  isConnected: boolean;
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const PlatformConnectionCard: React.FC<PlatformConnectionCardProps> = ({
  platform,
  isConnected,
  isLoading,
  onConnect,
  onDisconnect
}) => {
  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
    }
    if (isConnected) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Connecting...';
    if (isConnected) return 'Connected';
    return 'Not Connected';
  };

  const getStatusColor = () => {
    if (isLoading) return 'text-blue-400';
    if (isConnected) return 'text-green-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.scaleIn}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-lg p-4 border-2 transition-all duration-200 ${
        isConnected
          ? 'border-green-500/50 bg-green-500/10'
          : 'border-white/20 bg-white/10 hover:border-white/40'
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Platform Icon */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: platform.color }}
        >
          <platform.icon className="w-6 h-6 text-white" />
        </div>

        {/* Platform Info */}
        <div className="flex-1">
          <h3 className="text-white font-semibold">{platform.label}</h3>
          <p className="text-gray-300 text-sm">{platform.description}</p>
          <div className="flex items-center space-x-2 mt-1">
            {getStatusIcon()}
            <span className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={isConnected ? onDisconnect : onConnect}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
            isConnected
              ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isConnected ? (
            <>
              <Unlink className="w-4 h-4" />
              <span>Disconnect</span>
            </>
          ) : (
            <>
              <Link className="w-4 h-4" />
              <span>Connect</span>
            </>
          )}
        </button>
      </div>

      {/* Features List */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <p className="text-gray-300 text-sm mb-2">Features:</p>
          <div className="flex flex-wrap gap-2">
            {platform.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
              >
                {feature}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 