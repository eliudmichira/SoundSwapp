import { SpotifyService } from './spotifyApi';

export interface PlaylistCheckResult {
  exists: boolean;
  playlistId?: string;
  playlistName?: string;
}

/**
 * Checks if a playlist with the given name already exists in the user's Spotify account
 */
export const checkForExistingPlaylist = async (
  playlistName: string, 
  accessToken: string
): Promise<PlaylistCheckResult> => {
  try {
    const userProfile = await SpotifyService.getProfile();
    const playlists = await SpotifyService.getPlaylists();
    
    // Check for exact match or with "(Converted)" suffix
    const existingPlaylist = playlists.find((playlist: any) => 
      playlist.name === playlistName || 
      playlist.name === `${playlistName} (Converted)` ||
      playlist.name === `${playlistName} (Converted) (1)` ||
      playlist.name === `${playlistName} (Converted) (2)`
    );
    
    if (existingPlaylist) {
      return {
        exists: true,
        playlistId: existingPlaylist.id,
        playlistName: existingPlaylist.name
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.warn('Error checking for existing playlist:', error);
    return { exists: false };
  }
};

/**
 * Generates a unique playlist name to avoid duplicates
 */
export const generateUniquePlaylistName = async (
  baseName: string,
  accessToken: string
): Promise<string> => {
  const checkResult = await checkForExistingPlaylist(baseName, accessToken);
  
  if (!checkResult.exists) {
    return baseName;
  }
  
  // Try with different suffixes
  for (let i = 1; i <= 10; i++) {
    const newName = `${baseName} (Converted) (${i})`;
    const checkResult = await checkForExistingPlaylist(newName, accessToken);
    
    if (!checkResult.exists) {
      return newName;
    }
  }
  
  // If all attempts fail, add timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `${baseName} (Converted) ${timestamp}`;
};

/**
 * Conversion lock to prevent multiple simultaneous conversions
 */
export class ConversionLock {
  private static isLocked = false;
  private static lockId: string | null = null;

  static acquire(): string | null {
    if (this.isLocked) {
      return null;
    }
    
    this.isLocked = true;
    this.lockId = `conversion_${Date.now()}`;
    return this.lockId;
  }

  static release(lockId: string): boolean {
    if (this.lockId === lockId) {
      this.isLocked = false;
      this.lockId = null;
      return true;
    }
    return false;
  }

  static isAcquired(): boolean {
    return this.isLocked;
  }
} 