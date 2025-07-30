import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Authentication state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Authorization state
      roles: [], // Global roles from JWT
      gardens: [], // Assigned gardens for managers/admins
      gardenRoles: {}, // Garden-specific roles, keyed by gardenId

      // Core actions
      setUser: (userData) => set({ 
        user: userData,
        isAuthenticated: !!userData
      }),
      
      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
      },
      
      setRoles: (roles) => set({ roles }),
      setGardens: (gardens) => set({ gardens }),
      
      // Authentication actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
          }

          const responseData = await response.json();
          console.log('Login response data:', responseData);

          // Handle different response structures
          let token, user;
          if (responseData.data) {
            // Backend returns: { success: true, data: { token, user } }
            token = responseData.data.token;
            user = responseData.data.user;
          } else {
            // Backend returns: { token, user }
            token = responseData.token;
            user = responseData.user;
          }

          console.log('Extracted token:', token);
          console.log('Extracted user:', user);

          // Validate token before decoding
          if (!token || typeof token !== 'string') {
            console.error('Invalid token received:', token);
            throw new Error('Invalid token received from server');
          }

          console.log('Decoding token:', token);
          const decoded = jwtDecode(token);

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          set({
            token,
            user,
            roles: decoded.roles || [],
            isLoading: false,
            isAuthenticated: true
          });

          // If user is a manager or admin, fetch their assigned gardens
          if (decoded.roles?.includes('manager') || decoded.roles?.includes('admin')) {
            get().fetchAssignedGardens();
          }

          return { success: true, user };
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
            roles: []
          });
          return { success: false, error: error.message };
        }
      },

      // Role and access management
      getUserRoleInGarden: (gardenId) => {
        const { user, roles } = get();
        if (!user || !user.gardens) return null;
        
        if (roles.includes('admin')) return 'admin';
        
        const membership = user.gardens.find(
          g => g.gardenId === gardenId || g.gardenId._id === gardenId
        );
        return membership?.role || null;
      },

      // Garden role management
      setGardenRoles: (gardenId, roles) => {
        set(state => ({
          gardenRoles: {
            ...state.gardenRoles,
            [gardenId]: roles
          }
        }));
      },

      // Garden access checking
      isGardenAdmin: (gardenId) => {
        const { roles, gardenRoles } = get();
        
        // Global admin has access to all gardens
        if (roles.includes('admin')) return true;
        
        // Check garden-specific roles
        const gardenRole = gardenRoles[gardenId];
        return gardenRole?.includes('admin') || gardenRole?.includes('owner');
      },

      // Access control functions
      hasRole: (role) => {
        const { roles } = get();
        return roles.includes(role);
      },

      hasAnyRole: (roleList) => {
        const { roles } = get();
        return roleList.some(role => roles.includes(role));
      },

      // Garden management permissions
      canManageGarden: (gardenId) => {
        const { roles, user } = get();
        if (!user) return false;
        
        // Global admin can manage all gardens
        if (roles.includes('admin')) return true;
        
        // Garden-specific roles
        const role = get().getUserRoleInGarden(gardenId);
        return ['owner', 'admin', 'manager'].includes(role);
      },

      // Garden data management
      fetchAssignedGardens: async () => {
        const { token } = get();
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/gardens/assigned', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch assigned gardens');
          }

          const gardens = await response.json();
          set({ gardens, isLoading: false });
          return gardens;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Two-factor authentication
      verify2FA: async (email, code, method) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/verify-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code, method })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '2FA verification failed');
          }

          const { token, user } = await response.json();
          const decoded = jwtDecode(token);

          localStorage.setItem('token', token);
          set({
            token,
            user,
            roles: decoded.roles || [],
            isLoading: false,
            isAuthenticated: true
          });

          if (decoded.roles?.includes('manager') || decoded.roles?.includes('admin')) {
            get().fetchAssignedGardens();
          }

          return { success: true, user };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Reset password functionality
      requestPasswordReset: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/request-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Password reset request failed');
          }

          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Logout action
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          gardens: [],
          gardenRoles: {},
          isLoading: false,
          error: null,
          roles: []
        });
      },

      // Initialize auth from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData && typeof token === 'string') {
          try {
            const user = JSON.parse(userData);
            const decoded = jwtDecode(token);

            set({
              token,
              user,
              isAuthenticated: true,
              roles: decoded.roles || [],
              isLoading: false
            });

            return true;
          } catch (error) {
            console.error('Error parsing stored auth data:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ isLoading: false });
            return false;
          }
        }

        set({ isLoading: false });
        return false;
      },

      // Refresh user data
      refreshUser: async () => {
        const { token } = get();
        if (!token) return false;

        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            set({ 
              user: data.user, 
              gardens: data.user.gardens || [],
              isLoading: false 
            });
            return true;
          } else {
            // Token might be expired
            get().logout();
            return false;
          }
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return false;
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        const { token, user } = get();
        if (!token) throw new Error('No authentication token');

        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
          });

          const data = await response.json();

          if (response.ok) {
            const updatedUser = { ...user, ...profileData };
            set({
              user: updatedUser,
              isLoading: false
            });
            return { success: true, user: updatedUser };
          } else {
            set({ isLoading: false, error: data.message });
            throw new Error(data.message || 'Failed to update profile');
          }
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Token and session management
      initializeSession: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          // Check if token is expired
          if (decoded.exp && decoded.exp < currentTime) {
            get().logout();
            return false;
          }
          
          set({ token });
          return get().validateToken();
        } catch (error) {
          get().logout();
          return false;
        }
      },

      validateToken: async () => {
        const { token } = get();
        if (!token) return false;

        try {
          const response = await fetch('/api/auth/validate-token', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            get().logout();
            return false;
          }

          const { user } = await response.json();
          const decoded = jwtDecode(token);

          set({
            user,
            roles: decoded.roles || [],
            isAuthenticated: true
          });

          if (decoded.roles?.includes('manager') || decoded.roles?.includes('admin')) {
            get().fetchAssignedGardens();
          }

          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        roles: state.roles,
        gardens: state.gardens,
        isAuthenticated: state.isAuthenticated
      }),
      version: 1
    }
  )
);

export default useAuthStore;