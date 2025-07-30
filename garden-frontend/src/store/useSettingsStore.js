import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './useAuthStore';

const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Settings state
      settings: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          desktop: true
        },
        displayMode: 'grid',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        measurementUnit: 'metric',
        gardenPreferences: {
          showWeather: true,
          showTasks: true,
          showEvents: true,
          defaultView: 'overview'
        }
      },
      isLoading: false,
      error: null,

      // Settings actions
      updateSettings: async (newSettings) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newSettings)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update settings');
          }

          const updatedSettings = await response.json();
          set(state => ({
            settings: {
              ...state.settings,
              ...updatedSettings
            },
            isLoading: false
          }));

          return { success: true, settings: updatedSettings };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updateTheme: (theme) => {
        set(state => ({
          settings: {
            ...state.settings,
            theme
          }
        }));
        document.documentElement.setAttribute('data-theme', theme);
      },

      updateLanguage: async (language) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/settings/language', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ language })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update language');
          }

          set(state => ({
            settings: {
              ...state.settings,
              language
            },
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updateNotificationPreferences: async (preferences) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/settings/notifications', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(preferences)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update notification preferences');
          }

          set(state => ({
            settings: {
              ...state.settings,
              notifications: {
                ...state.settings.notifications,
                ...preferences
              }
            },
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updateMeasurementUnit: (unit) => {
        set(state => ({
          settings: {
            ...state.settings,
            measurementUnit: unit
          }
        }));
      },

      updateGardenPreferences: async (preferences) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/settings/garden-preferences', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(preferences)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update garden preferences');
          }

          set(state => ({
            settings: {
              ...state.settings,
              gardenPreferences: {
                ...state.settings.gardenPreferences,
                ...preferences
              }
            },
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Selectors
      selectSettings: () => get().settings,
      selectTheme: () => get().settings.theme,
      selectLanguage: () => get().settings.language,
      selectNotificationPreferences: () => get().settings.notifications,
      selectMeasurementUnit: () => get().settings.measurementUnit,
      selectGardenPreferences: () => get().settings.gardenPreferences,
      selectIsLoading: () => get().isLoading,
      selectError: () => get().error,

      // Complex selectors
      selectDisplaySettings: () => {
        const { theme, displayMode, gardenPreferences } = get().settings;
        return {
          theme,
          displayMode,
          ...gardenPreferences
        };
      },

      selectLocalizationSettings: () => {
        const { language, timezone, measurementUnit } = get().settings;
        return {
          language,
          timezone,
          measurementUnit
        };
      }
    }),
    {
      name: 'settings-store',
      partialize: (state) => ({
        settings: state.settings
      }),
      version: 1
    }
  )
);

export default useSettingsStore;
