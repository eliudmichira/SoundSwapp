import { PlatformKey } from '../components/MobileConverter';
import { db, storage, auth } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, orderBy, limit, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import networkResilience from './networkResilience';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  birthDate?: string;
  favoriteGenre?: string;
  favoriteArtist?: string;
  isPremium: boolean;
  createdAt: Date;
  lastActive: Date;
}

export interface UserStats {
  conversions: number;
  tracks: number;
  monthlyUsage: number;
  monthlyLimit: number;
  platformUsage: {
    spotify: number;
    youtube: number;
    soundcloud: number;
  };
  successRate: number;
  totalPlaylists: number;
}

export interface ProfileSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    conversionComplete: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    shareStats: boolean;
    publicProfile: boolean;
    showEmail: boolean;
    showLocation: boolean;
    showStats: boolean;
  };
}

export class ProfileService {
  private static instance: ProfileService;

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  // Get user stats from Firestore or calculate from real data
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      console.log('Fetching user stats for:', userId);
      
      // First, try to calculate real stats from conversion history
      const realStats = await this.calculateRealStats(userId);
      
      // If we have real conversion data, use it
      if (realStats.conversions > 0) {
        console.log('Using real stats from conversion history:', realStats);
        return realStats;
      }
      
      // Fallback to stored stats if no conversion history exists
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data from Firestore:', userData);
        
        const stats = userData.stats || {
          conversions: 0,
          tracks: 0,
          monthlyUsage: 0,
          monthlyLimit: 50,
          platformUsage: {
            spotify: 0,
            youtube: 0,
            soundcloud: 0
          },
          successRate: 0,
          totalPlaylists: 0
        };
        
        console.log('Processed stats:', stats);
        return stats;
      }
      
      console.log('No user document found, returning default stats');
      // Return default stats for users without documents
      return {
        conversions: 0,
        tracks: 0,
        monthlyUsage: 0,
        monthlyLimit: 50,
        platformUsage: {
          spotify: 0,
          youtube: 0,
          soundcloud: 0
        },
        successRate: 0,
        totalPlaylists: 0
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      // Return default stats on error
      return {
        conversions: 0,
        tracks: 0,
        monthlyUsage: 0,
        monthlyLimit: 50,
        platformUsage: {
          spotify: 0,
          youtube: 0,
          soundcloud: 0
        },
        successRate: 0,
        totalPlaylists: 0
      };
    }
  }

  // Update user statistics in Firestore
  async updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'stats': stats,
        'lastUpdated': new Date()
      });
      
      return await this.getUserStats(userId);
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw new Error('Failed to update user statistics');
    }
  }

  // Get user profile from Firebase Auth and Firestore
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return networkResilience.withRetry(async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Get additional profile data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userId));
      const firestoreData = userDoc.exists() ? userDoc.data() : {};
      
      const profile: UserProfile = {
        id: userId,
        displayName: currentUser.displayName || firestoreData.displayName || 'User',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || firestoreData.photoURL,
        bio: firestoreData.bio || '',
        isPremium: firestoreData.isPremium || false,
        createdAt: firestoreData.createdAt ? new Date(firestoreData.createdAt.toDate()) : new Date(currentUser.metadata.creationTime || Date.now()),
        lastActive: new Date()
      };
      
      return profile;
    }, 'getUserProfile');
  }

  // Update user profile in Firebase Auth and Firestore
  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    return networkResilience.withRetry(async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Update Firebase Auth profile
      if (profile.displayName || profile.photoURL) {
        await updateProfile(currentUser, {
          displayName: profile.displayName || currentUser.displayName,
          photoURL: profile.photoURL || currentUser.photoURL
        });
      }

      // Update Firestore profile data
      const userRef = doc(db, 'users', userId);
      const updateData: any = {
        lastUpdated: new Date()
      };
      
      if (profile.displayName) updateData.displayName = profile.displayName;
      if (profile.photoURL) updateData.photoURL = profile.photoURL;
      if (profile.bio !== undefined) updateData.bio = profile.bio;
      if (profile.isPremium !== undefined) updateData.isPremium = profile.isPremium;
      
      await updateDoc(userRef, updateData);
      
      return await this.getUserProfile(userId) as UserProfile;
    }, 'updateUserProfile');
  }

  // Upload profile image to Firebase Storage
  async uploadProfileImage(userId: string, file: File): Promise<string> {
    try {
      
      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('Authentication required. Please sign in again.');
      }
      
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please select an image under 5MB.');
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }
      
      // Create a unique filename
      const timestamp = Date.now();
      const fileExtension = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const fileName = `profile-images/${userId}/${timestamp}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}.${fileExtension}`;
      
      // Create storage reference
      const storageRef = ref(storage, fileName);
      
      // Upload file resumably with metadata
      console.log(`[ProfileService] Uploading profile image for user ${userId}`);
      const metadata = { contentType: file.type, cacheControl: 'public,max-age=31536000' } as const;
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      await new Promise<void>((resolve, reject) => {
        uploadTask.on('state_changed', undefined, (err) => {
          try {
            console.error('[ProfileService] Upload error payload:', {
              code: (err as any)?.code,
              serverResponse: (err as any)?.serverResponse,
              message: (err as any)?.message,
            });
          } catch {}
          reject(err);
        }, () => resolve());
      });
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log(`[ProfileService] Profile image uploaded successfully: ${downloadURL}`);
      return downloadURL;
      
    } catch (error) {
      console.error('[ProfileService] Error uploading profile image:', error);
      
      if (error instanceof Error) {
        if ((error as any)?.code === 'storage/unauthorized') {
          throw new Error('You do not have permission to upload images. Please sign in again.');
        }
        if ((error as any)?.code === 'storage/canceled') {
          throw new Error('Upload canceled. Please try again.');
        }
        if ((error as any)?.code === 'storage/retry-limit-exceeded' || (error as any)?.code === 'storage/cannot-slice-blob') {
          throw new Error('Upload failed due to connection issues. Please try again.');
        }
        if ((error as any)?.serverResponse && String((error as any).serverResponse).includes('PreconditionFailed')) {
          throw new Error('Upload failed due to a precondition error. Please retry.');
        }
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      throw new Error('Failed to upload profile image. Please try again.');
    }
  }

  // Get profile settings from Firestore
  async getProfileSettings(userId: string): Promise<ProfileSettings> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.settings || {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            conversionComplete: true,
            weeklyReport: false
          },
          privacy: {
            shareStats: false,
            publicProfile: false,
            showEmail: false,
            showLocation: false,
            showStats: true
          }
        };
      }
      
      // Return default settings
      return {
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
          conversionComplete: true,
          weeklyReport: false
        },
        privacy: {
          shareStats: false,
          publicProfile: false,
          showEmail: false,
          showLocation: false,
          showStats: true
        }
      };
    } catch (error) {
      console.error('Error getting profile settings:', error);
      throw new Error('Failed to load profile settings');
    }
  }

  // Update profile settings in Firestore
  async updateProfileSettings(userId: string, settings: Partial<ProfileSettings>): Promise<ProfileSettings> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'settings': settings,
        'lastUpdated': new Date()
      });
      
      return await this.getProfileSettings(userId);
    } catch (error) {
      console.error('Error updating profile settings:', error);
      throw new Error('Failed to update profile settings');
    }
  }

  // Export user data
  async exportUserData(userId: string): Promise<any> {
    try {
      const [profile, stats, settings, conversionHistory] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserStats(userId),
        this.getProfileSettings(userId),
        this.getConversionHistory(userId, 1000) // Get all conversions
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          profile,
          stats,
          settings
        },
        conversionHistory,
        exportFormat: 'json',
        version: '1.0'
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  // Delete user account and all associated data
  async deleteUserAccount(userId: string): Promise<boolean> {
    try {
      // Import Firebase Storage functions for cleanup
      const { ref, listAll, deleteObject } = await import('firebase/storage');
      const { storage } = await import('../lib/firebase');
      
      // Delete profile images from Storage
      try {
        const profileImagesRef = ref(storage, `profile-images/${userId}`);
        const imageList = await listAll(profileImagesRef);
        await Promise.all(imageList.items.map(item => deleteObject(item)));
      } catch (storageError) {
        console.warn('Could not delete profile images:', storageError);
      }

      // Delete user document and all subcollections
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);

      // Delete conversion history
      const conversionsRef = collection(db, 'users', userId, 'conversions');
      const conversionsSnapshot = await getDocs(conversionsRef);
      await Promise.all(conversionsSnapshot.docs.map(doc => deleteDoc(doc.ref)));

      return true;
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw new Error('Failed to delete user account');
    }
  }

  // Get conversion history from Firestore
  async getConversionHistory(userId: string, limitCount: number = 10): Promise<any[]> {
    try {
      const conversionsRef = collection(db, 'conversions');
      const q = query(
        conversionsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const conversions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
      }));
      
      return conversions;
    } catch (error) {
      console.error('Error getting conversion history:', error);
      return [];
    }
  }

  // Get platform usage statistics
  async getPlatformUsage(userId: string): Promise<{ [key in PlatformKey]: number }> {
    try {
      const stats = await this.getUserStats(userId);
      return {
        spotify: stats.platformUsage.spotify,
        youtube: stats.platformUsage.youtube,
        soundcloud: stats.platformUsage.soundcloud
      };
    } catch (error) {
      console.error('Error getting platform usage:', error);
      return { spotify: 0, youtube: 0, soundcloud: 0 };
    }
  }

  // Check if user has premium features
  async hasPremiumFeatures(userId: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.isPremium || false;
    } catch (error) {
      console.error('Error checking premium features:', error);
      return false;
    }
  }

  // Upgrade user to premium
  async upgradeToPremium(userId: string): Promise<boolean> {
    try {
      await this.updateUserProfile(userId, { isPremium: true });
      return true;
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      return false;
    }
  }

  // Get monthly usage statistics
  async getMonthlyUsage(userId: string, month: number, year: number): Promise<{ used: number; limit: number }> {
    try {
      const stats = await this.getUserStats(userId);
      return {
        used: stats.monthlyUsage,
        limit: stats.monthlyLimit
      };
    } catch (error) {
      console.error('Error getting monthly usage:', error);
      return { used: 0, limit: 50 };
    }
  }

  // Reset monthly usage
  async resetMonthlyUsage(userId: string): Promise<void> {
    try {
      await this.updateUserStats(userId, { monthlyUsage: 0 });
    } catch (error) {
      console.error('Error resetting monthly usage:', error);
    }
  }

  // Add a conversion to user stats with platform tracking
  async addConversion(userId: string, tracksConverted: number = 1, platformDirection?: 'spotify-to-youtube' | 'youtube-to-spotify'): Promise<void> {
    try {
      const stats = await this.getUserStats(userId);
      
      // Note: We don't calculate success rate here anymore since it's calculated from real conversion data
      // The success rate will be recalculated when getUserStats is called next time
      
      // Update platform usage based on conversion direction
      const platformUsage = { ...stats.platformUsage };
      if (platformDirection === 'spotify-to-youtube') {
        platformUsage.spotify = (platformUsage.spotify || 0) + 1;
      } else if (platformDirection === 'youtube-to-spotify') {
        platformUsage.youtube = (platformUsage.youtube || 0) + 1;
      }
      
      await this.updateUserStats(userId, {
        conversions: stats.conversions + 1,
        tracks: stats.tracks + tracksConverted,
        monthlyUsage: stats.monthlyUsage + 1,
        successRate: stats.successRate, // Keep existing success rate, will be recalculated from real data
        platformUsage: platformUsage
      });
      
      console.log(`Updated user stats: +1 conversion, +${tracksConverted} tracks, platform usage updated`);
    } catch (error) {
      console.error('Error adding conversion:', error);
    }
  }

  // Calculate and update success rate
  async getSuccessRate(userId: string): Promise<number> {
    try {
      const stats = await this.getUserStats(userId);
      return stats.successRate;
    } catch (error) {
      console.error('Error getting success rate:', error);
      return 0;
    }
  }

  // Calculate real stats from conversion history
  async calculateRealStats(userId: string): Promise<UserStats> {
    try {
      console.log('[ProfileService] Calculating real stats for user:', userId);
      
      const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      // Get conversion history from Firestore
      const conversionsRef = collection(db, 'users', userId, 'conversions');
      
      // Try without orderBy first to avoid index issues
      let q;
      try {
        q = query(conversionsRef, orderBy('convertedAt', 'desc'));
      } catch (indexError) {
        console.warn('[ProfileService] OrderBy failed, trying without ordering:', indexError);
        q = query(conversionsRef);
      }
      
      const querySnapshot = await getDocs(q);
      console.log('[ProfileService] Found', querySnapshot.size, 'conversions in Firestore');
      
      let totalConversions = 0;
      let totalTracks = 0;
      let totalTracksAttempted = 0;
      let totalTracksSuccessfullyConverted = 0;
      let spotifyConversions = 0;
      let youtubeConversions = 0;
      let currentMonthUsage = 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('[ProfileService] Processing conversion:', {
          id: doc.id,
          tracksMatched: data.tracksMatched,
          totalTracks: data.totalTracks,
          tracksFailed: data.tracksFailed,
          spotifyPlaylistId: data.spotifyPlaylistId,
          youtubePlaylistId: data.youtubePlaylistId,
          convertedAt: data.convertedAt
        });
        
        const convertedAt = data.convertedAt?.toDate ? data.convertedAt.toDate() : new Date(data.convertedAt);
        
        // Count conversions
        totalConversions++;
        
        // Count tracks for success rate calculation
        const tracksAttempted = data.totalTracks || 0;
        const tracksSuccessfullyConverted = data.tracksMatched || 0;
        
        totalTracksAttempted += tracksAttempted;
        totalTracksSuccessfullyConverted += tracksSuccessfullyConverted;
        
        // Count total tracks (for backward compatibility)
        const tracksCount = data.tracksMatched || data.totalTracks || 0;
        totalTracks += tracksCount;
        
        // Count platform usage based on conversion type
        if (data.spotifyPlaylistId && data.youtubePlaylistId) {
          // This is a cross-platform conversion
          if (data.spotifyPlaylistName) {
            // Spotify to YouTube conversion
            spotifyConversions++;
          } else if (data.youtubePlaylistId) {
            // YouTube to Spotify conversion
            youtubeConversions++;
          }
        } else if (data.spotifyPlaylistId) {
          // Spotify conversion
          spotifyConversions++;
        } else if (data.youtubePlaylistId) {
          // YouTube conversion
          youtubeConversions++;
        }
        
        // Count monthly usage
        if (convertedAt.getMonth() === currentMonth && convertedAt.getFullYear() === currentYear) {
          currentMonthUsage++;
        }
      });
      
      // Calculate success rate: (successfully converted tracks / total tracks attempted) * 100
      const successRate = totalTracksAttempted > 0 ? Math.round((totalTracksSuccessfullyConverted / totalTracksAttempted) * 100) : 0;
      
      console.log('[ProfileService] Success rate calculation:', {
        totalTracksAttempted,
        totalTracksSuccessfullyConverted,
        successRate: `${successRate}%`,
        formula: `${totalTracksSuccessfullyConverted} / ${totalTracksAttempted} * 100`
      });
      
      const calculatedStats = {
        conversions: totalConversions,
        tracks: totalTracks,
        monthlyUsage: currentMonthUsage,
        monthlyLimit: 50,
        platformUsage: {
          spotify: spotifyConversions,
          youtube: youtubeConversions,
          soundcloud: 0 // Not implemented yet
        },
        successRate: successRate,
        totalPlaylists: totalConversions // Each conversion represents a playlist
      };
      
      console.log('[ProfileService] Calculated stats:', calculatedStats);
      return calculatedStats;
      
    } catch (error) {
      console.error('[ProfileService] Error calculating real stats:', error);
      // Return default stats if calculation fails
      return {
        conversions: 0,
        tracks: 0,
        monthlyUsage: 0,
        monthlyLimit: 50,
        platformUsage: {
          spotify: 0,
          youtube: 0,
          soundcloud: 0
        },
        successRate: 0,
        totalPlaylists: 0
      };
    }
  }
}

// Export singleton instance
export const profileService = ProfileService.getInstance(); 