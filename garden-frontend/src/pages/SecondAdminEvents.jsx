import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function SecondAdminEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch('/api/second-admin/events', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch events');
        setEvents(data.events || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (!user || user.role !== 'second-admin') return <div>Access denied.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="second-admin-events">
      <h2>Approve Events</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>{event.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default SecondAdminEvents;
