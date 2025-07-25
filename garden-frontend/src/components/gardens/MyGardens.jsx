
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RoleBadge from '../common/RoleBadge';

function MyGardens() {
  const { user } = useAuth();
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchGardens() {
      setLoading(true);
      try {
        const res = await fetch('/api/gardens/my', { credentials: 'include' });
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-gardens">
      <h2>My Gardens</h2>
      {gardens.length === 0 ? (
        <div>You are not a member of any gardens yet.</div>
      ) : (
        <ul>
          {gardens.map(g => (
            <li key={g._id}>
              <strong>{g.name}</strong>
              <RoleBadge role={g.role} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyGardens;
