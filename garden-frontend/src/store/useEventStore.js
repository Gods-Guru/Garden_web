import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './useAuthStore';

const useEventStore = create(
  persist(
    (set, get) => ({
      // Event state
      events: [],
      eventCategories: [
        'Workshop',
        'Community Day',
        'Planting Session',
        'Harvest Festival',
        'Maintenance Day',
        'Educational',
        'Social',
        'Other'
      ],
      registeredEvents: [],
      pastEvents: [],
      isLoading: false,
      error: null,

      // Basic actions
      setEvents: (events) => set({ events }),
      setRegisteredEvents: (events) => set({ registeredEvents: events }),
      setPastEvents: (events) => set({ pastEvents: events }),

      // Event CRUD operations
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
            body: JSON.stringify({
              ...eventData,
              status: 'upcoming',
              createdAt: new Date().toISOString()
            })
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

      fetchEvents: async (gardenId, filters = {}) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const queryParams = new URLSearchParams(filters);
          const response = await fetch(`/api/gardens/${gardenId}/events?${queryParams}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch events');
          }

          const events = await response.json();
          const now = new Date();

          set({ 
            events,
            pastEvents: events.filter(e => new Date(e.endDate) < now),
            isLoading: false 
          });

          return { success: true, events };
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
            body: JSON.stringify({
              ...updates,
              updatedAt: new Date().toISOString()
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update event');
          }

          const updatedEvent = await response.json();
          set(state => {
            const newEvents = state.events.map(e => 
              e._id === eventId ? updatedEvent : e
            );
            const now = new Date();

            return {
              events: newEvents,
              pastEvents: newEvents.filter(e => new Date(e.endDate) < now),
              isLoading: false
            };
          });

          return { success: true, event: updatedEvent };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      registerForEvent: async (gardenId, eventId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/events/${eventId}/register`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to register for event');
          }

          const updatedEvent = await response.json();
          set(state => ({
            events: state.events.map(e => 
              e._id === eventId ? updatedEvent : e
            ),
            registeredEvents: [...state.registeredEvents, updatedEvent],
            isLoading: false
          }));

          return { success: true, event: updatedEvent };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      cancelRegistration: async (gardenId, eventId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/events/${eventId}/cancel-registration`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to cancel registration');
          }

          const updatedEvent = await response.json();
          set(state => ({
            events: state.events.map(e => 
              e._id === eventId ? updatedEvent : e
            ),
            registeredEvents: state.registeredEvents.filter(e => e._id !== eventId),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Selectors
      selectAllEvents: () => get().events,
      selectRegisteredEvents: () => get().registeredEvents,
      selectPastEvents: () => get().pastEvents,
      selectEventCategories: () => get().eventCategories,
      selectIsLoading: () => get().isLoading,
      selectError: () => get().error,

      // Complex selectors
      selectUpcomingEvents: () => {
        const now = new Date();
        return get().events.filter(event => 
          new Date(event.startDate) > now
        ).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      },

      selectEventsByCategory: (category) => {
        return get().events.filter(event => event.category === category);
      },

      selectEventsByDateRange: (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return get().events.filter(event =>
          new Date(event.startDate) >= start &&
          new Date(event.endDate) <= end
        );
      },

      selectOngoingEvents: () => {
        const now = new Date();
        return get().events.filter(event =>
          new Date(event.startDate) <= now &&
          new Date(event.endDate) >= now
        );
      },

      selectEventsByAttendance: (minAttendees) => {
        return get().events.filter(event =>
          event.registeredAttendees?.length >= minAttendees
        );
      }
    }),
    {
      name: 'event-store',
      partialize: (state) => ({
        events: state.events,
        registeredEvents: state.registeredEvents,
        pastEvents: state.pastEvents
      }),
      version: 1
    }
  )
);

export default useEventStore;
