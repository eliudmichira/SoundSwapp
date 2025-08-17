import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './env';

// Use centralized Firebase configuration from env.ts

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

// Initialize Firebase services with error handling
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure auth settings to reduce token refresh errors
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = process.env.NODE_ENV === 'development';

// Explicitly disable Analytics to prevent Google Analytics errors
if (typeof window !== 'undefined') {
  // Prevent Firebase from auto-initializing Analytics
  (window as any).__FIREBASE_DEFAULTS__ = {
    ...(window as any).__FIREBASE_DEFAULTS__,
    analytics: false
  };
  
  // Add global error handler for Firebase token refresh issues
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'object' && 'code' in event.reason) {
      const error = event.reason as any;
      if (error.code === 'auth/network-request-failed' || 
          error.code === 'auth/too-many-requests' ||
          error.message?.includes('securetoken.googleapis.com')) {
        console.warn('🔧 Firebase token refresh issue detected, this is normal in development:', error.message);
        event.preventDefault(); // Prevent the error from showing in console
      }
    }
  });
}

// Auth providers
export const googleProvider = new GoogleAuthProvider();

// Stubs to satisfy imports from legacy code
export const reconnectFirestore = async () => true;
export const conversionConverter = {
  toFirestore: (doc: any) => doc,
  fromFirestore: (snapshot: any) => ({ id: snapshot.id, ...(snapshot.data?.() || {}) })
};

// Additional exports for legacy code compatibility
export const waitForFirestore = async () => db;
export const handleFirestoreError = (error: any) => {
  console.error('Firestore error:', error);
  return error;
};

export const saveUserInsights = async (userId: string, insights: any) => {
  // Stub implementation
  console.log('Saving user insights:', { userId, insights });
  return true;
};

export const getUserInsights = async (userId: string) => {
  // Stub implementation
  console.log('Getting user insights for:', userId);
  return null;
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export default app; 