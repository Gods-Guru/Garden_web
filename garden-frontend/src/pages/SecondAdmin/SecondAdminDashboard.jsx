import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './SecondAdminDashboard.scss';

function SecondAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalGardens: 0,
    activeMembers: 0,
    pendingApprovals: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/second-admin/dashboard', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }
      
      setStats(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="second-admin-dashboard">
      <header className="dashboard-header">
        <h1>Second Admin Dashboard</h1>
        <p>Welcome back, {user?.name}</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Gardens</h3>
          <p className="stat-value">{stats.totalGardens}</p>
        </div>

        <div className="stat-card">
          <h3>Active Members</h3>
          <p className="stat-value">{stats.activeMembers}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <p className="stat-value">{stats.pendingApprovals}</p>
        </div>
      </div>

      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {stats.recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'garden_created' && '🌱'}
                {activity.type === 'member_joined' && '👤'}
                {activity.type === 'plot_assigned' && '🗺️'}
              </div>
              <div className="activity-content">
                <p>{activity.description}</p>
                <span className="activity-time">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => window.location.href = '/second-admin/gardens'}>
            Manage Gardens
          </button>
          <button onClick={() => window.location.href = '/second-admin/community'}>
            Community Management
          </button>
          <button onClick={() => window.location.href = '/second-admin/events'}>
            Event Calendar
          </button>
        </div>
      </section>
    </div>
  );
}

export default SecondAdminDashboard;
