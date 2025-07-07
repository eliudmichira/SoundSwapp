import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface CacheEntry {
  url: string;
  timestamp: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const artworkCache = new Map<string, CacheEntry>();

export const getPlaylistArtwork = async (playlistId: string, defaultImage?: string): Promise<string> => {
  try {
    // Check cache first
    const cached = artworkCache.get(playlistId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.url;
    }

    // If not in cache, fetch from storage
    const artworkRef = ref(storage, `playlists/${playlistId}/artwork/cover.jpg`);
    const url = await getDownloadURL(artworkRef);
    
    // Update cache
    artworkCache.set(playlistId, {
      url,
      timestamp: Date.now()
    });
    
    return url;
  } catch (error) {
    console.warn(`Failed to load artwork for playlist ${playlistId}:`, error);
    return defaultImage || '/default-playlist-cover.jpg';
  }
};

export const uploadPlaylistArtwork = async (
  userId: string,
  playlistId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image.');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    // Create optimized filename
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `cover.${extension}`;
    const path = `playlists/${playlistId}/artwork/${filename}`;
    
    // Upload file
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const url = await getDownloadURL(storageRef);
    
    // Update cache
    artworkCache.set(playlistId, {
      url,
      timestamp: Date.now()
    });
    
    return url;
  } catch (error) {
    console.error('Error uploading playlist artwork:', error);
    throw error;
  }
}; 