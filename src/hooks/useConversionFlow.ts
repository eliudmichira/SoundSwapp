import { useState, useCallback } from 'react';
import { ConversionStep, PlatformKey } from '../types/conversion';
import { validateConversionInput } from '../utils/validators';

export const useConversionFlow = () => {
  const [conversionStep, setConversionStep] = useState<ConversionStep>('select-source');
  const [sourcePlatform, setSourcePlatform] = useState<PlatformKey | null>(null);
  const [destinationPlatform, setDestinationPlatform] = useState<PlatformKey | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistData, setPlaylistData] = useState<any>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [failedTracks, setFailedTracks] = useState<any[]>([]);

  const resetConversion = useCallback(() => {
    setConversionStep('select-source');
    setSourcePlatform(null);
    setDestinationPlatform(null);
    setPlaylistUrl('');
    setPlaylistData(null);
    setIsConverting(false);
    setConversionProgress(0);
    setFailedTracks([]);
  }, []);

  const nextStep = useCallback(() => {
    const steps: ConversionStep[] = ['select-source', 'select-destination', 'select-playlist', 'converting'];
    const currentIndex = steps.indexOf(conversionStep);
    if (currentIndex < steps.length - 1) {
      setConversionStep(steps[currentIndex + 1]);
    }
  }, [conversionStep]);

  const previousStep = useCallback(() => {
    const steps: ConversionStep[] = ['select-source', 'select-destination', 'select-playlist', 'converting'];
    const currentIndex = steps.indexOf(conversionStep);
    if (currentIndex > 0) {
      setConversionStep(steps[currentIndex - 1]);
    }
  }, [conversionStep]);

  const goToStep = useCallback((step: ConversionStep) => {
    setConversionStep(step);
  }, []);

  const validateCurrentStep = useCallback(() => {
    const validation = validateConversionInput(sourcePlatform, destinationPlatform, playlistUrl);
    return validation;
  }, [sourcePlatform, destinationPlatform, playlistUrl]);

  const canProceed = useCallback(() => {
    const validation = validateCurrentStep();
    return validation.isValid;
  }, [validateCurrentStep]);

  return {
    // State
    conversionStep,
    sourcePlatform,
    destinationPlatform,
    playlistUrl,
    playlistData,
    isConverting,
    conversionProgress,
    failedTracks,
    
    // Setters
    setConversionStep,
    setSourcePlatform,
    setDestinationPlatform,
    setPlaylistUrl,
    setPlaylistData,
    setIsConverting,
    setConversionProgress,
    setFailedTracks,
    
    // Actions
    resetConversion,
    nextStep,
    previousStep,
    goToStep,
    validateCurrentStep,
    canProceed
  };
}; 