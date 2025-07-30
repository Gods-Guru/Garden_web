import React from 'react';
import './ActivityFeed.scss';

const ActivityFeed = ({ activities, title = "Activity Feed" }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-feed empty">
        <h3>{title}</h3>
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <p>No recent activity</p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    const icons = {
      user_signup: '👤',
      plot_assigned: '🌿',
      payment: '💰',
      garden_created: '🌱',
      task_completed: '✅',
      task_assigned: '📋',
      plot_approved: '✔️',
      volunteer_joined: '👥',
      event_created: '📅',
      issue_resolved: '🔧'
    };
    return icons[type] || '📝';
  };

  const getActivityColor = (type) => {
    const colors = {
      user_signup: '#2563eb',
      plot_assigned: '#059669',
      payment: '#d97706',
      garden_created: '#059669',
      task_completed: '#059669',
      task_assigned: '#7c2d12',
      plot_approved: '#059669',
      volunteer_joined: '#2563eb',
      event_created: '#dc2626',
      issue_resolved: '#059669'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className="activity-feed">
      <h3>{title}</h3>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div 
              className="activity-icon"
              style={{ backgroundColor: getActivityColor(activity.type) }}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
