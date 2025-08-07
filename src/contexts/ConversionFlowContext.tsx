import React, { createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import { useConversionFlow } from '../hooks/useConversionFlow';
import { PlatformKey, ConversionStep } from '../types/conversion';

interface ConversionFlowContextType {
  conversionStep: ConversionStep;
  sourcePlatform: PlatformKey | null;
  destinationPlatform: PlatformKey | null;
  playlistUrl: string;
  playlistData: any;
  isConverting: boolean;
  conversionProgress: number;
  failedTracks: any[];
  setConversionStep: Dispatch<SetStateAction<ConversionStep>>;
  setSourcePlatform: (platform: PlatformKey | null) => void;
  setDestinationPlatform: (platform: PlatformKey | null) => void;
  setPlaylistUrl: (url: string) => void;
  setPlaylistData: (data: any) => void;
  setIsConverting: (converting: boolean) => void;
  setConversionProgress: (progress: number) => void;
  setFailedTracks: (tracks: any[]) => void;
  resetConversion: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: ConversionStep) => void;
  validateCurrentStep: () => { isValid: boolean; errors: string[] };
  canProceed: () => boolean;
}

const ConversionFlowContext = createContext<ConversionFlowContextType | undefined>(undefined);

export const useConversionFlowContext = () => {
  const context = useContext(ConversionFlowContext);
  if (context === undefined) {
    throw new Error('useConversionFlowContext must be used within a ConversionFlowProvider');
  }
  return context;
};

interface ConversionFlowProviderProps {
  children: ReactNode;
}

export const ConversionFlowProvider: React.FC<ConversionFlowProviderProps> = ({ children }) => {
  const conversionFlow = useConversionFlow();

  return (
    <ConversionFlowContext.Provider value={conversionFlow}>
      {children}
    </ConversionFlowContext.Provider>
  );
}; 