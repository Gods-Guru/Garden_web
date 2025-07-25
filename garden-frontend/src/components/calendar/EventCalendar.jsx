import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function EventCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch('/api/events', { credentials: 'include' });
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

  const handleRSVP = async (eventId) => {
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Update events list with new RSVP status
      setEvents(events.map(e => 
        e._id === eventId 
          ? { ...e, attendees: [...e.attendees, user._id] }
          : e
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="event-calendar">
      <header className="calendar-header">
        <h1>Garden Events</h1>
        <p>Join upcoming events and activities</p>
      </header>

      <main className="calendar-content">
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : events.length === 0 ? (
          <div className="empty">No events scheduled.</div>
        ) : (
          <div className="events-list">
            {events.map(event => (
              <div key={event._id} className="event-card">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span className="event-date">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <p>{event.description}</p>
                <div className="event-meta">
                  <span>{event.location}</span>
                  <span>{event.attendees?.length || 0} attending</span>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleRSVP(event._id)}
                  disabled={event.attendees?.includes(user?._id)}
                >
                  {event.attendees?.includes(user?._id) ? 'Going' : 'RSVP'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default EventCalendar;
