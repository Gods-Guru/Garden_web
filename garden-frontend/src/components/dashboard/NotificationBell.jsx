import React, { useState } from 'react';
import './NotificationBell.scss';

const NotificationBell = ({ notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-bell">
      <button 
        className="bell-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification, index) => (
                <div 
                  key={index} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <p>No notifications</p>
              </div>
            )}
          </div>
          
          <div className="notification-footer">
            <button className="view-all-btn">View All</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
