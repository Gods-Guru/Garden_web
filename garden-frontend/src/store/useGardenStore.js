import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './useAuthStore';

const useGardenStore = create(
  persist(
    (set, get) => ({
      // Garden state
      gardens: [],
      currentGarden: null,
      plots: [],
      tasks: [],
      events: [],
      waterLogs: [],
      members: [],
      stats: null,
      isLoading: false,
      error: null,

      // Basic actions
      setGardens: (gardens) => set({ gardens }),
      setCurrentGarden: (garden) => set({ currentGarden: garden }),
      setMembers: (members) => set({ members }),
      setStats: (stats) => set({ stats }),
  
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Garden CRUD operations
      fetchGardens: async (params = {}) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const queryParams = new URLSearchParams(params);
          const response = await fetch(`/api/gardens?${queryParams}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch gardens');
          }

          const gardens = await response.json();
          set({ gardens, isLoading: false });
          return { success: true, gardens };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      createGarden: async (gardenData) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/gardens', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(gardenData)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create garden');
          }

          const newGarden = await response.json();
          set(state => ({
            gardens: [...state.gardens, newGarden],
            isLoading: false
          }));

          return { success: true, garden: newGarden };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updateGarden: async (gardenId, updates) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update garden');
          }

          const updatedGarden = await response.json();
          set(state => ({
            gardens: state.gardens.map(g => 
              g._id === gardenId ? updatedGarden : g
            ),
            currentGarden: state.currentGarden?._id === gardenId ? updatedGarden : state.currentGarden,
            isLoading: false
          }));

          return { success: true, garden: updatedGarden };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      deleteGarden: async (gardenId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete garden');
          }

          set(state => ({
            gardens: state.gardens.filter(g => g._id !== gardenId),
            currentGarden: state.currentGarden?._id === gardenId ? null : state.currentGarden,
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Member management
      fetchGardenMembers: async (gardenId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/members`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch garden members');
          }

          const members = await response.json();
          set({ members, isLoading: false });
          return { success: true, members };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      addGardenMember: async (gardenId, userData, role) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/members`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...userData, role })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add garden member');
          }

          const newMember = await response.json();
          set(state => ({
            members: [...state.members, newMember],
            isLoading: false
          }));

          return { success: true, member: newMember };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updateMemberRole: async (gardenId, memberId, newRole) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/members/${memberId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role: newRole })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update member role');
          }

          const updatedMember = await response.json();
          set(state => ({
            members: state.members.map(m => 
              m._id === memberId ? updatedMember : m
            ),
            isLoading: false
          }));

          return { success: true, member: updatedMember };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      removeMember: async (gardenId, memberId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/members/${memberId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to remove member');
          }

          set(state => ({
            members: state.members.filter(m => m._id !== memberId),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Plot management
      fetchPlots: async (gardenId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/plots`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch plots');
          }

          const plots = await response.json();
          set({ plots, isLoading: false });
          return { success: true, plots };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      createPlot: async (gardenId, plotData) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/plots`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(plotData)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create plot');
          }

          const newPlot = await response.json();
          set(state => ({
            plots: [...state.plots, newPlot],
            isLoading: false
          }));

          return { success: true, plot: newPlot };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updatePlot: async (gardenId, plotId, updates) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/plots/${plotId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update plot');
          }

          const updatedPlot = await response.json();
          set(state => ({
            plots: state.plots.map(p => 
              p._id === plotId ? updatedPlot : p
            ),
            isLoading: false
          }));

          return { success: true, plot: updatedPlot };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      deletePlot: async (gardenId, plotId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/plots/${plotId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete plot');
          }

          set(state => ({
            plots: state.plots.filter(p => p._id !== plotId),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Task management
      fetchTasks: async (gardenId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/tasks`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch tasks');
          }

          const tasks = await response.json();
          set({ tasks, isLoading: false });
          return { success: true, tasks };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      createTask: async (gardenId, taskData) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/tasks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create task');
          }

          const newTask = await response.json();
          set(state => ({
            tasks: [...state.tasks, newTask],
            isLoading: false
          }));

          return { success: true, task: newTask };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updateTask: async (gardenId, taskId, updates) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update task');
          }

          const updatedTask = await response.json();
          set(state => ({
            tasks: state.tasks.map(t => 
              t._id === taskId ? updatedTask : t
            ),
            isLoading: false
          }));

          return { success: true, task: updatedTask };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Event management
      fetchEvents: async (gardenId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/events`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch events');
          }

          const events = await response.json();
          set({ events, isLoading: false });
          return { success: true, events };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      createEvent: async (gardenId, eventData) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/events`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create event');
          }

          const newEvent = await response.json();
          set(state => ({
            events: [...state.events, newEvent],
            isLoading: false
          }));

          return { success: true, event: newEvent };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updateEvent: async (gardenId, eventId, updates) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/events/${eventId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update event');
          }

          const updatedEvent = await response.json();
          set(state => ({
            events: state.events.map(e => 
              e._id === eventId ? updatedEvent : e
            ),
            isLoading: false
          }));

          return { success: true, event: updatedEvent };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      deleteEvent: async (gardenId, eventId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/events/${eventId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete event');
          }

          set(state => ({
            events: state.events.filter(e => e._id !== eventId),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Fetch user's assigned gardens
      fetchMyGardens: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return { success: false, error: 'Not authenticated' };

        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/gardens/my', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch my gardens');
          }

          const data = await response.json();
          const gardens = data.gardens || data;

          set({ gardens, isLoading: false });
          return { success: true, gardens };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Selectors
      selectCurrentGarden: () => get().currentGarden,
      selectGardens: () => get().gardens,
      selectGardenMembers: () => get().members,
      selectPlots: () => get().plots,
      selectTasks: () => get().tasks,
      selectEvents: () => get().events,
      selectIsLoading: () => get().isLoading,
      selectError: () => get().error,

      // Complex selectors
      selectUserPlots: (userId) => {
        const plots = get().plots;
        return plots.filter(plot => plot.userId === userId);
      },

      selectUpcomingEvents: () => {
        const events = get().events;
        const now = new Date();
        return events
          .filter(event => new Date(event.startDate) > now)
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      },

      selectPendingTasks: () => {
        const tasks = get().tasks;
        return tasks.filter(task => !task.completed);
      }
    }),
    {
      name: 'garden-store',
      partialize: (state) => ({
        gardens: state.gardens,
        currentGarden: state.currentGarden
      }),
      version: 1
    }
  )
);

export default useGardenStore;

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch gardens');
//       }

//       // Handle different response formats
//       let gardens = [];
//       if (data.data && data.data.gardens) {
//         gardens = data.data.gardens;
//       } else if (data.data && Array.isArray(data.data)) {
//         gardens = data.data;
//       } else if (Array.isArray(data)) {
//         gardens = data;
//       }

//       console.log('Processed gardens:', gardens.length);

//       set({
//         gardens: gardens,
//         loading: false
//       });

//       return { success: true, data: gardens };
//     } catch (error) {
//       console.error('Error fetching gardens:', error);
//       set({
//         loading: false,
//         error: error.message
//       });
//       return { success: false, error: error.message };
//     }
//   },

//   // Fetch nearby gardens based on location
//   fetchNearbyGardens: async (lat, lng, radius = 25) => {
//     set({ loading: true, error: null });
//     try {
//       // Convert miles to kilometers for the API
//       const radiusKm = radius * 1.60934;
//       console.log(`Fetching nearby gardens: lat=${lat}, lng=${lng}, radius=${radius} miles (${radiusKm} km)`);
//       const response = await fetch(`/api/gardens/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
//       const data = await response.json();

//       console.log('Nearby gardens API response:', data);

//       if (!response.ok) {
//         console.error('Nearby gardens API error:', data);
//         throw new Error(data.message || 'Failed to fetch nearby gardens');
//       }

//       // Handle different response formats
//       let gardens = [];
//       if (data.data && Array.isArray(data.data)) {
//         gardens = data.data;
//       } else if (Array.isArray(data)) {
//         gardens = data;
//       }

//       console.log('Processed nearby gardens:', gardens.length);

//       set({
//         gardens: gardens,
//         loading: false
//       });

//       return { success: true, data: gardens };
//     } catch (error) {
//       console.error('Error fetching nearby gardens:', error);
//       // Fallback to all gardens if nearby fails
//       console.log('Falling back to all gardens...');
//       return get().fetchGardens();
//     }
//   },

//   // Fetch user's gardens
//   fetchMyGardens: async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return { success: false, error: 'Not authenticated' };

//     set({ loading: true, error: null });
//     try {
//       const response = await fetch('/api/gardens/my', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch your gardens');
//       }

//       set({ 
//         gardens: data.data.gardens,
//         loading: false 
//       });

//       return { success: true, data: data.data };
//     } catch (error) {
//       set({ 
//         loading: false, 
//         error: error.message 
//       });
//       return { success: false, error: error.message };
//     }
//   },

//   // Fetch single garden details
//   fetchGarden: async (gardenId) => {
//     const token = localStorage.getItem('token');
    
//     set({ loading: true, error: null });
//     try {
//       const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
//       const response = await fetch(`/api/gardens/${gardenId}`, { headers });
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch garden');
//       }

//       set({ 
//         currentGarden: data.data.garden,
//         loading: false 
//       });

//       return { success: true, data: data.data };
//     } catch (error) {
//       set({ 
//         loading: false, 
//         error: error.message 
//       });
//       return { success: false, error: error.message };
//     }
//   },

//   // Create new garden
//   createGarden: async (gardenData) => {
//     const token = localStorage.getItem('token');
//     if (!token) return { success: false, error: 'Not authenticated' };

//     set({ loading: true, error: null });
//     try {
//       const response = await fetch('/api/gardens', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(gardenData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to create garden');
//       }

//       // Add new garden to the list
//       const { gardens } = get();
//       set({ 
//         gardens: [...gardens, data.data.garden],
//         loading: false 
//       });

//       return { success: true, data: data.data };
//     } catch (error) {
//       set({ 
//         loading: false, 
//         error: error.message 
//       });
//       return { success: false, error: error.message };
//     }
//   },

//   // Update garden
//   updateGarden: async (gardenId, updates) => {
//     const token = localStorage.getItem('token');
//     if (!token) return { success: false, error: 'Not authenticated' };

//     set({ loading: true, error: null });
//     try {
//       const response = await fetch(`/api/gardens/${gardenId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(updates),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update garden');
//       }

//       // Update garden in the list and current garden
//       const { gardens, currentGarden } = get();
//       const updatedGardens = gardens.map(g => 
//         g._id === gardenId ? data.data.garden : g
//       );
      
//       set({ 
//         gardens: updatedGardens,
//         currentGarden: currentGarden?._id === gardenId ? data.data.garden : currentGarden,
//         loading: false 
//       });

//       return { success: true, data: data.data };
//     } catch (error) {
//       set({ 
//         loading: false, 
//         error: error.message 
//       });
//       return { success: false, error: error.message };
//     }
//   },

//   // Join garden
//   joinGarden: async (gardenId) => {
//     const token = localStorage.getItem('token');
//     if (!token) return { success: false, error: 'Not authenticated' };

//     set({ loading: true, error: null });
//     try {
//       const response = await fetch(`/api/gardens/${gardenId}/join`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to join garden');
//       }

//       set({ loading: false });
//       return { success: true, data: data.data };
//     } catch (error) {
//       set({ 
//         loading: false, 
//         error: error.message 
//       });
//       return { success: false, error: error.message };
//     }
//   },

//   // Leave garden
//   leaveGarden: async (gardenId) => {
//     const token = localStorage.getItem('token');
//     if (!token) return { success: false, error: 'Not authenticated' };

//     set({ loading: true, error: null });
//     try {
//       const response = await fetch(`/api/gardens/${gardenId}/leave`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to leave garden');
//       }

//       set({ loading: false });
//       return { success: true, data: data.data };
//     } catch (error) {
//       set({ 
//         loading: false, 
//         error: error.message 
//       });
//       return { success: false, error: error.message };
//     }
//   },

//   // Fetch garden members
//   fetchGardenMembers: async (gardenId) => {
//     const token = localStorage.getItem('token');
//     if (!token) return { success: false, error: 'Not authenticated' };

//     set({ loading: true, error: null });
//     try {
//       const response = await fetch(`/api/gardens/${gardenId}/members`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch garden members');
//       }

//       set({ 
//         gardenMembers: data.data.members,
//         loading: false 
//       });

//       return { success: true, data: data.data };
//     } catch (error) {
//       set({ 
//         loading: false, 
//         error: error.message 
//       });
//       return { success: false, error: error.message };
//     }
//   },

//   // Clear current garden
//   clearCurrentGarden: () => set({ 
//     currentGarden: null, 
//     gardenMembers: [], 
//     gardenStats: null 
//   }),

//   // Clear all data
//   clearAll: () => set({
//     gardens: [],
//     currentGarden: null,
//     gardenMembers: [],
//     gardenStats: null,
//     loading: false,
//     error: null
//   }),
//   }));

// export default useGardenStore;
