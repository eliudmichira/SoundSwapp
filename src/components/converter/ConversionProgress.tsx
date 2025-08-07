import React from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { ConversionProgressProps } from '../../types/ui';
import { ANIMATION_VARIANTS } from '../../config/animations';

export const ConversionProgress: React.FC<ConversionProgressProps> = ({
  progress,
  currentTrack,
  totalTracks,
  onCancel
}) => {
  const percentage = Math.round((progress / totalTracks) * 100);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Converting Playlist
        </h3>
        <p className="text-gray-300 text-sm">
          Please wait while we convert your tracks
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4">
        <div className="relative">
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {percentage}%
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white text-sm">
            {progress} of {totalTracks} tracks processed
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Currently: {currentTrack}
          </p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
          <p className="text-white text-sm">Processing</p>
          <p className="text-gray-400 text-xs">{progress}</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-white text-sm">Completed</p>
          <p className="text-gray-400 text-xs">{Math.floor(progress * 0.8)}</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <X className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-white text-sm">Failed</p>
          <p className="text-gray-400 text-xs">{Math.floor(progress * 0.05)}</p>
        </div>
      </div>

      {/* Cancel Button */}
      <div className="text-center">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
        >
          Cancel Conversion
        </button>
      </div>

      {/* Estimated Time */}
      <div className="text-center">
        <p className="text-gray-400 text-xs">
          Estimated time remaining: {Math.max(0, Math.ceil((totalTracks - progress) / 10))} minutes
        </p>
      </div>
    </div>
  );
}; 