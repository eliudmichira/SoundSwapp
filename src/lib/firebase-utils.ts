import { enableIndexedDbPersistence, enableNetwork, disableNetwork, waitForPendingWrites } from 'firebase/firestore';
import { db } from './firebase-services';

let isOffline = false;
let firestoreConnected = true;

// Add a promise to track initialization
let firestoreInitPromise: Promise<typeof db> | null = null;

export const waitForFirestore = async () => {
  if (!firestoreInitPromise) {
    firestoreInitPromise = initializeFirestore().then(() => {
      if (!db) {
        throw new Error('Firestore not initialized');
      }
      return db;
    });
  }
  return firestoreInitPromise;
};

export const initializeFirestore = async () => {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    // Enable offline persistence
    await enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence enabled in another tab');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser doesn\'t support persistence');
      } else {
        throw err;
      }
    });

    // Set up network status listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial network check
    if (!navigator.onLine) {
      await handleOffline();
    }

    console.log('Firestore initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
};

const handleOffline = async () => {
  if (!db || isOffline) return;
  
  isOffline = true;
  console.log('📡 Network offline, disabling Firestore network access');
  
  try {
    await disableNetwork(db);
    firestoreConnected = false;
    console.log('Firestore network disabled');
  } catch (error) {
    console.error('Error disabling Firestore network:', error);
  }
};

const handleOnline = async () => {
  if (!db || !isOffline) return;
  
  isOffline = false;
  console.log('📡 Network online, attempting to reconnect Firestore');
  
  try {
    await enableNetwork(db);
    console.log('Firestore network enabled');
    
    await waitForPendingWrites(db);
    firestoreConnected = true;
    console.log('Pending writes completed');
  } catch (error) {
    console.error('Error enabling Firestore network:', error);
  }
};

export const isFirestoreConnected = () => firestoreConnected;
export const isNetworkOffline = () => isOffline; 