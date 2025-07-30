import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import GardensList from './GardensList';
import VolunteerActivity from './VolunteerActivity';
import IssuesTable from './IssuesTable';
import './ManagerDashboard.scss';

const EnhancedManagerDashboard = ({ user, gardens }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    gardensManaged: 0,
    plotsAllocated: 0,
    taskCompletionRate: 0,
    eventsManaged: 0,
    volunteerCount: 0,
    pendingRequests: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagerStats();
    fetchRecentActivity();
    fetchVolunteers();
    fetchIssues();
  }, []);

  const fetchManagerStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch manager statistics from backend
      const response = await fetch('/api/manager/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch manager stats');
      }

      const data = await response.json();
      setStats({
        gardensManaged: data.gardensManaged || gardens?.length || 0,
        plotsAllocated: data.plotsAllocated || 0,
        taskCompletionRate: data.taskCompletionRate || 0,
        eventsManaged: data.eventsManaged || 0,
        volunteerCount: data.volunteerCount || 0,
        pendingRequests: data.pendingRequests || 0
      });
    } catch (error) {
      console.error('Error fetching manager stats:', error);
      // Fallback to default values on error
      setStats({
        gardensManaged: gardens?.length || 0,
        plotsAllocated: 0,
        taskCompletionRate: 0,
        eventsManaged: 0,
        volunteerCount: 0,
        pendingRequests: 0
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

      // Fetch manager activity from backend
      const response = await fetch('/api/manager/activity?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch manager activity');
      }

      const data = await response.json();
      setRecentActivity(data.activities || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      // Fallback to empty array on error
      setRecentActivity([]);
    }
  };

  const fetchVolunteers = async () => {
    try {
      setVolunteers([
        { id: 1, name: 'Alice Cooper', tasksCompleted: 15, hoursVolunteered: 32, status: 'active' },
        { id: 2, name: 'Bob Martinez', tasksCompleted: 12, hoursVolunteered: 28, status: 'active' },
        { id: 3, name: 'Carol Davis', tasksCompleted: 8, hoursVolunteered: 18, status: 'inactive' },
        { id: 4, name: 'David Wilson', tasksCompleted: 20, hoursVolunteered: 45, status: 'active' }
      ]);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  const fetchIssues = async () => {
    try {
      setIssues([
        { id: 1, title: 'Irrigation system malfunction', garden: 'Sunset Garden', priority: 'high', status: 'pending' },
        { id: 2, title: 'Tool shed lock broken', garden: 'Community Garden', priority: 'medium', status: 'in-progress' },
        { id: 3, title: 'Plot boundary dispute', garden: 'Green Valley', priority: 'low', status: 'pending' },
        { id: 4, title: 'Pest control needed', garden: 'Sunset Garden', priority: 'high', status: 'pending' }
      ]);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const quickActions = [
    {
      label: 'Create Task',
      icon: '✅',
      action: () => navigate('/tasks/create'),
      color: '#059669'
    },
    {
      label: 'Approve Booking',
      icon: '✔️',
      action: () => navigate('/bookings/pending'),
      color: '#2563eb'
    },
    {
      label: 'Message Volunteers',
      icon: '💬',
      action: () => navigate('/messages/compose?to=volunteers'),
      color: '#7c2d12'
    },
    {
      label: 'Schedule Event',
      icon: '📅',
      action: () => navigate('/events/create'),
      color: '#dc2626'
    }
  ];

  const dashboardCards = [
    {
      title: 'Gardens Managed',
      value: stats.gardensManaged,
      icon: '🌱',
      color: '#059669',
      change: 'Under your management',
      link: '/gardens/my-gardens'
    },
    {
      title: 'Plot Allocation',
      value: `${stats.plotsAllocated}%`,
      icon: '🌿',
      color: '#d97706',
      change: '+5% this month',
      link: '/plots'
    },
    {
      title: 'Task Completion',
      value: `${stats.taskCompletionRate}%`,
      icon: '✅',
      color: '#2563eb',
      change: '+3% this week',
      link: '/tasks'
    },
    {
      title: 'Events Managed',
      value: stats.eventsManaged,
      icon: '📅',
      color: '#7c2d12',
      change: 'This quarter',
      link: '/events'
    },
    {
      title: 'Active Volunteers',
      value: stats.volunteerCount,
      icon: '👥',
      color: '#059669',
      change: '+4 this month',
      link: '/volunteers'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: '📝',
      color: '#dc2626',
      change: 'Need attention',
      link: '/requests/pending'
    }
  ];

  if (loading) {
    return (
      <div className="manager-dashboard loading">
        <div className="loading-spinner">Loading manager dashboard...</div>
      </div>
    );
  }

  return (
    <div className="enhanced-manager-dashboard">
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
        {/* Assigned Gardens */}
        <div className="dashboard-section gardens-section">
          <h3>My Gardens</h3>
          <GardensList gardens={gardens} showManagementActions={true} />
          <Link to="/gardens" className="view-all-link">
            View All Gardens →
          </Link>
        </div>

        {/* Volunteer Activity */}
        <div className="dashboard-section volunteers-section">
          <h3>Volunteer Activity</h3>
          <VolunteerActivity volunteers={volunteers} />
          <Link to="/volunteers" className="view-all-link">
            Manage Volunteers →
          </Link>
        </div>

        {/* Issues & Requests */}
        <div className="dashboard-section issues-section">
          <h3>Issues & Requests</h3>
          <IssuesTable issues={issues} />
          <Link to="/complaints-requests" className="view-all-link">
            View All Issues →
          </Link>
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
    </div>
  );
};

export default EnhancedManagerDashboard;
