import React from 'react';
import { PlatformKey } from './conversion';

export interface KeyboardFocusableCardProps {
  children: React.ReactNode;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  [key: string]: any;
}

export interface ConnectButtonProps {
  platform: PlatformKey;
  isConnected: boolean;
  onConnect: () => void;
  className?: string;
}

export interface ProfileContentProps {
  showEditProfile: boolean;
  setShowEditProfile: (show: boolean) => void;
  profileImage: string | null;
  isUploadingImage: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  user: any;
  state: any;
  showToast: (type: string, message: string) => void;
  setActiveTab: React.Dispatch<React.SetStateAction<'connections' | 'converter' | 'history' | 'profile'>>;
  setConversionStep: React.Dispatch<React.SetStateAction<'select-source' | 'select-destination' | 'select-playlist' | 'converting'>>;
  signOut: () => void;
}

export interface MobileConverterProps {
  // Props for mobile-specific behavior
}

export interface TabContentProps {
  isActive: boolean;
  children: React.ReactNode;
}

export interface ConversionWizardProps {
  currentStep: string;
  onStepChange: (step: string) => void;
  onComplete: () => void;
}

export interface PlatformSelectorProps {
  platforms: any[];
  selectedPlatform: PlatformKey | null;
  onSelect: (platform: PlatformKey | null) => void;
  title: string;
  description: string;
}

export interface PlaylistSelectorProps {
  platform: string;
  onPlaylistSelect: (playlist: any) => void;
  onBack: () => void;
}

export interface ConversionProgressProps {
  progress: number;
  currentTrack: string;
  totalTracks: number;
  onCancel: () => void;
} 