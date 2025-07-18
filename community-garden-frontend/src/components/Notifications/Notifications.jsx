import React, { useEffect, useState } from 'react';
import API from '../../api';
import './Notifications.scss';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/notifications/my')
      .then(res => setNotifications(res.data.notifications))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="notifications">Loading...</div>;

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <div>No notifications found.</div>
      ) : (
        <ul>
          {notifications.map(n => (
            <li key={n._id} className={n.read ? 'read' : 'unread'}>
              <span>{n.message}</span>
              <span className="date">{new Date(n.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
