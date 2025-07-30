import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './useAuthStore';

const usePlantGuideStore = create(
  persist(
    (set, get) => ({
      // Plant guide state
      plants: [],
      categories: [
        'Vegetables',
        'Fruits',
        'Herbs',
        'Flowers',
        'Native Plants',
        'Trees',
        'Shrubs'
      ],
      seasons: ['Spring', 'Summer', 'Fall', 'Winter'],
      currentPlant: null,
      userFavorites: [],
      gardenZone: null,
      isLoading: false,
      error: null,

      // Basic actions
      setPlants: (plants) => set({ plants }),
      setCurrentPlant: (plant) => set({ currentPlant: plant }),
      setGardenZone: (zone) => set({ gardenZone: zone }),

      // Plant guide operations
      fetchPlants: async (filters = {}) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const queryParams = new URLSearchParams(filters);
          const response = await fetch(`/api/plant-guide?${queryParams}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch plants');
          }

          const plants = await response.json();
          set({ plants, isLoading: false });
          return { success: true, plants };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      fetchPlantDetails: async (plantId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plant-guide/${plantId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch plant details');
          }

          const plant = await response.json();
          set({ currentPlant: plant, isLoading: false });
          return { success: true, plant };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      addToFavorites: async (plantId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plant-guide/favorites/${plantId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add to favorites');
          }

          const plant = await response.json();
          set(state => ({
            userFavorites: [...state.userFavorites, plant],
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      removeFromFavorites: async (plantId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plant-guide/favorites/${plantId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to remove from favorites');
          }

          set(state => ({
            userFavorites: state.userFavorites.filter(p => p._id !== plantId),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Growing guide operations
      getGrowingGuide: async (plantId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/plant-guide/${plantId}/growing-guide`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch growing guide');
          }

          const guide = await response.json();
          return { success: true, guide };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Selectors
      selectAllPlants: () => get().plants,
      selectCurrentPlant: () => get().currentPlant,
      selectCategories: () => get().categories,
      selectSeasons: () => get().seasons,
      selectUserFavorites: () => get().userFavorites,
      selectGardenZone: () => get().gardenZone,
      selectIsLoading: () => get().isLoading,
      selectError: () => get().error,

      // Complex selectors
      selectPlantsByCategory: (category) => {
        return get().plants.filter(plant => plant.category === category);
      },

      selectPlantsBySeason: (season) => {
        return get().plants.filter(plant => 
          plant.plantingSeasons.includes(season)
        );
      },

      selectPlantsByZone: (zone) => {
        return get().plants.filter(plant =>
          plant.growingZones.includes(zone)
        );
      },

      selectRecommendedPlants: () => {
        const { gardenZone } = get();
        const currentMonth = new Date().getMonth();
        const seasons = {
          winter: [11, 0, 1],
          spring: [2, 3, 4],
          summer: [5, 6, 7],
          fall: [8, 9, 10]
        };

        let currentSeason;
        for (const [season, months] of Object.entries(seasons)) {
          if (months.includes(currentMonth)) {
            currentSeason = season;
            break;
          }
        }

        return get().plants.filter(plant =>
          plant.growingZones.includes(gardenZone) &&
          plant.plantingSeasons.map(s => s.toLowerCase()).includes(currentSeason)
        );
      }
    }),
    {
      name: 'plant-guide-store',
      partialize: (state) => ({
        userFavorites: state.userFavorites,
        gardenZone: state.gardenZone
      }),
      version: 1
    }
  )
);

export default usePlantGuideStore;
