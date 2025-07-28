import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/useAuthStore';
import './Events.scss';

const Events = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, my-events
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock events data
      const mockEvents = [
        {
          id: 1,
          title: 'Spring Planting Workshop',
          description: 'Learn the basics of spring planting and garden preparation.',
          date: '2024-03-15',
          time: '10:00 AM',
          location: 'Central Community Garden',
          organizer: 'Garden Club',
          attendees: 25,
          maxAttendees: 30,
          category: 'workshop',
          image: '/api/placeholder/400/200'
        },
        {
          id: 2,
          title: 'Harvest Festival',
          description: 'Celebrate the autumn harvest with the community.',
          date: '2024-10-20',
          time: '2:00 PM',
          location: 'Main Garden Plaza',
          organizer: 'Community Board',
          attendees: 150,
          maxAttendees: 200,
          category: 'festival',
          image: '/api/placeholder/400/200'
        },
        {
          id: 3,
          title: 'Composting 101',
          description: 'Learn how to create and maintain a compost system.',
          date: '2024-04-05',
          time: '9:00 AM',
          location: 'Education Center',
          organizer: 'Master Gardeners',
          attendees: 15,
          maxAttendees: 20,
          category: 'education',
          image: '/api/placeholder/400/200'
        }
      ];
      
      setEvents(mockEvents);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'upcoming') {
      return matchesSearch && new Date(event.date) >= new Date();
    }
    if (filter === 'past') {
      return matchesSearch && new Date(event.date) < new Date();
    }
    if (filter === 'my-events') {
      // This would check if user is attending - simplified for now
      return matchesSearch;
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventStatus = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    
    if (eventDate > today) return 'upcoming';
    if (eventDate.toDateString() === today.toDateString()) return 'today';
    return 'past';
  };

  return (
    <div className="events-page">
      <Navbar />
      
      <div className="events-container">
        {/* Header */}
        <div className="events-header">
          <div className="header-content">
            <h1>🎉 Community Events</h1>
            <p>Join workshops, festivals, and educational sessions in our garden community</p>
          </div>
          
          {isAuthenticated && (
            <div className="header-actions">
              <Link to="/events/create" className="btn btn-primary">
                Create Event
              </Link>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="events-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Events
            </button>
            <button
              className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
              onClick={() => setFilter('past')}
            >
              Past Events
            </button>
            {isAuthenticated && (
              <button
                className={`filter-tab ${filter === 'my-events' ? 'active' : ''}`}
                onClick={() => setFilter('my-events')}
              >
                My Events
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="events-content">
          {loading ? (
            <LoadingSpinner message="Loading events..." />
          ) : error ? (
            <div className="error-state">
              <h3>Unable to load events</h3>
              <p>{error}</p>
              <button onClick={fetchEvents} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              <h3>No events found</h3>
              <p>
                {searchTerm 
                  ? `No events match "${searchTerm}"`
                  : 'No events available for the selected filter'
                }
              </p>
              {isAuthenticated && (
                <Link to="/events/create" className="btn btn-primary">
                  Create the First Event
                </Link>
              )}
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <div className={`event-status ${getEventStatus(event.date)}`}>
                      {getEventStatus(event.date)}
                    </div>
                  </div>
                  
                  <div className="event-content">
                    <div className="event-category">{event.category}</div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    
                    <div className="event-details">
                      <div className="event-date">
                        📅 {formatDate(event.date)} at {event.time}
                      </div>
                      <div className="event-location">
                        📍 {event.location}
                      </div>
                      <div className="event-organizer">
                        👤 {event.organizer}
                      </div>
                      <div className="event-attendance">
                        👥 {event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>
                    
                    <div className="event-actions">
                      <Link to={`/events/${event.id}`} className="btn btn-secondary">
                        View Details
                      </Link>
                      {isAuthenticated && getEventStatus(event.date) === 'upcoming' && (
                        <button className="btn btn-primary">
                          Join Event
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="events-quick-links">
          <h3>Quick Links</h3>
          <div className="quick-links-grid">
            <Link to="/events/calendar" className="quick-link">
              📅 Event Calendar
            </Link>
            <Link to="/community" className="quick-link">
              👥 Community Forum
            </Link>
            <Link to="/gardens" className="quick-link">
              🌱 Find Gardens
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="quick-link">
                🏠 Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Events;
