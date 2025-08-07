import React from 'react';
import { motion } from 'framer-motion';
import { useUIState } from '../../contexts/UIStateContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ANIMATION_VARIANTS } from '../../config/animations';
import { formatDate } from '../../utils/dataTransformers';

interface ConversionHistory {
  id: string;
  sourcePlatform: string;
  destinationPlatform: string;
  playlistName: string;
  totalTracks: number;
  successRate: number;
  completedAt: Date;
  status: 'completed' | 'failed' | 'in_progress';
}

export const HistoryTab: React.FC = () => {
  const { activeTab } = useUIState();
  const { showInfo } = useNotification();
  
  // Mock history data - replace with real data from context
  const mockHistory: ConversionHistory[] = [
    {
      id: '1',
      sourcePlatform: 'spotify',
      destinationPlatform: 'youtube',
      playlistName: 'My Favorite Songs',
      totalTracks: 50,
      successRate: 95,
      completedAt: new Date('2024-01-15'),
      status: 'completed'
    },
    {
      id: '2',
      sourcePlatform: 'youtube',
      destinationPlatform: 'spotify',
      playlistName: 'Chill Vibes',
      totalTracks: 30,
      successRate: 87,
      completedAt: new Date('2024-01-10'),
      status: 'completed'
    }
  ];

  if (activeTab !== 'history') {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'in_progress':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'failed':
        return '✗';
      case 'in_progress':
        return '⟳';
      default:
        return '?';
    }
  };

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full"
    >
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Conversion History
          </h2>
          <p className="text-gray-300">
            View your past playlist conversions
          </p>
        </div>
        
        {mockHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No conversion history yet</p>
            <button
              onClick={() => showInfo('Start converting playlists to see your history')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Converting
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {mockHistory.map((item) => (
              <motion.div
                key={item.id}
                variants={ANIMATION_VARIANTS.scaleIn}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.playlistName}</h3>
                    <p className="text-gray-300 text-sm">
                      {item.sourcePlatform} → {item.destinationPlatform}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {item.totalTracks} tracks • {item.successRate}% success • {formatDate(item.completedAt)}
                    </p>
                  </div>
                  <div className={`text-2xl ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}; 