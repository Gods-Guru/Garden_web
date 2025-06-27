// ActivityFeed Component
import React from 'react';
import { Droplets, Camera, CheckSquare, Award, BarChart3 } from 'lucide-react';

const ActivityFeed = () => {
  // Dummy data for recent activities
  const activities = [
    {
      id: 1,
      type: 'water',
      description: 'Logged watering for Plot A-01 (Tomatoes). Used 5L.',
      timestamp: '2 hours ago',
      icon: <Droplets size={20} className="text-blue-500" />
    },
    {
      id: 2,
      type: 'photo',
      description: 'Uploaded a new photo for Plot B-05 (Herb Haven progress).',
      timestamp: 'Yesterday',
      icon: <Camera size={20} className="text-purple-500" />
    },
    {
      id: 3,
      type: 'task',
      description: 'Completed task: Harvest ripe strawberries.',
      timestamp: 'Yesterday',
      icon: <CheckSquare size={20} className="text-green-500" />
    },
    {
      id: 4,
      type: 'harvest',
      description: 'Harvested 5 large tomatoes and 10 basil leaves from Plot A-01.',
      timestamp: '3 days ago',
      icon: <Award size={20} className="text-orange-500" />
    },
    {
      id: 5,
      type: 'note',
      description: 'Added a note to Plot A-01: "First tomato showing color!"',
      timestamp: '4 days ago',
      icon: <CheckSquare size={20} className="text-yellow-600" /> // Re-using CheckSquare, could be MessageSquare
    },
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
      <h2 className="text-2xl font-semibold text-primary-700 mb-6 flex items-center">
        <BarChart3 size={28} className="mr-2 text-primary-500" /> My Recent Activity
      </h2>

      {activities.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No recent activity to display.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map(activity => (
            <li key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-border last:border-b-0 last:pb-0">
              <div className="flex-shrink-0 mt-1 p-2 bg-background rounded-full border border-border">
                {activity.icon}
              </div>
              <div>
                <p className="text-sm text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {activities.length > 0 && (
        <div className="mt-6 text-center">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                View All Activity
            </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
