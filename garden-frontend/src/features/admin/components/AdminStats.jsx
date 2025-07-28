import React from 'react';

const AdminStats = () => {
  const stats = [
    { label: 'Total Gardens', value: 24, trend: '+3', icon: '🌿' },
    { label: 'Active Plots', value: 156, trend: '+12', icon: '🏡' },
    { label: 'Active Users', value: 342, trend: '+28', icon: '👥' },
    { label: 'Pending Apps', value: 18, trend: '-5', icon: '📝' },
    { label: 'Open Tasks', value: 47, trend: '-8', icon: '✅' },
    { label: 'This Month Events', value: 12, trend: '+2', icon: '📅' }
  ];

  return (
    <div className="admin-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-info">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
            <span className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
