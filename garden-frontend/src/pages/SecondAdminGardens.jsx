import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function SecondAdminGardens() {
  const { user } = useAuth();
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchGardens() {
      setLoading(true);
      try {
        const res = await fetch('/api/second-admin/gardens', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch gardens');
        setGardens(data.gardens || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGardens();
  }, []);

  if (!user || user.role !== 'second-admin') return <div>Access denied.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="second-admin-gardens">
      <h2>Assigned Gardens</h2>
      <ul>
        {gardens.map(g => (
          <li key={g._id}>{g.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SecondAdminGardens;
