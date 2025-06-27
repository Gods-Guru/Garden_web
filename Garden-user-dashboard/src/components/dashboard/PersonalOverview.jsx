// PersonalOverview Component
import React from 'react';
import { MapPin, ListChecks, Sprout, CloudSun, CalendarCheck2 } from 'lucide-react';

const PersonalOverview = () => {
  const userName = "Alex GreenThumb"; // Dummy user name

  // Dummy data for quick stats
  const stats = [
    { id: 1, label: "My Plots", value: "2", icon: <MapPin size={24} className="text-primary-500" /> },
    { id: 2, label: "Pending Tasks", value: "5", icon: <ListChecks size={24} className="text-yellow-500" /> },
    { id: 3, label: "Plants Growing", value: "8", icon: <Sprout size={24} className="text-green-500" /> },
  ];

  // Dummy weather information
  const weather = {
    condition: "Sunny",
    temperature: "22°C",
    icon: <CloudSun size={32} className="text-orange-400" />,
    recommendation: "Perfect for watering and light pruning."
  };

  // Dummy recommended activities
  const recommendedActivities = [
    "Water your tomatoes in Plot A-01.",
    "Check for aphids on your roses.",
    "Consider mulching pathways if not done yet."
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
      {/* Welcome Message */}
      <h2 className="text-2xl font-semibold text-primary-700 mb-4">
        Welcome back, {userName}!
      </h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.id} className="bg-background p-4 rounded-md shadow-sm flex items-center space-x-3 border border-border">
            <div className="flex-shrink-0">{stat.icon}</div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weather & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Weather Section */}
        <div className="bg-background p-4 rounded-md shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
            {weather.icon}
            <span className="ml-2">Current Weather</span>
          </h3>
          <p className="text-foreground">
            {weather.temperature}, {weather.condition}.
          </p>
          <p className="text-sm text-muted-foreground mt-1">{weather.recommendation}</p>
        </div>

        {/* Today's Recommended Activities Section */}
        <div className="bg-background p-4 rounded-md shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
            <CalendarCheck2 size={24} className="text-blue-500 mr-2" />
            <span>Today's Focus</span>
          </h3>
          {recommendedActivities.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {recommendedActivities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific recommendations for today. Enjoy your garden!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalOverview;
