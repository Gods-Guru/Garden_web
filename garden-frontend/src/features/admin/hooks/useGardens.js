import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/store/useAuthStore';

const useGardens = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch gardens
  const { data: gardens = [], isLoading, error } = useQuery({
    queryKey: ['gardens'],
    queryFn: async () => {
      const response = await fetch('/api/gardens', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch gardens');
      return response.json();
    },
  });

  // Create garden mutation
  const createGardenMutation = useMutation({
    mutationFn: async (gardenData) => {
      const response = await fetch('/api/gardens', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gardenData),
      });
      if (!response.ok) throw new Error('Failed to create garden');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gardens']);
    },
  });

  // Update garden mutation
  const updateGardenMutation = useMutation({
    mutationFn: async ({ gardenId, data }) => {
      const response = await fetch(`/api/gardens/${gardenId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update garden');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gardens']);
    },
  });

  // Delete garden mutation
  const deleteGardenMutation = useMutation({
    mutationFn: async (gardenId) => {
      const response = await fetch(`/api/gardens/${gardenId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete garden');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gardens']);
    },
  });

  // Fetch garden statistics
  const { data: stats = {} } = useQuery({
    queryKey: ['garden-stats'],
    queryFn: async () => {
      const response = await fetch('/api/gardens/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch garden statistics');
      return response.json();
    },
  });

  return {
    gardens,
    isLoading,
    error,
    stats,
    createGarden: createGardenMutation.mutate,
    updateGarden: updateGardenMutation.mutate,
    deleteGarden: deleteGardenMutation.mutate,
  };
};

export default useGardens;
