import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const gardenApi = {
  // Get all gardens
  getGardens: async () => {
    const response = await axios.get(`${API_URL}/gardens`, {
      withCredentials: true
    });
    return response.data;
  },

  // Get a single garden's details
  getGarden: async (gardenId) => {
    const response = await axios.get(`${API_URL}/gardens/${gardenId}`, {
      withCredentials: true
    });
    return response.data;
  },

  // Get plots for a garden
  getGardenPlots: async (gardenId) => {
    const response = await axios.get(`${API_URL}/gardens/${gardenId}/plots`, {
      withCredentials: true
    });
    return response.data;
  },

  // Create a new plot
  createPlot: async (gardenId, plotData) => {
    const response = await axios.post(`${API_URL}/gardens/${gardenId}/plots`, plotData, {
      withCredentials: true
    });
    return response.data;
  },

  // Update plot status
  updatePlotStatus: async (plotId, status) => {
    const response = await axios.patch(`${API_URL}/gardens/plots/${plotId}/status`, { status }, {
      withCredentials: true
    });
    return response.data;
  },

  // Assign plot to user
  assignPlot: async (plotId, userId) => {
    const response = await axios.post(`${API_URL}/gardens/plots/${plotId}/assign`, { userId }, {
      withCredentials: true
    });
    return response.data;
  }
};

export default gardenApi;
