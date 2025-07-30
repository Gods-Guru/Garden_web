import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './useAuthStore';

const useTaskStore = create(
  persist(
    (set, get) => ({
      // Task state
      tasks: [],
      taskCategories: [
        'Planting',
        'Watering',
        'Weeding',
        'Harvesting',
        'Maintenance',
        'Event Setup',
        'Cleaning',
        'Other'
      ],
      taskPriorities: ['Low', 'Medium', 'High', 'Urgent'],
      assignedTasks: [],
      completedTasks: [],
      isLoading: false,
      error: null,

      // Basic actions
      setTasks: (tasks) => set({ tasks }),
      setAssignedTasks: (tasks) => set({ assignedTasks: tasks }),
      setCompletedTasks: (tasks) => set({ completedTasks: tasks }),

      // Task CRUD operations
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
            body: JSON.stringify({
              ...taskData,
              status: 'pending',
              createdAt: new Date().toISOString()
            })
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

      fetchTasks: async (gardenId, filters = {}) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const queryParams = new URLSearchParams(filters);
          const response = await fetch(`/api/gardens/${gardenId}/tasks?${queryParams}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch tasks');
          }

          const tasks = await response.json();
          set({ 
            tasks,
            assignedTasks: tasks.filter(t => t.status === 'assigned'),
            completedTasks: tasks.filter(t => t.status === 'completed'),
            isLoading: false 
          });

          return { success: true, tasks };
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
            body: JSON.stringify({
              ...updates,
              updatedAt: new Date().toISOString()
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update task');
          }

          const updatedTask = await response.json();
          set(state => {
            const newTasks = state.tasks.map(t => 
              t._id === taskId ? updatedTask : t
            );

            return {
              tasks: newTasks,
              assignedTasks: newTasks.filter(t => t.status === 'assigned'),
              completedTasks: newTasks.filter(t => t.status === 'completed'),
              isLoading: false
            };
          });

          return { success: true, task: updatedTask };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      assignTask: async (gardenId, taskId, userId) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/tasks/${taskId}/assign`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              userId,
              status: 'assigned',
              assignedAt: new Date().toISOString()
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to assign task');
          }

          const updatedTask = await response.json();
          set(state => {
            const newTasks = state.tasks.map(t => 
              t._id === taskId ? updatedTask : t
            );

            return {
              tasks: newTasks,
              assignedTasks: newTasks.filter(t => t.status === 'assigned'),
              isLoading: false
            };
          });

          return { success: true, task: updatedTask };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      completeTask: async (gardenId, taskId, completionData) => {
        const { token } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/gardens/${gardenId}/tasks/${taskId}/complete`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ...completionData,
              status: 'completed',
              completedAt: new Date().toISOString()
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to complete task');
          }

          const updatedTask = await response.json();
          set(state => {
            const newTasks = state.tasks.map(t => 
              t._id === taskId ? updatedTask : t
            );

            return {
              tasks: newTasks,
              assignedTasks: newTasks.filter(t => t.status === 'assigned'),
              completedTasks: newTasks.filter(t => t.status === 'completed'),
              isLoading: false
            };
          });

          return { success: true, task: updatedTask };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Selectors
      selectAllTasks: () => get().tasks,
      selectAssignedTasks: () => get().assignedTasks,
      selectCompletedTasks: () => get().completedTasks,
      selectTaskCategories: () => get().taskCategories,
      selectTaskPriorities: () => get().taskPriorities,
      selectIsLoading: () => get().isLoading,
      selectError: () => get().error,

      // Complex selectors
      selectTasksByCategory: (category) => {
        return get().tasks.filter(task => task.category === category);
      },

      selectTasksByPriority: (priority) => {
        return get().tasks.filter(task => task.priority === priority);
      },

      selectTasksByUser: (userId) => {
        return get().tasks.filter(task => task.assignedTo === userId);
      },

      selectOverdueTasks: () => {
        const now = new Date();
        return get().tasks.filter(task => 
          task.status !== 'completed' && 
          new Date(task.dueDate) < now
        );
      },

      selectUpcomingTasks: (days = 7) => {
        const now = new Date();
        const future = new Date();
        future.setDate(future.getDate() + days);
        
        return get().tasks.filter(task =>
          task.status !== 'completed' &&
          new Date(task.dueDate) >= now &&
          new Date(task.dueDate) <= future
        );
      }
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        tasks: state.tasks,
        assignedTasks: state.assignedTasks,
        completedTasks: state.completedTasks
      }),
      version: 1
    }
  )
);

export default useTaskStore;
