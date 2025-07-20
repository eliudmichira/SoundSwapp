import { useState, useEffect, useCallback } from 'react';
import { SimpleAuth, SimpleUser } from '../lib/simpleAuth';

export const useSimpleAuth = () => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (SimpleAuth.isAuthenticated()) {
          const currentUser = SimpleAuth.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking SimpleAuth:', err);
        setError('Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for fallback auth success events
    const handleFallbackAuth = (event: CustomEvent) => {
      if (event.detail?.source === 'simpleAuth') {
        setUser(event.detail.user);
        setError(null);
      }
    };

    window.addEventListener('fallback-auth-success', handleFallbackAuth as EventListener);

    return () => {
      window.removeEventListener('fallback-auth-success', handleFallbackAuth as EventListener);
    };
  }, []);

  // Sign in with email and password
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const userData = await SimpleAuth.signInWithEmail(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign up with email and password
  const signUpWithEmail = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      setLoading(true);
      const userData = await SimpleAuth.signUpWithEmail(email, password, displayName);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const userData = await SimpleAuth.signInWithGoogle();
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setError(null);
      await SimpleAuth.signOut();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Check if service is connected
  const isServiceConnected = useCallback((service: string) => {
    return SimpleAuth.isServiceConnected(service);
  }, []);

  // Store tokens for a service
  const storeServiceTokens = useCallback((service: string, tokens: any) => {
    SimpleAuth.storeTokens(service, tokens);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    isServiceConnected,
    storeServiceTokens
  };
}; 