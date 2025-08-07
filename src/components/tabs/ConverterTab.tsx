import React from 'react';
import { motion } from 'framer-motion';
import { useConversionFlowContext } from '../../contexts/ConversionFlowContext';
import { useUIState } from '../../contexts/UIStateContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ConversionWizard } from '../converter/ConversionWizard';
import { ANIMATION_VARIANTS } from '../../config/animations';

export const ConverterTab: React.FC = () => {
  const { activeTab } = useUIState();
  const { showError } = useNotification();

  if (activeTab !== 'converter') {
    return null;
  }

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
            Convert Playlists
          </h2>
          <p className="text-gray-300">
            Transfer your music between platforms seamlessly
          </p>
        </div>
        
        <ConversionWizard />
      </div>
    </motion.div>
  );
}; 