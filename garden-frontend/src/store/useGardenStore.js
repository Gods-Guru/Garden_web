import { create } from 'zustand';

const useGardenStore = create((set, get) => ({
  // Garden state
  gardens: [],
  currentGarden: null,
  gardenMembers: [],
  gardenStats: null,
  loading: false,
  error: null,

  // Actions
  setGardens: (gardens) => set({ gardens }),
  
  setCurrentGarden: (garden) => set({ currentGarden: garden }),
  
  setGardenMembers: (members) => set({ gardenMembers: members }),
  
  setGardenStats: (stats) => set({ gardenStats: stats }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  // Fetch all public gardens
  fetchGardens: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams(params);
      console.log('Fetching gardens with params:', params);
      const response = await fetch(`/api/gardens?${queryParams}`);
      const data = await response.json();

      console.log('Gardens API response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch gardens');
      }

      // Handle different response formats
      let gardens = [];
      if (data.data && data.data.gardens) {
        gardens = data.data.gardens;
      } else if (data.data && Array.isArray(data.data)) {
        gardens = data.data;
      } else if (Array.isArray(data)) {
        gardens = data;
      }

      console.log('Processed gardens:', gardens.length);

      set({
        gardens: gardens,
        loading: false
      });

      return { success: true, data: gardens };
    } catch (error) {
      console.error('Error fetching gardens:', error);
      set({
        loading: false,
        error: error.message
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch nearby gardens based on location
  fetchNearbyGardens: async (lat, lng, radius = 25) => {
    set({ loading: true, error: null });
    try {
      // Convert miles to kilometers for the API
      const radiusKm = radius * 1.60934;
      console.log(`Fetching nearby gardens: lat=${lat}, lng=${lng}, radius=${radius} miles (${radiusKm} km)`);
      const response = await fetch(`/api/gardens/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
      const data = await response.json();

      console.log('Nearby gardens API response:', data);

      if (!response.ok) {
        console.error('Nearby gardens API error:', data);
        throw new Error(data.message || 'Failed to fetch nearby gardens');
      }

      // Handle different response formats
      let gardens = [];
      if (data.data && Array.isArray(data.data)) {
        gardens = data.data;
      } else if (Array.isArray(data)) {
        gardens = data;
      }

      console.log('Processed nearby gardens:', gardens.length);

      set({
        gardens: gardens,
        loading: false
      });

      return { success: true, data: gardens };
    } catch (error) {
      console.error('Error fetching nearby gardens:', error);
      // Fallback to all gardens if nearby fails
      console.log('Falling back to all gardens...');
      return get().fetchGardens();
    }
  },

  // Fetch user's gardens
  fetchMyGardens: async () => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Not authenticated' };

    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/gardens/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch your gardens');
      }

      set({ 
        gardens: data.data.gardens,
        loading: false 
      });

      return { success: true, data: data.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message 
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch single garden details
  fetchGarden: async (gardenId) => {
    const token = localStorage.getItem('token');
    
    set({ loading: true, error: null });
    try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(`/api/gardens/${gardenId}`, { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch garden');
      }

      set({ 
        currentGarden: data.data.garden,
        loading: false 
      });

      return { success: true, data: data.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message 
      });
      return { success: false, error: error.message };
    }
  },

  // Create new garden
  createGarden: async (gardenData) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Not authenticated' };

    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/gardens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(gardenData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create garden');
      }

      // Add new garden to the list
      const { gardens } = get();
      set({ 
        gardens: [...gardens, data.data.garden],
        loading: false 
      });

      return { success: true, data: data.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message 
      });
      return { success: false, error: error.message };
    }
  },

  // Update garden
  updateGarden: async (gardenId, updates) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Not authenticated' };

    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/gardens/${gardenId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update garden');
      }

      // Update garden in the list and current garden
      const { gardens, currentGarden } = get();
      const updatedGardens = gardens.map(g => 
        g._id === gardenId ? data.data.garden : g
      );
      
      set({ 
        gardens: updatedGardens,
        currentGarden: currentGarden?._id === gardenId ? data.data.garden : currentGarden,
        loading: false 
      });

      return { success: true, data: data.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message 
      });
      return { success: false, error: error.message };
    }
  },

  // Join garden
  joinGarden: async (gardenId) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Not authenticated' };

    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/gardens/${gardenId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join garden');
      }

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

  // Leave garden
  leaveGarden: async (gardenId) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Not authenticated' };

    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/gardens/${gardenId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to leave garden');
      }

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

  // Fetch garden members
  fetchGardenMembers: async (gardenId) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'Not authenticated' };

    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/gardens/${gardenId}/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch garden members');
      }

      set({ 
        gardenMembers: data.data.members,
        loading: false 
      });

      return { success: true, data: data.data };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message 
      });
      return { success: false, error: error.message };
    }
  },

  // Clear current garden
  clearCurrentGarden: () => set({ 
    currentGarden: null, 
    gardenMembers: [], 
    gardenStats: null 
  }),

  // Clear all data
  clearAll: () => set({
    gardens: [],
    currentGarden: null,
    gardenMembers: [],
    gardenStats: null,
    loading: false,
    error: null
  }),
}));

export default useGardenStore;
