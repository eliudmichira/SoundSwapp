import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ActiveTab } from '../types/conversion';

interface UIStateContextType {
  activeTab: ActiveTab;
  showEditProfile: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setActiveTab: (tab: ActiveTab) => void;
  setShowEditProfile: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (context === undefined) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
};

interface UIStateProviderProps {
  children: ReactNode;
}

export const UIStateProvider: React.FC<UIStateProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('converter');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const value: UIStateContextType = {
    activeTab,
    showEditProfile,
    isLoading,
    isInitialized,
    setActiveTab,
    setShowEditProfile,
    setIsLoading,
    setIsInitialized
  };

  return (
    <UIStateContext.Provider value={value}>
      {children}
    </UIStateContext.Provider>
  );
}; 