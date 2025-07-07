import { useState, useEffect } from 'react';

interface ShareData {
  url?: string;
  title?: string;
  description?: string;
}

export const useShareModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareData>({});

  useEffect(() => {
    const handleOpenShareModal = (event: CustomEvent<ShareData>) => {
      setShareData(event.detail);
      setIsOpen(true);
    };

    // Add event listener
    window.addEventListener('openShareModal', handleOpenShareModal as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('openShareModal', handleOpenShareModal as EventListener);
    };
  }, []);

  const closeShareModal = () => {
    setIsOpen(false);
    setShareData({});
  };

  return {
    isOpen,
    shareData,
    closeShareModal
  };
}; 