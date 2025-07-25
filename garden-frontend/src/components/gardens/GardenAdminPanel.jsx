import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function GardenAdminPanel({ gardenId }) {
  const { user } = useAuth();
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchGarden() {
      setLoading(true);
      try {
        const res = await fetch(`/api/gardens/${gardenId}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch garden');
        setGarden(data.garden);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGarden();
  }, [gardenId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!garden) return null;

  // Only show if user is admin of this garden
  if (!garden.admins?.includes(user?._id)) return null;

  return (
    <div className="garden-admin-panel">
      <h2>Garden Admin Panel</h2>
      <p>Manage members, plots, events, and settings for <strong>{garden.name}</strong>.</p>
      {/* Add management features here */}
    </div>
  );
}

export default GardenAdminPanel;
