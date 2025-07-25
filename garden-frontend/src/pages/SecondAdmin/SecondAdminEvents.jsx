import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './SecondAdminEvents.scss';

function SecondAdminEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, [selectedMonth]);

  const fetchEvents = async () => {
    try {
      const month = selectedMonth.getMonth() + 1;
      const year = selectedMonth.getFullYear();

      const response = await fetch(`/api/second-admin/events?month=${month}&year=${year}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
      }
      
      setEvents(data.data.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventUpdate = async (eventId, status) => {
    try {
      const response = await fetch(`/api/second-admin/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update event');
      }
      
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status } : event
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const navigateMonth = (direction) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="second-admin-events">
      <header className="page-header">
        <h1>Event Management</h1>
        <div className="month-navigation">
          <button onClick={() => navigateMonth(-1)}>&lt; Previous</button>
          <h2>
            {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => navigateMonth(1)}>Next &gt;</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="events-grid">
        {events.map(event => (
          <div key={event._id} className={`event-card ${event.status}`}>
            <div className="event-header">
              <h3>{event.title}</h3>
              <span className={`status-badge ${event.status}`}>
                {event.status}
              </span>
            </div>

            <div className="event-details">
              <p>
                <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {new Date(event.startDate).toLocaleTimeString()}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Garden:</strong> {event.garden.name}
              </p>
              <p>
                <strong>Organizer:</strong> {event.organizer.name}
              </p>
              <p>
                <strong>Participants:</strong> {event.participants.length}
              </p>
            </div>

            <div className="event-description">
              <p>{event.description}</p>
            </div>

            <div className="event-actions">
              {event.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleEventUpdate(event._id, 'approved')}
                    className="approve"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleEventUpdate(event._id, 'rejected')}
                    className="reject"
                  >
                    Reject
                  </button>
                </>
              )}
              {event.status === 'approved' && (
                <button 
                  onClick={() => handleEventUpdate(event._id, 'cancelled')}
                  className="cancel"
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={() => window.location.href = `/events/${event._id}`}
                className="view-details"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="no-events">
          <p>No events found for this month.</p>
        </div>
      )}
    </div>
  );
}

export default SecondAdminEvents;
