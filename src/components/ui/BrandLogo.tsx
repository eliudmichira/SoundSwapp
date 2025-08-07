import React from 'react';
import { cn } from '../../lib/utils';

interface BrandLogoProps {
  platform: 'youtube' | 'spotify';
  variant?: 'primary' | 'full' | 'white' | 'black' | 'green';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  platform, 
  variant = 'primary', 
  size = 'md', 
  className,
  style 
}) => {
  const sizeMap = {
    sm: { height: 16, minWidth: 16 },
    md: { height: 24, minWidth: 24 },
    lg: { height: 32, minWidth: 32 },
    xl: { height: 48, minWidth: 48 }
  };

  const getLogoPath = () => {
    if (platform === 'youtube') {
      switch (variant) {
        case 'primary':
        case 'black':
          return '/images/yt_logo_rgb_light.png';
        case 'white':
          return '/images/yt_logo_rgb_light.png';
        case 'full':
          return '/images/yt_logo_rgb_light.png';
        default:
          return '/images/yt_logo_rgb_light.png';
      }
    } else if (platform === 'spotify') {
      switch (variant) {
        case 'primary':
        case 'green':
          return '/images/Spotify_Primary_Logo_RGB_Green.png';
        case 'white':
          return '/images/Spotify_Primary_Logo_RGB_White.png';
        case 'black':
          return '/images/Spotify_Primary_Logo_RGB_Black.png';
        case 'full':
          return '/images/Spotify_Full_Logo_RGB_Green.png';
        default:
          return '/images/Spotify_Primary_Logo_RGB_Green.png';
      }
    }
    return '';
  };

  const sizeConfig = sizeMap[size];

  return (
    <img
      src={getLogoPath()}
      alt={platform === 'youtube' ? 'YouTube' : 'Spotify'}
      style={{
        height: sizeConfig.height,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        minWidth: sizeConfig.minWidth,
        ...style
      }}
      className={cn('w-auto', className)}
    />
  );
};

// Convenience components for specific use cases
export const YouTubeLogo: React.FC<Omit<BrandLogoProps, 'platform'>> = (props) => (
  <BrandLogo platform="youtube" {...props} />
);

export const SpotifyLogo: React.FC<Omit<BrandLogoProps, 'platform'>> = (props) => (
  <BrandLogo platform="spotify" {...props} />
); 