import { PlatformKey } from '../types/conversion';

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPlaylistUrl = (url: string, platform: PlatformKey): boolean => {
  if (!isValidUrl(url)) return false;
  
  const urlLower = url.toLowerCase();
  
  switch (platform) {
    case 'spotify':
      return urlLower.includes('open.spotify.com') && urlLower.includes('playlist');
    case 'youtube':
      return (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) && urlLower.includes('list=');
    case 'soundcloud':
      return urlLower.includes('soundcloud.com') && urlLower.includes('sets');
    default:
      return false;
  }
};

export const validateConversionInput = (sourcePlatform: PlatformKey | null, destPlatform: PlatformKey | null, playlistUrl: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!sourcePlatform) {
    errors.push('Please select a source platform');
  }
  
  if (!destPlatform) {
    errors.push('Please select a destination platform');
  }
  
  if (sourcePlatform === destPlatform) {
    errors.push('Source and destination platforms must be different');
  }
  
  if (!playlistUrl.trim()) {
    errors.push('Please enter a playlist URL');
  } else if (!isValidPlaylistUrl(playlistUrl, sourcePlatform!)) {
    errors.push('Please enter a valid playlist URL for the selected platform');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAuthToken = (token: string): boolean => {
  if (!token) return false;
  
  // Basic token validation - check if it's a valid JWT format
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  return jwtRegex.test(token);
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .substring(0, 1000); // Limit length
}; 