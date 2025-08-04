import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  browserSessionPersistence,
  setPersistence,
  type User,
  type Auth
} from 'firebase/auth';

import {
  getFirestore,
  enableNetwork,
  disableNetwork,
  waitForPendingWrites,
  enableIndexedDbPersistence,
  collection,
  doc,
  getDoc,
  type Firestore,
  type DocumentData,
  type DocumentReference,
  type CollectionReference,
  FirestoreError,
  setDoc,
  getDocFromServer
} from 'firebase/firestore';

import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase services with proper type annotations
let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;
let db: Firestore;
let analytics: Analytics | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  db = getFirestore(app);

  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  console.error('Please check your Firebase configuration in .env file');
  throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : String(error)}`);
}

// Device detection utilities
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isAndroidDevice = () => {
  return /Android/i.test(navigator.userAgent);
};

// Firestore initialization state
let firestoreInitialized = false;
let firestoreInitPromise: Promise<Firestore> | null = null;

// Initialize Firestore with persistence
const initializeFirestore = async (): Promise<Firestore> => {
  if (firestoreInitialized) return db;

  try {
    await enableIndexedDbPersistence(db).catch((error: FirestoreError) => {
      if (error.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence enabled in another tab');
      } else if (error.code === 'unimplemented') {
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
export const waitForFirestore = async (): Promise<Firestore> => {
  if (!firestoreInitPromise) {
    firestoreInitPromise = initializeFirestore();
  }
  return firestoreInitPromise;
};

// Google Sign-in function
export const signInWithGoogle = async (preferRedirect = true) => {
  if (!auth) throw new Error('Firebase Auth is not initialized');

  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  try {
    // For mobile, use longer timeout settings
    if (isMobileDevice()) {
      try {
        await setPersistence(auth, browserSessionPersistence);
      } catch (err) {
        console.warn('Failed to set auth persistence:', err);
      }
    }

    if (preferRedirect) {
      await signInWithRedirect(auth, provider);
      return null; // Redirect will reload the page
    } else {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    }
  } catch (error: any) {
    console.error('Error during Google sign-in:', error);
    throw error;
  }
};

// Android-specific auth handler
export const handleAndroidAuth = async (authPromise: Promise<any>, timeoutMs = 20000): Promise<any> => {
  if (!isAndroidDevice()) return authPromise;

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Authentication timeout')), timeoutMs);
  });

  try {
    const result = await Promise.race([authPromise, timeoutPromise]);
    return result;
  } catch (error: any) {
    console.error('Android authentication error:', error);
    throw error;
  }
};

// Reconnect to Firestore
export const reconnectFirestore = async (attemptCount = 0): Promise<boolean> => {
  const MAX_ATTEMPTS = 5;
  const DELAY = 2000;

  if (attemptCount >= MAX_ATTEMPTS) {
    console.error('Max reconnection attempts reached');
    return false;
  }

  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    await enableNetwork(db);
    await waitForPendingWrites(db);
    return true;
  } catch (err) {
    console.error('Error reconnecting to Firestore:', err);
    const backoffTime = Math.min(DELAY * Math.pow(2, attemptCount), 30000);
    await new Promise(resolve => setTimeout(resolve, backoffTime));
    return reconnectFirestore(attemptCount + 1);
  }
};

// Debug Google auth state
export const debugGoogleAuth = async () => {
  try {
    const currentUser = auth?.currentUser;
    const redirectPending = await getRedirectResult(auth).then(result => !!result).catch(() => false);

    return {
      hasUser: !!currentUser,
      isAndroid: isAndroidDevice(),
      isMobile: isMobileDevice(),
      isOnline: navigator.onLine,
      hasPendingRedirect: redirectPending
    };
  } catch (error) {
    console.error('Error in debug function:', error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

// Enhanced Firebase initialization with retry logic
export const initializeFirebase = async (retryCount = 3, delay = 1000): Promise<Firestore> => {
  for (let i = 0; i < retryCount; i++) {
    try {
      // Initialize Firebase if not already initialized
      if (!getApps().length) {
        initializeApp(firebaseConfig);
      }

      // Initialize Firestore with offline persistence
      const firestoreDb = getFirestore();
      await enableIndexedDbPersistence(firestoreDb).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Persistence disabled: multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('Persistence not supported by browser');
        }
      });

      // Test connection with timeout and better error handling
      try {
        const testRef = doc(collection(firestoreDb, 'test'), 'connection');
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 5000)
        );
        
        await Promise.race([
          getDoc(testRef),
          timeoutPromise
        ]);
        
        console.log('Firebase initialized successfully');
        return firestoreDb;
      } catch (connectionError) {
        console.warn('Firestore connection test failed, but continuing with offline mode:', connectionError);
        // Even if connection test fails, return the Firestore instance for offline mode
        return firestoreDb;
      }
    } catch (error) {
      console.error(`Firebase initialization attempt ${i + 1} failed:`, error);
      
      // If this is the last attempt, try to return a basic Firestore instance for offline mode
      if (i === retryCount - 1) {
        console.warn('All Firebase initialization attempts failed, attempting offline mode');
        try {
          // Try to get a basic Firestore instance without connection testing
          if (!getApps().length) {
            initializeApp(firebaseConfig);
          }
          const firestoreDb = getFirestore();
          console.log('Firebase initialized in offline mode');
          return firestoreDb;
        } catch (offlineError) {
          console.error('Even offline mode failed:', offlineError);
          throw new Error('Failed to initialize Firebase. Please check your internet connection and try again.');
        }
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Failed to initialize Firebase after multiple attempts');
};

// Enhanced error handling for Firestore operations
export const handleFirestoreError = (error: any) => {
  if (error.code === 'permission-denied') {
    return 'You do not have permission to access this data. Please sign in again.';
  } else if (error.code === 'unavailable') {
    return 'Database is currently unavailable. Please check your internet connection and try again.';
  } else if (error.code === 'not-found') {
    return 'The requested data was not found. It may have been deleted or moved.';
  } else if (error.code === 'failed-precondition') {
    return 'Operation failed. Please refresh the page and try again.';
  } else {
    return 'Database connection error. Please try again.';
  }
};

/**
 * Save insights for a user in Firestore under users/{userId}/insights
 * @param {string} userId - The user's UID
 * @param {object} insights - The insights object to save
 */
export async function saveUserInsights(userId: string, insights: any) {
  await setDoc(
    doc(db, 'users', userId),
    { insights },
    { merge: true }
  );
}

/**
 * Retrieve insights for a user from Firestore under users/{userId}/insights
 * @param {string} userId - The user's UID
 * @returns {Promise<any|null>} - The insights object or null if not found
 */
export async function getUserInsights(userId: string): Promise<any | null> {
  try {
    // Try to get the latest from the server
    const docSnap = await getDocFromServer(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data().insights || null;
    }
    return null;
  } catch (err) {
    // If server fetch fails (offline, etc.), fall back to cache
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists()) {
        return docSnap.data().insights || null;
      }
      return null;
    } catch (err2) {
      // If both fail, return null
      return null;
    }
  }
}

// Export initialized services
export {
  app,
  auth,
  storage,
  db,
  analytics
};

// Export auth methods
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
};

// Export types
export type {
  User,
  Firestore,
  DocumentData,
  DocumentReference,
  CollectionReference
}; 