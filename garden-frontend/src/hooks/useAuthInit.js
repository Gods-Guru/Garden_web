import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

export const useAuthInit = () => {
  const { initializeAuth, refreshUser, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Starting auth initialization...');

        // Check if initializeAuth exists
        if (typeof initializeAuth !== 'function') {
          console.error('initializeAuth is not a function:', initializeAuth);
          throw new Error('initializeAuth method is missing from auth store');
        }

        // Initialize auth state from localStorage
        const initialized = initializeAuth();
        console.log('Auth initialized:', initialized);

        // If we have a token, try to refresh user data
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          console.log('Found stored token, refreshing user data...');
          await refreshUser();
        } else {
          console.log('No stored token found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token if refresh fails
        localStorage.removeItem('token');
        useAuthStore.getState().logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []); // Empty dependency array to run only once

  return { isLoading };
};

export default useAuthInit;
