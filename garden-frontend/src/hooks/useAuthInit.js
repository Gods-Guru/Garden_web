import { useEffect } from 'react';

export const useAuthInit = () => {
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Simple auth initialization without Zustand for now
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          console.log('Found stored token, user may be authenticated');
          // Token exists, we can initialize auth later when needed
        } else {
          console.log('No stored token found');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    };

    initAuth();
  }, []); // Empty dependency array to run only once
};

export default useAuthInit;
