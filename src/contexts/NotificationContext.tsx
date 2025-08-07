import React, { createContext, useContext, ReactNode } from 'react';
import { useToastManager, Toast } from '../hooks/useToastManager';
import { ToastType } from '../types/conversion';

interface NotificationContextType {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const toastManager = useToastManager();

  return (
    <NotificationContext.Provider value={toastManager}>
      {children}
    </NotificationContext.Provider>
  );
}; 