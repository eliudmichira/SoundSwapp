import { PlatformInfo } from '../types/platform';
import { Music, Youtube } from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';

export const PLATFORMS: PlatformInfo[] = [
  {
    key: 'spotify',
    label: 'Spotify',
    color: '#1DB954',
    icon: FaSpotify,
    description: 'Import playlists from Spotify',
    features: ['Premium features', 'High quality audio', 'Offline listening']
  },
  {
    key: 'youtube',
    label: 'YouTube Music',
    color: '#FF0000',
    icon: Youtube,
    description: 'Import playlists from YouTube Music',
    features: ['Music videos', 'Live performances', 'User-generated content']
  },
  {
    key: 'soundcloud',
    label: 'SoundCloud',
    color: '#FF7700',
    icon: Music,
    description: 'Import playlists from SoundCloud',
    features: ['Independent artists', 'Remixes', 'Podcasts']
  }
];

export const getPlatformInfo = (key: string): PlatformInfo | undefined => {
  return PLATFORMS.find(platform => platform.key === key);
};

export const getPlatformColor = (key: string): string => {
  const platform = getPlatformInfo(key);
  return platform?.color || '#666666';
}; 