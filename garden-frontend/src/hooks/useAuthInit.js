import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

export const useAuthInit = () => {
  const { initializeAuth, refreshUser, token } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Initialize auth state from localStorage
        initializeAuth();

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
      }
    };

    initAuth();
  }, []); // Empty dependency array to run only once
};

export default useAuthInit;
