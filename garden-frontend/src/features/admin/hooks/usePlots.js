import { useState, useEffect } from 'react';
import useAuthStore from '../../../store/useAuthStore';

export const usePlots = (gardenId) => {
  const [plots, setPlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  const fetchPlots = async () => {
    try {
      setIsLoading(true);
      const url = gardenId ? `/api/plots?gardenId=${gardenId}` : '/api/plots';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch plots');
      }

      const data = await response.json();
      setPlots(data.plots);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createPlot = async (plotData) => {
    try {
      const response = await fetch('/api/plots', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plotData),
      });

      if (!response.ok) {
        throw new Error('Failed to create plot');
      }

      const data = await response.json();
      setPlots(prev => [...prev, data.plot]);
      return data.plot;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePlot = async (plotId, updateData) => {
    try {
      const response = await fetch(`/api/plots/${plotId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update plot');
      }

      const data = await response.json();
      setPlots(prev => prev.map(plot => 
        plot._id === plotId ? { ...plot, ...data.plot } : plot
      ));
      return data.plot;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const assignPlot = async (plotId, userId) => {
    try {
      const response = await fetch(`/api/plots/${plotId}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign plot');
      }

      const data = await response.json();
      setPlots(prev => prev.map(plot => 
        plot._id === plotId ? { ...plot, assignedTo: data.user } : plot
      ));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPlots();
  }, [gardenId, token]);

  return {
    plots,
    isLoading,
    error,
    createPlot,
    updatePlot,
    assignPlot,
    refreshPlots: fetchPlots,
  };
};
