import { PlatformKey } from '../types/conversion';

export const extractPlaylistId = (url: string, platform: PlatformKey): string | null => {
  try {
    const urlObj = new URL(url);
    
    switch (platform) {
      case 'spotify':
        const spotifyMatch = url.match(/playlist\/([a-zA-Z0-9]+)/);
        return spotifyMatch ? spotifyMatch[1] : null;
        
      case 'youtube':
        const youtubeMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
        return youtubeMatch ? youtubeMatch[1] : null;
        
      case 'soundcloud':
        const soundcloudMatch = url.match(/sets\/([a-zA-Z0-9_-]+)/);
        return soundcloudMatch ? soundcloudMatch[1] : null;
        
      default:
        return null;
    }
  } catch (error) {
    console.error('Error extracting playlist ID:', error);
    return null;
  }
};

export const validatePlaylistUrl = (url: string, platform: PlatformKey): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    
    switch (platform) {
      case 'spotify':
        return url.includes('open.spotify.com') && url.includes('playlist');
      case 'youtube':
        return url.includes('youtube.com') || url.includes('youtu.be');
      case 'soundcloud':
        return url.includes('soundcloud.com') && url.includes('sets');
      default:
        return false;
    }
  } catch {
    return false;
  }
};

export const formatPlaylistUrl = (url: string, platform: PlatformKey): string => {
  // Remove any tracking parameters and normalize the URL
  try {
    const urlObj = new URL(url);
    
    switch (platform) {
      case 'spotify':
        // Keep only essential parameters
        return `${urlObj.origin}${urlObj.pathname}`;
      case 'youtube':
        // Keep only list parameter
        const listParam = urlObj.searchParams.get('list');
        return listParam ? `${urlObj.origin}${urlObj.pathname}?list=${listParam}` : url;
      case 'soundcloud':
        return `${urlObj.origin}${urlObj.pathname}`;
      default:
        return url;
    }
  } catch {
    return url;
  }
};

export const generatePlaylistName = (originalName: string, sourcePlatform: PlatformKey, destPlatform: PlatformKey): string => {
  const timestamp = new Date().toLocaleDateString();
  return `${originalName} (${sourcePlatform} → ${destPlatform}) - ${timestamp}`;
}; 