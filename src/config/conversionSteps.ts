import { ConversionStep } from '../types/conversion';

export const CONVERSION_STEPS: ConversionStep[] = [
  'select-source',
  'select-destination', 
  'select-playlist',
  'converting'
];

export const STEP_CONFIG = {
  'select-source': {
    title: 'Select Source Platform',
    description: 'Choose where to import your playlist from',
    icon: 'Upload',
    isRequired: true
  },
  'select-destination': {
    title: 'Select Destination Platform',
    description: 'Choose where to export your playlist to',
    icon: 'Download',
    isRequired: true
  },
  'select-playlist': {
    title: 'Select Playlist',
    description: 'Choose which playlist to convert',
    icon: 'Music',
    isRequired: true
  },
  'converting': {
    title: 'Converting Playlist',
    description: 'Converting your tracks...',
    icon: 'Loader2',
    isRequired: false
  }
};

export const getStepConfig = (step: ConversionStep) => {
  return STEP_CONFIG[step];
};

export const getNextStep = (currentStep: ConversionStep): ConversionStep | null => {
  const currentIndex = CONVERSION_STEPS.indexOf(currentStep);
  if (currentIndex < CONVERSION_STEPS.length - 1) {
    return CONVERSION_STEPS[currentIndex + 1];
  }
  return null;
};

export const getPreviousStep = (currentStep: ConversionStep): ConversionStep | null => {
  const currentIndex = CONVERSION_STEPS.indexOf(currentStep);
  if (currentIndex > 0) {
    return CONVERSION_STEPS[currentIndex - 1];
  }
  return null;
}; 