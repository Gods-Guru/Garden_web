import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
  // Notification state
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  // Toast notifications (temporary)
  toasts: [],

  // Actions
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter(n => !n.read).length;
    set({ notifications, unreadCount });
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  // Add a new notification
  addNotification: (notification) => {
    const { notifications } = get();
    const newNotifications = [notification, ...notifications];
    const unreadCount = newNotifications.filter(n => !n.read).length;
    set({ 
      notifications: newNotifications,
      unreadCount
    });
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n =>
      n._id === notificationId ? { ...n, read: true } : n
    );
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    set({ 
      notifications: updatedNotifications,
      unreadCount
    });
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    set({ 
      notifications: updatedNotifications,
      unreadCount: 0
    });
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

  // Fetch notifications from API
  fetchNotifications: async () => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Not authenticated' };

    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notifications');
      }

      get().setNotifications(data.data.notifications);
      set({ loading: false });

      return { success: true, data: data.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message 
      });
      return { success: false, error: error.message };
    }
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
    loading: false,
    error: null
  }),
}));

export default useNotificationStore;
