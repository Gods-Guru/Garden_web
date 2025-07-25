import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const res = await fetch('/api/notifications', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch notifications');
        setNotifications(data.notifications || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
    
    // Set up WebSocket connection for real-time notifications
    const ws = new WebSocket(`ws://${window.location.host}/ws`);
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to mark notification as read');
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return null;
  
  return (
    <div className="notifications-panel">
      <h2>Notifications</h2>
      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="empty">No notifications</div>
      ) : (
        <ul className="notifications-list">
          {notifications.map(notification => (
            <li 
              key={notification._id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              {!notification.read && <div className="unread-indicator" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
