import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './useAuthStore';

const useNotificationStore = create(
  persist(
    (set, get) => ({
      // Notification state
      notifications: [],
      unreadCount: 0,
      toasts: [],
      categories: [
        'Task',
        'Event',
        'Garden',
        'Plot',
        'Maintenance',
        'Weather',
        'System'
      ],
      isLoading: false,
      error: null,

      // Basic actions
      setNotifications: (notifications) => set({ 
        notifications,
        unreadCount: notifications.filter(n => !n.read).length
      }),

      // Notification operations
      fetchNotifications: async () => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/notifications', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch notifications');
          }

          const notifications = await response.json();
          set({ 
            notifications,
            unreadCount: notifications.filter(n => !n.read).length,
            isLoading: false
          });

          return { success: true, notifications };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      markAsRead: async (notificationId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to mark notification as read');
          }

          set(state => {
            const updatedNotifications = state.notifications.map(n =>
              n._id === notificationId ? { ...n, read: true } : n
            );

            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter(n => !n.read).length,
              isLoading: false
            };
          });

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      markAllAsRead: async () => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/notifications/mark-all-read', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to mark all as read');
          }

          set(state => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadCount: 0,
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Remove notification
      removeNotification: (notificationId) => {
        const { notifications } = get();
        const updatedNotifications = notifications.filter(n => n._id !== notificationId);
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        set({ 
          notifications: updatedNotifications,
          unreadCount
        });
      },

      // WebSocket connection for real-time notifications
      initializeWebSocket: () => {
        const { token } = useAuthStore.getState();
        const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/notifications`);
        
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: 'auth', token }));
        };

        ws.onmessage = (event) => {
          const notification = JSON.parse(event.data);
          set(state => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
          }));
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          set(state => ({ error: 'WebSocket connection error' }));
        };

        return () => {
          ws.close();
        };
      },

      // Selectors
      selectAllNotifications: () => get().notifications,
      selectUnreadCount: () => get().unreadCount,
      selectCategories: () => get().categories,
      selectIsLoading: () => get().isLoading,
      selectError: () => get().error,

      // Complex selectors
      selectUnreadNotifications: () => {
        return get().notifications.filter(n => !n.read);
      },

      selectNotificationsByCategory: (category) => {
        return get().notifications.filter(n => n.category === category);
      },

      selectRecentNotifications: (hours = 24) => {
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - hours);
        
        return get().notifications.filter(n =>
          new Date(n.createdAt) > cutoff
        );
      },

      selectPriorityNotifications: () => {
        return get().notifications.filter(n => n.priority === 'high');
      },

      // Toast notification management
      addToast: (toast) => {
        const id = Date.now().toString();
        const newToast = {
          id,
          type: 'info', // info, success, warning, error
          duration: 5000,
          ...toast
        };

        set(state => ({
          toasts: [...state.toasts, newToast]
        }));

        // Auto remove toast after duration
        if (newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }

        return id;
      },

      removeToast: (id) => {
        set(state => ({
          toasts: state.toasts.filter(toast => toast.id !== id)
        }));
      },

      // Convenience methods for different toast types
      showSuccess: (message, options = {}) => {
        return get().addToast({
          type: 'success',
          message,
          ...options
        });
      },

      showError: (message, options = {}) => {
        return get().addToast({
          type: 'error',
          message,
          duration: 7000, // Errors stay longer
          ...options
        });
      },

      showWarning: (message, options = {}) => {
        return get().addToast({
          type: 'warning',
          message,
          ...options
        });
      },

      showInfo: (message, options = {}) => {
        return get().addToast({
          type: 'info',
          message,
          ...options
        });
      },

      // Clear all data
      clearAll: () => set({
        notifications: [],
        unreadCount: 0,
        toasts: [],
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        notifications: state.notifications.filter(n => !n.read),
        unreadCount: state.unreadCount
      }),
      version: 1
    }
  )
);

export default useNotificationStore;