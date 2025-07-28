import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import './Notifications.scss';

const Notifications = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await fetchNotifications();
    } catch (err) {
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_assigned': return '📋';
      case 'task_completed': return '✅';
      case 'event_reminder': return '📅';
      case 'garden_invitation': return '🌱';
      case 'plot_assigned': return '🏡';
      case 'message': return '💬';
      case 'system_update': return '🔔';
      case 'weather_alert': return '🌦️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task_assigned': return 'notification-task';
      case 'task_completed': return 'notification-success';
      case 'event_reminder': return 'notification-event';
      case 'garden_invitation': return 'notification-garden';
      case 'plot_assigned': return 'notification-plot';
      case 'message': return 'notification-message';
      case 'system_update': return 'notification-system';
      case 'weather_alert': return 'notification-weather';
      default: return 'notification-default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="notifications-page">
      <Navbar />
      
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <div className="header-content">
            <h1>🔔 Notifications</h1>
            <p>Stay updated with your garden activities and community events</p>
          </div>
          
          <div className="header-actions">
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="btn btn-secondary"
              >
                Mark All as Read ({unreadCount})
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="notifications-controls">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Notifications
            </button>
            <button
              className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="notifications-content">
          {loading ? (
            <LoadingSpinner message="Loading notifications..." />
          ) : error ? (
            <div className="error-state">
              <h3>Unable to load notifications</h3>
              <p>{error}</p>
              <button onClick={loadNotifications} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <h3>No notifications found</h3>
              <p>
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : filter === 'read'
                  ? "No read notifications to display."
                  : "You don't have any notifications yet."
                }
              </p>
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-card ${!notification.read ? 'unread' : ''} ${getNotificationColor(notification.type)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <h3 className="notification-title">{notification.title}</h3>
                      <span className="notification-time">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    
                    <p className="notification-message">{notification.message}</p>
                    
                    {notification.actionUrl && (
                      <div className="notification-action">
                        <Link 
                          to={notification.actionUrl} 
                          className="action-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.actionText || 'View Details'}
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {!notification.read && (
                    <div className="notification-unread-indicator"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Modal */}
        {selectedNotification && (
          <div className="notification-modal" onClick={() => setSelectedNotification(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="modal-close"
                onClick={() => setSelectedNotification(null)}
              >
                ✕
              </button>
              
              <div className="modal-header">
                <div className="modal-icon">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div>
                  <h2>{selectedNotification.title}</h2>
                  <span className="modal-time">
                    {formatDate(selectedNotification.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="modal-body">
                <p>{selectedNotification.message}</p>
                
                {selectedNotification.details && (
                  <div className="notification-details">
                    <h4>Details:</h4>
                    <p>{selectedNotification.details}</p>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                {selectedNotification.actionUrl && (
                  <Link 
                    to={selectedNotification.actionUrl}
                    className="btn btn-primary"
                    onClick={() => setSelectedNotification(null)}
                  >
                    {selectedNotification.actionText || 'View Details'}
                  </Link>
                )}
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="notifications-quick-links">
          <h3>Quick Links</h3>
          <div className="quick-links-grid">
            <Link to="/dashboard" className="quick-link">
              🏠 Dashboard
            </Link>
            <Link to="/tasks" className="quick-link">
              📋 Tasks
            </Link>
            <Link to="/events" className="quick-link">
              📅 Events
            </Link>
            <Link to="/settings" className="quick-link">
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Notifications;
