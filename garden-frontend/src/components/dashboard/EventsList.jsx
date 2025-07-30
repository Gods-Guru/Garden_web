import React from 'react';
import { Link } from 'react-router-dom';
import './EventsList.scss';

const EventsList = ({ events, showStatus = false }) => {
  if (!events || events.length === 0) {
    return (
      <div className="events-list empty">
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          <p>No events found</p>
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const getEventTypeColor = (type) => {
    const colors = {
      workshop: '#2563eb',
      volunteer: '#059669',
      maintenance: '#d97706',
      social: '#7c2d12',
      educational: '#059669'
    };
    return colors[type] || '#6b7280';
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      workshop: '🛠️',
      volunteer: '🤝',
      maintenance: '🔧',
      social: '🎉',
      educational: '📚'
    };
    return icons[type] || '📅';
  };

  const getStatusColor = (status) => {
    const colors = {
      registered: '#059669',
      completed: '#6b7280',
      cancelled: '#dc2626',
      pending: '#d97706'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="events-list">
      {events.slice(0, 3).map((event) => (
        <div key={event.id} className="event-item">
          <div className="event-date">
            <div className="date-display">
              <span className="month">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="day">
                {new Date(event.date).getDate()}
              </span>
            </div>
          </div>
          
          <div className="event-content">
            <div className="event-header">
              <h4 className="event-title">{event.title}</h4>
              <div className="event-badges">
                <span 
                  className="type-badge"
                  style={{ backgroundColor: getEventTypeColor(event.type) }}
                >
                  {getEventTypeIcon(event.type)} {event.type}
                </span>
                {showStatus && event.status && (
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(event.status) }}
                  >
                    {event.status}
                  </span>
                )}
              </div>
            </div>
            
            <div className="event-details">
              <div className="detail-item">
                <span className="detail-icon">⏰</span>
                <span className="detail-text">{event.time}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{event.location}</span>
              </div>
            </div>
          </div>
          
          <div className="event-actions">
            {isUpcoming(event.date) ? (
              <>
                {event.status === 'registered' ? (
                  <button className="btn btn-outline btn-sm">
                    Registered ✓
                  </button>
                ) : (
                  <Link 
                    to={`/events/${event.id}/register`}
                    className="btn btn-primary btn-sm"
                  >
                    Register
                  </Link>
                )}
                <Link 
                  to={`/events/${event.id}`}
                  className="btn btn-outline btn-sm"
                >
                  Details
                </Link>
              </>
            ) : (
              <>
                <span className="event-completed">Completed</span>
                <Link 
                  to={`/events/${event.id}`}
                  className="btn btn-outline btn-sm"
                >
                  View
                </Link>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
