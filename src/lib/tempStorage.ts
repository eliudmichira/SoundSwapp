import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, StorageReference, getMetadata } from 'firebase/storage';
import { auth } from './firebase';

export class TempStorageManager {
  private static readonly TEMP_PATH = 'temp';
  
  static async uploadTempFile(file: File, prefix: string = ''): Promise<string> {
    const user = auth?.currentUser;
    if (!user) throw new Error('User must be authenticated');

    const timestamp = Date.now();
    const filename = `${prefix}${timestamp}_${file.name}`;
    const path = `${this.TEMP_PATH}/${user.uid}/${filename}`;
    
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return path;
  }

  static async getTempFileUrl(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  }

  static async cleanupTempFiles(): Promise<void> {
    const user = auth?.currentUser;
    if (!user) return;

    try {
      const tempPath = `${this.TEMP_PATH}/${user.uid}`;
      const tempRef = ref(storage, tempPath);
      
      // List all files in temp directory
      const { items } = await listAll(tempRef);
      
      // Delete files older than 24 hours
      const deletePromises = items.map(async (item: StorageReference) => {
        const metadata = await getMetadata(item);
        const createdTime = new Date(metadata.timeCreated).getTime();
        const ageInHours = (Date.now() - createdTime) / (1000 * 60 * 60);
        
        if (ageInHours >= 24) {
          await deleteObject(item);
        }
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }
} 