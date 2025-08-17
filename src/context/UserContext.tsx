import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await auth.signInWithEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await auth.signIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed');
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      await auth.signUpWithEmail(email, password, displayName, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await auth.signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: auth.user ? {
          uid: auth.user.uid,
          email: auth.user.email,
          displayName: auth.user.displayName
        } : null,
        loading: auth.loading,
        error: error || auth.error,
        signInWithEmail,
        signInWithGoogle,
        signUpWithEmail,
        signOut
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 