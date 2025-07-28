import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../store/useAuthStore';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed = ({ gardenId = null, limit = 10 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const url = gardenId 
          ? `/api/activities/garden/${gardenId}?limit=${limit}`
          : `/api/activities?limit=${limit}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }

        const data = await response.json();
        setActivities(data.activities);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [gardenId, limit, token]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'plot_created':
        return '🌱';
      case 'plot_assigned':
        return '📍';
      case 'plot_status_changed':
        return '🔄';
      case 'task_created':
        return '📝';
      case 'task_assigned':
        return '👤';
      case 'task_completed':
        return '✅';
      case 'garden_created':
        return '🏡';
      case 'garden_joined':
        return '🤝';
      case 'user_joined':
        return '👋';
      default:
        return '📌';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'plot_created':
      case 'garden_created':
        return 'bg-green-100 text-green-800';
      case 'task_completed':
        return 'bg-blue-100 text-blue-800';
      case 'plot_assigned':
      case 'task_assigned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading activities: {error}
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="flex items-start space-x-3 p-3 rounded-lg bg-white shadow-sm"
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.action)}`}>
              {getActivityIcon(activity.action)}
            </div>
            
            <div className="flex-grow min-w-0">
              <p className="text-sm text-gray-800">
                {activity.details?.message || activity.action.replace(/_/g, ' ')}
              </p>
              
              <div className="flex items-center space-x-2 mt-1">
                {activity.garden && (
                  <span className="text-xs text-gray-500">
                    {activity.garden.name}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No recent activities
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
