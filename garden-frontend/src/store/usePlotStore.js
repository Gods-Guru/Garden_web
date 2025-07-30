import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './useAuthStore';

const usePlotStore = create(
  persist(
    (set, get) => ({
      // Plot state
      plots: [],
      currentPlot: null,
      plantings: [],
      waterLogs: [],
      isLoading: false,
      error: null,

      // Basic actions
      setPlots: (plots) => set({ plots }),
      setCurrentPlot: (plot) => set({ currentPlot: plot }),
      setPlantings: (plantings) => set({ plantings }),
      setWaterLogs: (logs) => set({ waterLogs: logs }),

      // Plot CRUD operations
      fetchPlot: async (plotId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plots/${plotId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch plot');
          }

          const plot = await response.json();
          set({ currentPlot: plot, isLoading: false });
          return { success: true, plot };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Planting operations
      addPlanting: async (plotId, plantingData) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plots/${plotId}/plantings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(plantingData)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add planting');
          }

          const newPlanting = await response.json();
          set(state => ({
            plantings: [...state.plantings, newPlanting],
            isLoading: false
          }));

          return { success: true, planting: newPlanting };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updatePlanting: async (plotId, plantingId, updates) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plots/${plotId}/plantings/${plantingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update planting');
          }

          const updatedPlanting = await response.json();
          set(state => ({
            plantings: state.plantings.map(p => 
              p._id === plantingId ? updatedPlanting : p
            ),
            isLoading: false
          }));

          return { success: true, planting: updatedPlanting };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      removePlanting: async (plotId, plantingId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plots/${plotId}/plantings/${plantingId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to remove planting');
          }

          set(state => ({
            plantings: state.plantings.filter(p => p._id !== plantingId),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Water log operations
      addWaterLog: async (plotId, logData) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plots/${plotId}/water-logs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(logData)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add water log');
          }

          const newLog = await response.json();
          set(state => ({
            waterLogs: [...state.waterLogs, newLog],
            isLoading: false
          }));

          return { success: true, log: newLog };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      fetchWaterLogs: async (plotId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plots/${plotId}/water-logs`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch water logs');
          }

          const logs = await response.json();
          set({ waterLogs: logs, isLoading: false });
          return { success: true, logs };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Selectors
      selectCurrentPlot: () => get().currentPlot,
      selectPlantings: () => get().plantings,
      selectWaterLogs: () => get().waterLogs,
      selectIsLoading: () => get().isLoading,
      selectError: () => get().error,

      // Complex selectors
      selectActivePlantings: () => {
        const plantings = get().plantings;
        return plantings.filter(p => !p.harvestedDate);
      },

      selectRecentWaterLogs: (days = 7) => {
        const logs = get().waterLogs;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return logs.filter(log => new Date(log.date) > cutoff);
      }
    }),
    {
      name: 'plot-store',
      partialize: (state) => ({
        plots: state.plots,
        currentPlot: state.currentPlot
      }),
      version: 1
    }
  )
);

export default usePlotStore;
