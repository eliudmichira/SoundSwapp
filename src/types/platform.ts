import { PlatformKey } from './conversion';

export interface PlatformInfo {
  key: PlatformKey;
  label: string;
  color: string;
  icon: any;
  description: string;
  features: string[];
}

export interface PlatformConnection {
  platform: PlatformKey;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  userInfo?: any;
}

export interface PlatformAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface PlaylistImportResult {
  success: boolean;
  playlist?: any;
  error?: string;
  tracks?: any[];
}

export interface ConversionResult {
  success: boolean;
  convertedTracks: any[];
  failedTracks: any[];
  totalTracks: number;
  successRate: number;
  error?: string;
} 