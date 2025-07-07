import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
let analytics = null;

try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Analytics initialization failed:', error);
}

// Firestore initialization state
let firestoreInitialized = false;
let firestoreInitPromise: Promise<typeof db> | null = null;

// Initialize Firestore with persistence
const initializeFirestore = async () => {
  if (firestoreInitialized) return db;

  try {
    await enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence enabled in another tab');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser doesn\'t support persistence');
      }
    });

    firestoreInitialized = true;
    return db;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};

// Wait for Firestore to be ready
export const waitForFirestore = async () => {
  if (!firestoreInitPromise) {
    firestoreInitPromise = initializeFirestore();
  }
  return firestoreInitPromise;
};

// Export initialized services
export {
  app,
  auth,
  storage,
  db,
  analytics
}; 