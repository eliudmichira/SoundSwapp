import React from 'react';
import { motion } from 'framer-motion';
import { PlatformSelectorProps } from '../../types/ui';
import { ANIMATION_VARIANTS } from '../../config/animations';

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platforms,
  selectedPlatform,
  onSelect,
  title,
  description
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {platforms.map((platform) => (
          <motion.div
            key={platform.key}
            variants={ANIMATION_VARIANTS.scaleIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-200 ${
              selectedPlatform === platform.key
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-white/20 bg-white/10 hover:border-white/40'
            }`}
            onClick={() => onSelect(platform.key)}
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: platform.color }}
              >
                <span className="text-white font-bold text-lg">
                  {platform.label.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-semibold">{platform.label}</h4>
                <p className="text-gray-300 text-sm">
                  {platform.description || `Import from ${platform.label}`}
                </p>
              </div>

              {selectedPlatform === platform.key && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm">✓</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPlatform && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/30 rounded-lg p-4"
        >
          <p className="text-green-400 text-sm">
            ✓ {platforms.find(p => p.key === selectedPlatform)?.label} selected
          </p>
        </motion.div>
      )}
    </div>
  );
}; 