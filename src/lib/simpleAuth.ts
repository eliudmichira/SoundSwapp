import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { signInWithGoogle as firebaseSignInWithGoogle } from './firebase';

// Simple authentication storage keys
const AUTH_STORAGE_KEYS = {
  USER_DATA: 'simple_auth_user_data',
  TOKENS: 'simple_auth_tokens',
  SESSION: 'simple_auth_session'
};

// Types
export interface SimpleUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  timestamp: number;
}

interface SimpleTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Simple authentication system using Spotify-style pattern
 */
export class SimpleAuth {
  /**
   * Sign in with email and password
   */
  static async signInWithEmail(email: string, password: string): Promise<SimpleUser> {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userData: SimpleUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || undefined,
        photoURL: userCredential.user.photoURL || undefined,
        timestamp: Date.now()
      };
      
      // Store user data
      this.storeUserData(userData);
      
      // Update Firestore
      await this.updateFirestoreUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Simple auth sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUpWithEmail(email: string, password: string, displayName: string): Promise<SimpleUser> {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      const userData: SimpleUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: displayName,
        photoURL: userCredential.user.photoURL || undefined,
        timestamp: Date.now()
      };
      
      // Store user data
      this.storeUserData(userData);
      
      // Update Firestore
      await this.updateFirestoreUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Simple auth sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in with Google
   */
  static async signInWithGoogle(): Promise<SimpleUser> {
    try {
      const user = await firebaseSignInWithGoogle();
      
      if (!user) {
        throw new Error('Google sign-in failed');
      }
      
      const userData: SimpleUser = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || undefined,
        photoURL: user.photoURL || undefined,
        timestamp: Date.now()
      };
      
      // Store user data
      this.storeUserData(userData);
      
      // Update Firestore
      await this.updateFirestoreUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Simple auth Google sign in error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    try {
      const userData = this.getUserData();
      if (!userData) return false;
      
      // Check if session is still valid (1 hour)
      const sessionValid = Date.now() - userData.timestamp < 3600000;
      
      if (!sessionValid) {
        this.clearUserData();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current user data
   */
  static getCurrentUser(): SimpleUser | null {
    try {
      return this.getUserData();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    try {
      const auth = getAuth();
      await auth.signOut();
      this.clearUserData();
    } catch (error) {
      console.error('Simple auth sign out error:', error);
      throw error;
    }
  }

  /**
   * Store user data in localStorage
   */
  private static storeUserData(userData: SimpleUser): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify({
        active: true,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  /**
   * Get user data from localStorage
   */
  private static getUserData(): SimpleUser | null {
    try {
      const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Clear user data from localStorage
   */
  private static clearUserData(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKENS);
      localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  /**
   * Update user data in Firestore
   */
  private static async updateFirestoreUser(userData: SimpleUser): Promise<void> {
    try {
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        lastUpdated: new Date(),
        simpleAuth: true
      }, { merge: true });
    } catch (error) {
      console.error('Error updating Firestore user:', error);
      // Don't throw - this is a fallback system
    }
  }

  /**
   * Store tokens (for service connections)
   */
  static storeTokens(service: string, tokens: SimpleTokens): void {
    try {
      const allTokens = this.getTokens();
      allTokens[service] = tokens;
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKENS, JSON.stringify(allTokens));
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  /**
   * Get tokens for a service
   */
  static getTokens(service?: string): any {
    try {
      const tokens = localStorage.getItem(AUTH_STORAGE_KEYS.TOKENS);
      const allTokens = tokens ? JSON.parse(tokens) : {};
      
      if (service) {
        return allTokens[service] || null;
      }
      
      return allTokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      return service ? null : {};
    }
  }

  /**
   * Check if service is connected
   */
  static isServiceConnected(service: string): boolean {
    try {
      const tokens = this.getTokens(service);
      if (!tokens) return false;
      
      // Check if token is expired
      return tokens.expiresAt > Date.now();
    } catch (error) {
      console.error('Error checking service connection:', error);
      return false;
    }
  }
} 