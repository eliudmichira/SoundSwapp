import { db as firebaseDb } from './firebase';
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, Firestore } from 'firebase/firestore';

// Type assertion for Firestore db
const db = firebaseDb as Firestore;

export interface UserActivity {
  userId: string;
  type: 'LOGIN' | 'SPOTIFY_CONNECT' | 'YOUTUBE_CONNECT' | 'PLAYLIST_CONVERT' | 'PLAYLIST_SHARE';
  timestamp: Date;
  details?: Record<string, any>;
}

export const trackActivity = async (activity: Omit<UserActivity, 'timestamp'>) => {
  try {
    if (!db) throw new Error('Firestore is not initialized');
    const activityRef = collection(db, 'user_activities');
    await addDoc(activityRef, {
      ...activity,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
};

export const getUserActivities = async (userId: string): Promise<UserActivity[]> => {
  try {
    if (!db) throw new Error('Firestore is not initialized');
    const activitiesRef = collection(db, 'user_activities');
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as UserActivity[];
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
};

export const getServiceConnections = async (userId: string) => {
  try {
    if (!db) throw new Error('Firestore is not initialized');
    const userDoc = await getDocs(query(
      collection(db, 'service_connections'),
      where('userId', '==', userId)
    ));
    
    return userDoc.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching service connections:', error);
    return [];
  }
}; 