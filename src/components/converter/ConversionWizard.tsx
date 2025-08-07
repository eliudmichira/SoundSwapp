import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversionFlowContext } from '../../contexts/ConversionFlowContext';
import { useNotification } from '../../contexts/NotificationContext';
import { PlatformSelector } from './PlatformSelector';
import { PlaylistSelector } from './PlaylistSelector';
import { ConversionProgress } from './ConversionProgress';
import { ANIMATION_VARIANTS } from '../../config/animations';
import { getStepConfig } from '../../config/conversionSteps';

export const ConversionWizard: React.FC = () => {
  const {
    conversionStep,
    sourcePlatform,
    destinationPlatform,
    playlistUrl,
    isConverting,
    conversionProgress,
    setSourcePlatform,
    setDestinationPlatform,
    setPlaylistUrl,
    nextStep,
    previousStep,
    canProceed,
    validateCurrentStep
  } = useConversionFlowContext();

  const { showError } = useNotification();
  const stepConfig = getStepConfig(conversionStep as any);

  const handleNext = () => {
    if (canProceed()) {
      nextStep();
    } else {
      const validation = validateCurrentStep();
      showError(validation.errors[0] || 'Please complete all required fields');
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const renderStepContent = () => {
    switch (conversionStep) {
      case 'select-source':
        return (
          <PlatformSelector
            platforms={[
              { key: 'spotify', label: 'Spotify', color: '#1DB954' },
              { key: 'youtube', label: 'YouTube Music', color: '#FF0000' },
              { key: 'soundcloud', label: 'SoundCloud', color: '#FF7700' }
            ]}
            selectedPlatform={sourcePlatform}
            onSelect={setSourcePlatform}
            title="Select Source Platform"
            description="Choose where to import your playlist from"
          />
        );

      case 'select-destination':
        return (
          <PlatformSelector
            platforms={[
              { key: 'spotify', label: 'Spotify', color: '#1DB954' },
              { key: 'youtube', label: 'YouTube Music', color: '#FF0000' },
              { key: 'soundcloud', label: 'SoundCloud', color: '#FF7700' }
            ]}
            selectedPlatform={destinationPlatform}
            onSelect={setDestinationPlatform}
            title="Select Destination Platform"
            description="Choose where to export your playlist to"
          />
        );

      case 'select-playlist':
        return (
          <PlaylistSelector
            platform={sourcePlatform || ''}
            onPlaylistSelect={(playlist) => {
              setPlaylistUrl(playlist.url);
              nextStep();
            }}
            onBack={previousStep}
          />
        );

      case 'converting':
        return (
          <ConversionProgress
            progress={conversionProgress}
            currentTrack="Processing tracks..."
            totalTracks={100}
            onCancel={() => {
              // TODO: Implement cancel conversion
              console.log('Cancel conversion');
            }}
          />
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          {stepConfig?.title || 'Conversion Wizard'}
        </h3>
        <p className="text-gray-300 text-sm">
          {stepConfig?.description || 'Follow the steps to convert your playlist'}
        </p>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={conversionStep}
          variants={ANIMATION_VARIANTS.slideIn}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-[400px]"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {conversionStep !== 'converting' && (
        <div className="flex justify-between pt-4">
          <button
            onClick={handlePrevious}
            disabled={conversionStep === 'select-source'}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {conversionStep === 'select-playlist' ? 'Start Conversion' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}; 