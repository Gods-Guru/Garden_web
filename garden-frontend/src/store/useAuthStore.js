import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // User's gardens and roles
      userGardens: [],
      currentGarden: null,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        userGardens: user?.gardens || []
      }),

      setToken: (token) => set({ token }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setCurrentGarden: (garden) => set({ currentGarden: garden }),

      // Get user's role in a specific garden
      getUserRoleInGarden: (gardenId) => {
        const { user } = get();
        if (!user || !user.gardens) return null;
        
        const membership = user.gardens.find(
          g => g.gardenId === gardenId || g.gardenId._id === gardenId
        );
        return membership?.role || null;
      },

      // Check if user is garden owner/admin
      isGardenAdmin: (gardenId) => {
        const { user } = get();
        if (!user) return false;
        
        // Global admin
        if (user.role === 'admin') return true;
        
        // Garden-specific admin or owner
        const role = get().getUserRoleInGarden(gardenId);
        return role === 'owner' || role === 'admin';
      },

      // Check if user can manage garden (owner, admin, or coordinator)
      canManageGarden: (gardenId) => {
        const { user } = get();
        if (!user) return false;
        
        // Global admin
        if (user.role === 'admin') return true;
        
        // Garden-specific roles
        const role = get().getUserRoleInGarden(gardenId);
        return ['owner', 'admin', 'coordinator'].includes(role);
      },

      // Login action
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          // Check if 2FA is required
          if (data.data.requires2FA) {
            set({ loading: false, error: null });
            return {
              success: true,
              requires2FA: true,
              email: data.data.email,
              twoFactorMethod: data.data.twoFactorMethod,
              message: data.message
            };
          }

          // Normal login success
          const { user, token } = data.data;

          set({
            user,
            token,
            isAuthenticated: true,
            userGardens: user.gardens || [],
            loading: false,
            error: null
          });

          // Store token in localStorage for API calls
          localStorage.setItem('token', token);

          return { success: true, user };
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message,
            user: null,
            token: null,
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      // Register action
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          const { user, token } = data.data;
          
          set({ 
            user, 
            token,
            isAuthenticated: true,
            userGardens: user.gardens || [],
            loading: false,
            error: null
          });

          // Store token in localStorage for API calls
          localStorage.setItem('token', token);

          return { success: true, user };
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message,
            user: null,
            token: null,
            isAuthenticated: false
          });
          return { success: false, error: error.message };
        }
      },

      // Logout action
      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          userGardens: [],
          currentGarden: null,
          loading: false,
          error: null
        });
      },

      // Refresh user data
      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ loading: true });
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
              userGardens: data.user.gardens || [],
              loading: false 
            });
          } else {
            // Token might be expired
            get().logout();
          }
        } catch (error) {
          set({ loading: false, error: error.message });
        }
      },

      // Update user gardens (after joining/leaving)
      updateUserGardens: (gardens) => set({ 
        userGardens: gardens,
        user: { ...get().user, gardens }
      }),

    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        userGardens: state.userGardens,
      }),
    }
  )
);

export default useAuthStore;
