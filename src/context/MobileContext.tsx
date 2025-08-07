import React, { createContext, useContext } from 'react';

// Create orientation context for mobile devices
interface MobileContextType {
  isPortrait: boolean;
  isMobile: boolean;
}

export const MobileContext = createContext<MobileContextType>({
  isPortrait: true,
  isMobile: false
});

export const useMobile = () => useContext(MobileContext); 