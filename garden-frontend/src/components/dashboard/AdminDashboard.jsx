import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';
import StatsChart from './StatsChart';
import RecentActivity from './RecentActivity';
import './AdminDashboard.scss';

const AdminDashboard = ({ user, gardens }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGardens: 0,
    totalPlots: 0,
    revenue: 0,
    tasksCreated: 0,
    newRegistrations: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
    fetchRecentActivity();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch admin statistics from backend
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      const data = await response.json();
      setStats({
        totalUsers: data.totalUsers || 0,
        totalGardens: data.totalGardens || 0,
        totalPlots: data.totalPlots || 0,
        revenue: data.revenue || 0,
        tasksCreated: data.tasksCreated || 0,
        newRegistrations: data.newRegistrations || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Fallback to default values on error
      setStats({
        totalUsers: 0,
        totalGardens: 0,
        totalPlots: 0,
        revenue: 0,
        tasksCreated: 0,
        newRegistrations: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch recent activity from backend
      const response = await fetch('/api/admin/activity?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
      }

      const data = await response.json();
      setRecentActivity(data.activities || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      // Fallback to empty array on error
      setRecentActivity([]);
    }
  };

  const quickActions = [
    {
      label: 'Add New Garden',
      icon: '🌱',
      action: () => navigate('/gardens/create'),
      color: '#059669'
    },
    {
      label: 'Create Announcement',
      icon: '📢',
      action: () => navigate('/announcements/create'),
      color: '#2563eb'
    },
    {
      label: 'View Reports',
      icon: '📊',
      action: () => navigate('/reports'),
      color: '#7c2d12'
    },
    {
      label: 'Manage Users',
      icon: '👥',
      action: () => navigate('/users'),
      color: '#dc2626'
    }
  ];

  const dashboardCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: '👥',
      color: '#2563eb',
      change: '+12 this month',
      link: '/users'
    },
    {
      title: 'Total Gardens',
      value: stats.totalGardens,
      icon: '🌱',
      color: '#059669',
      change: '+2 this month',
      link: '/gardens'
    },
    {
      title: 'Total Plots',
      value: stats.totalPlots,
      icon: '🌿',
      color: '#d97706',
      change: '+23 this month',
      link: '/plots'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: '💰',
      color: '#059669',
      change: '+8.5% this month',
      link: '/reports/financial'
    },
    {
      title: 'Tasks Created',
      value: stats.tasksCreated,
      icon: '✅',
      color: '#7c2d12',
      change: '+15 this week',
      link: '/tasks'
    },
    {
      title: 'New Registrations',
      value: stats.newRegistrations,
      icon: '🆕',
      color: '#dc2626',
      change: 'This month',
      link: '/users?filter=new'
    }
  ];

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-spinner">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Stats Cards Grid */}
      <div className="dashboard-cards-grid">
        {dashboardCards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            change={card.change}
            link={card.link}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Main Content Grid */}
      <div className="dashboard-main-grid">
        {/* Charts Section */}
        <div className="dashboard-section charts-section">
          <h3>Analytics Overview</h3>
          <div className="charts-grid">
            <StatsChart 
              title="User Growth" 
              type="line" 
              data={[120, 135, 142, 156, 168, 175, 189, 201, 215, 228, 235, 247]}
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            />
            <StatsChart 
              title="Garden Usage" 
              type="bar" 
              data={[85, 92, 78, 95, 88, 91]}
              labels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']}
            />
            <StatsChart 
              title="Revenue Trend" 
              type="area" 
              data={[1200, 1350, 1180, 1420, 1380, 1540]}
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section activity-section">
          <h3>Recent Activity</h3>
          <RecentActivity activities={recentActivity} />
          <Link to="/activity-logs" className="view-all-link">
            View All Activity →
          </Link>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="dashboard-section quick-links-section">
        <h3>Quick Access</h3>
        <div className="quick-links-grid">
          <Link to="/users" className="quick-link">
            <span className="link-icon">👥</span>
            <span className="link-text">User Management</span>
          </Link>
          <Link to="/roles" className="quick-link">
            <span className="link-icon">🎭</span>
            <span className="link-text">Role Assignments</span>
          </Link>
          <Link to="/audit-logs" className="quick-link">
            <span className="link-icon">📋</span>
            <span className="link-text">Audit Logs</span>
          </Link>
          <Link to="/settings" className="quick-link">
            <span className="link-icon">⚙️</span>
            <span className="link-text">System Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
