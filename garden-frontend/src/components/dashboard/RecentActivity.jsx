import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from '../common/LoadingSpinner';
import './RecentActivity.scss';

const RecentActivity = ({ expanded = false, limit = 5 }) => {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [limit]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/activities?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch activities');
      }

      setActivities(data.data.activities || []);
    } catch (err) {
      setError(err.message);
      // Mock data for development
      setActivities([
        {
          _id: '1',
          type: 'task_completed',
          message: 'You completed watering task in Sunny Garden',
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          garden: { name: 'Sunny Garden' }
        },
        {
          _id: '2',
          type: 'garden_joined',
          message: 'You joined Community Garden Downtown',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          garden: { name: 'Community Garden Downtown' }
        },
        {
          _id: '3',
          type: 'photo_uploaded',
          message: 'You uploaded a photo to Green Oasis',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          garden: { name: 'Green Oasis' }
        },
        {
          _id: '4',
          type: 'task_assigned',
          message: 'New task assigned: Plant tomatoes in plot 5',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          garden: { name: 'Sunny Garden' }
        },
        {
          _id: '5',
          type: 'garden_created',
          message: 'You created a new garden: My Home Garden',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          garden: { name: 'My Home Garden' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_completed':
        return '✅';
      case 'task_assigned':
        return '📋';
      case 'garden_joined':
        return '🌱';
      case 'garden_created':
        return '🏡';
      case 'photo_uploaded':
        return '📸';
      case 'member_joined':
        return '👋';
      case 'plot_assigned':
        return '🌿';
      case 'event_created':
        return '📅';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task_completed':
        return 'activity-success';
      case 'task_assigned':
        return 'activity-info';
      case 'garden_joined':
      case 'garden_created':
        return 'activity-primary';
      case 'photo_uploaded':
        return 'activity-purple';
      case 'member_joined':
        return 'activity-orange';
      case 'plot_assigned':
        return 'activity-green';
      case 'event_created':
        return 'activity-pink';
      default:
        return 'activity-gray';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  if (loading) {
    return <LoadingSpinner size="small" message="Loading activity..." />;
  }

  return (
    <div className={`recent-activity ${expanded ? 'expanded' : ''}`}>
      <div className="activity-header">
        <h3>Recent Activity</h3>
        {!expanded && activities.length > 0 && (
          <button className="view-all-btn">
            View All
          </button>
        )}
      </div>

      {error && !activities.length && (
        <div className="activity-error">
          <p>Unable to load recent activity</p>
        </div>
      )}

      {activities.length === 0 && !loading && !error ? (
        <div className="activity-empty">
          <p>No recent activity</p>
          <p className="activity-empty-subtitle">
            Your garden activities will appear here
          </p>
        </div>
      ) : (
        <div className="activity-list">
          {activities.map(activity => (
            <div key={activity._id} className="activity-item">
              <div className={`activity-icon ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="activity-content">
                <p className="activity-message">
                  {activity.message}
                </p>
                <div className="activity-meta">
                  <span className="activity-time">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                  {activity.garden && (
                    <span className="activity-garden">
                      {activity.garden.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
