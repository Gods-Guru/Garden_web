import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EventCalendar.scss';

function EventCalendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('calendar'); // calendar, list
  const [filter, setFilter] = useState('all'); // all, registered, created

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const queryParams = new URLSearchParams({ filter });
      const res = await fetch(`/api/events?${queryParams}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEvents(data.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleRSVP = async (eventId, status) => {
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setEvents(events.map(event => 
        event._id === eventId 
          ? { ...event, attendees: data.attendees }
          : event
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setEvents(events.filter(event => event._id !== eventId));
      setSelectedEvent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isUserAttending = (event) => {
    return event.attendees.some(attendee => 
      attendee.user === user?._id && attendee.status === 'attending'
    );
  };

  const canManageEvent = (event) => {
    return user && (user.isAdmin || user._id === event.creator._id);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        return (
          <div className="event-dot-container">
            {dayEvents.map((_, index) => (
              <div key={index} className="event-dot" />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="event-calendar">
      <div className="calendar-header">
        <h2>Garden Events</h2>
        <div className="calendar-controls">
          <div className="view-toggle">
            <button 
              className={view === 'calendar' ? 'active' : ''}
              onClick={() => setView('calendar')}
            >
              Calendar View
            </button>
            <button 
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              List View
            </button>
          </div>
          <div className="filter-controls">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Events</option>
              <option value="registered">My Registered Events</option>
              <option value="created">Events I Created</option>
            </select>
          </div>
          <button 
            className="create-event-btn"
            onClick={() => navigate('/events/create')}
          >
            Create Event
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : (
        <div className="calendar-container">
          {view === 'calendar' ? (
            <div className="calendar-view">
              <Calendar
                onChange={handleDateChange}
                value={date}
                tileContent={tileContent}
                onClickDay={(value) => {
                  const dayEvents = getEventsForDate(value);
                  if (dayEvents.length > 0) {
                    setSelectedEvent(dayEvents[0]);
                  } else {
                    setSelectedEvent(null);
                  }
                }}
              />
              {selectedEvent && (
                <div className="event-details">
                  <h3>{selectedEvent.title}</h3>
                  <p className="event-time">
                    {new Date(selectedEvent.date).toLocaleString()}
                  </p>
                  <p className="event-location">{selectedEvent.location}</p>
                  <p className="event-description">{selectedEvent.description}</p>
                  <div className="event-actions">
                    {user && (
                      <button
                        className={`rsvp-button ${isUserAttending(selectedEvent) ? 'attending' : ''}`}
                        onClick={() => handleRSVP(selectedEvent._id, 'attending')}
                      >
                        {isUserAttending(selectedEvent) ? 'Cancel RSVP' : 'RSVP'}
                      </button>
                    )}
                    {canManageEvent(selectedEvent) && (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => navigate(`/events/${selectedEvent._id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteEvent(selectedEvent._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  <div className="attendees-list">
                    <h4>Attendees ({selectedEvent.attendees.length})</h4>
                    <div className="attendee-avatars">
                      {selectedEvent.attendees.map(attendee => (
                        <img 
                          key={attendee._id}
                          src={attendee.user.avatar || '/default-avatar.png'}
                          alt={attendee.user.name}
                          title={attendee.user.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="list-view">
              {events.length === 0 ? (
                <div className="empty-state">
                  <p>No events found</p>
                  <button onClick={() => navigate('/events/create')}>
                    Create an Event
                  </button>
                </div>
              ) : (
                events.map(event => (
                  <div key={event._id} className="event-card">
                    <div className="event-card-content">
                      <h3>{event.title}</h3>
                      <p className="event-time">
                        {new Date(event.date).toLocaleString()}
                      </p>
                      <p className="event-location">{event.location}</p>
                      <p className="event-description">{event.description}</p>
                    </div>
                    <div className="event-card-actions">
                      {user && (
                        <button
                          className={`rsvp-button ${isUserAttending(event) ? 'attending' : ''}`}
                          onClick={() => handleRSVP(event._id, 'attending')}
                        >
                          {isUserAttending(event) ? 'Cancel RSVP' : 'RSVP'}
                        </button>
                      )}
                      {canManageEvent(event) && (
                        <>
                          <button
                            className="edit-button"
                            onClick={() => navigate(`/events/${event._id}/edit`)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteEvent(event._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EventCalendar;
