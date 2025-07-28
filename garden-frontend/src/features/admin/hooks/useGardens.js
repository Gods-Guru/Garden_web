import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api/gardens';

export const useGardens = () => {
  return useQuery({
    queryKey: ['gardens'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
      return data;
    }
  });
};

export const useCreateGarden = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (gardenData) => {
      const { data } = await axios.post(API_URL, gardenData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gardens']);
    }
  });
};

export const useUpdateGarden = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, gardenData }) => {
      const { data } = await axios.put(`${API_URL}/${id}`, gardenData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gardens']);
    }
  });
};

export const useDeleteGarden = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (gardenId) => {
      await axios.delete(`${API_URL}/${gardenId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gardens']);
    }
  });
};

export const useGardenStats = () => {
  return useQuery({
    queryKey: ['garden-stats'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/stats`);
      return data;
    }
  });
};
