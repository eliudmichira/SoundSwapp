import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth } from './firebase';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, Firestore } from 'firebase/firestore';

interface ConversionMetadata {
  id: string;
  userId: string;
  originalNotation: string;
  convertedNotation: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
  updatedAt: number;
  error?: string;
}

export class ConversionManager {
  private static readonly CONVERSIONS_PATH = 'conversions';
  
  static async saveConversion(
    userId: string,
    conversionId: string,
    notation: string,
    convertedNotation: string
  ): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');

      // Save metadata to Firestore
      const metadata: ConversionMetadata = {
        id: conversionId,
        userId,
        originalNotation: notation,
        convertedNotation,
        status: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await setDoc(
        doc(db as Firestore, 'users', userId, 'conversions', conversionId),
        metadata
      );

      // Save the actual conversion data to Storage
      const path = `${this.CONVERSIONS_PATH}/${userId}/${conversionId}/result.json`;
      const storageRef = ref(storage, path);
      const conversionData = JSON.stringify({
        original: notation,
        converted: convertedNotation,
        timestamp: Date.now()
      });
      
      await uploadBytes(storageRef, new Blob([conversionData], { type: 'application/json' }));
    } catch (error) {
      console.error('Error saving conversion:', error);
      throw error;
    }
  }

  static async getConversion(userId: string, conversionId: string): Promise<ConversionMetadata> {
    try {
      if (!db) throw new Error('Firestore not initialized');

      // First check Firestore for metadata
      const docRef = doc(db as Firestore, 'users', userId, 'conversions', conversionId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Conversion not found');
      }

      const metadata = docSnap.data() as ConversionMetadata;

      // If the conversion is completed, fetch the actual data from Storage
      if (metadata.status === 'completed') {
        const path = `${this.CONVERSIONS_PATH}/${userId}/${conversionId}/result.json`;
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        const response = await fetch(url);
        const data = await response.json();
        
        // Update the metadata with the actual conversion data
        metadata.originalNotation = data.original;
        metadata.convertedNotation = data.converted;
      }

      return metadata;
    } catch (error) {
      console.error('Error fetching conversion:', error);
      throw error;
    }
  }

  static async updateConversionStatus(
    userId: string,
    conversionId: string,
    status: 'pending' | 'completed' | 'failed',
    error?: string
  ): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');

      const docRef = doc(db as Firestore, 'users', userId, 'conversions', conversionId);
      await updateDoc(docRef, {
        status,
        updatedAt: Date.now(),
        ...(error && { error })
      });
    } catch (err) {
      console.error('Error updating conversion status:', err);
      throw err;
    }
  }

  static async deleteConversion(userId: string, conversionId: string): Promise<void> {
    try {
      if (!db) throw new Error('Firestore not initialized');

      // Delete from Firestore
      const docRef = doc(db as Firestore, 'users', userId, 'conversions', conversionId);
      await deleteDoc(docRef);

      // Delete from Storage
      const path = `${this.CONVERSIONS_PATH}/${userId}/${conversionId}/result.json`;
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting conversion:', error);
      throw error;
    }
  }
} 