import React, { createContext, useContext } from 'react';

interface MobileContextType {
  isMobile: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isTablet: boolean;
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  isMobileOrTablet: boolean;
  isStandalone: boolean;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const useMobileContext = (): MobileContextType => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobileContext must be used within a MobileProvider');
  }
  return context;
};

export { MobileContext }; 