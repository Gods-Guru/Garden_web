import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import MyPlotsList from './MyPlotsList';
import TasksList from './TasksList';
import CropTracker from './CropTracker';
import './GardenerDashboard.scss';

const GardenerDashboard = ({ user, gardens }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myPlots: 0,
    currentCrops: 0,
    tasksAssigned: 0,
    plotHealthScore: 0,
    upcomingEvents: 0,
    harvestReady: 0
  });
  const [myPlots, setMyPlots] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [myCrops, setMyCrops] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGardenerStats();
    fetchMyPlots();
    fetchMyTasks();
    fetchMyCrops();
    fetchRecentActivity();
  }, []);

  const fetchGardenerStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch gardener statistics from backend
      const response = await fetch('/api/gardener/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gardener stats');
      }

      const data = await response.json();
      setStats({
        myPlots: data.myPlots || 0,
        currentCrops: data.currentCrops || 0,
        tasksAssigned: data.tasksAssigned || 0,
        plotHealthScore: data.plotHealthScore || 0,
        upcomingEvents: data.upcomingEvents || 0,
        harvestReady: data.harvestReady || 0
      });
    } catch (error) {
      console.error('Error fetching gardener stats:', error);
      // Fallback to default values on error
      setStats({
        myPlots: 0,
        currentCrops: 0,
        tasksAssigned: 0,
        plotHealthScore: 0,
        upcomingEvents: 0,
        harvestReady: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPlots = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch user's plots from backend
      const response = await fetch('/api/plots/my-plots', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch my plots');
      }

      const data = await response.json();
      setMyPlots(data.plots || []);
    } catch (error) {
      console.error('Error fetching my plots:', error);
      // Fallback to empty array on error
      setMyPlots([]);
    }
  };

  const fetchMyTasks = async () => {
    try {
      setMyTasks([
        { id: 1, title: 'Water tomatoes in Plot A-23', priority: 'high', dueDate: 'Today', status: 'pending' },
        { id: 2, title: 'Harvest lettuce in Plot B-15', priority: 'medium', dueDate: 'Tomorrow', status: 'pending' },
        { id: 3, title: 'Weed around carrots', priority: 'low', dueDate: 'This week', status: 'pending' },
        { id: 4, title: 'Apply fertilizer to Plot A-23', priority: 'medium', dueDate: 'Next week', status: 'pending' }
      ]);
    } catch (error) {
      console.error('Error fetching my tasks:', error);
    }
  };

  const fetchMyCrops = async () => {
    try {
      setMyCrops([
        { id: 1, name: 'Tomatoes', variety: 'Cherry', planted: '2 months ago', status: 'flowering', harvestDate: '2 weeks' },
        { id: 2, name: 'Lettuce', variety: 'Romaine', planted: '1 month ago', status: 'ready', harvestDate: 'Now' },
        { id: 3, name: 'Carrots', variety: 'Baby', planted: '3 months ago', status: 'growing', harvestDate: '1 month' },
        { id: 4, name: 'Basil', variety: 'Sweet', planted: '6 weeks ago', status: 'ready', harvestDate: 'Now' }
      ]);
    } catch (error) {
      console.error('Error fetching my crops:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      setRecentActivity([
        { id: 1, type: 'watering', message: 'Watered Plot A-23 tomatoes', time: '2 hours ago' },
        { id: 2, type: 'harvest', message: 'Harvested 2 lbs of lettuce from Plot B-15', time: '1 day ago' },
        { id: 3, type: 'planting', message: 'Planted new basil seedlings', time: '3 days ago' },
        { id: 4, type: 'task_completed', message: 'Completed weeding task in Plot A-23', time: '5 days ago' },
        { id: 5, type: 'event_joined', message: 'Joined "Composting Workshop" event', time: '1 week ago' }
      ]);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const quickActions = [
    {
      label: 'Update Crop Status',
      icon: '🌱',
      action: () => navigate('/my-plot/crops/update'),
      color: '#059669'
    },
    {
      label: 'Request Tool',
      icon: '🔧',
      action: () => navigate('/tools/request'),
      color: '#d97706'
    },
    {
      label: 'Join Event',
      icon: '📅',
      action: () => navigate('/events'),
      color: '#2563eb'
    },
    {
      label: 'Log Activity',
      icon: '📝',
      action: () => navigate('/activity-log/create'),
      color: '#7c2d12'
    }
  ];

  const dashboardCards = [
    {
      title: 'My Plots',
      value: stats.myPlots,
      icon: '🌿',
      color: '#059669',
      change: 'Active plots',
      link: '/my-plot'
    },
    {
      title: 'Current Crops',
      value: stats.currentCrops,
      icon: '🌱',
      color: '#d97706',
      change: 'Growing varieties',
      link: '/my-plot/crops'
    },
    {
      title: 'Tasks Assigned',
      value: stats.tasksAssigned,
      icon: '✅',
      color: '#2563eb',
      change: 'Pending completion',
      link: '/tasks/my-tasks'
    },
    {
      title: 'Plot Health',
      value: `${stats.plotHealthScore}%`,
      icon: '💚',
      color: '#059669',
      change: 'Overall score',
      link: '/my-plot/health'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: '📅',
      color: '#7c2d12',
      change: 'This month',
      link: '/events/my-events'
    },
    {
      title: 'Ready to Harvest',
      value: stats.harvestReady,
      icon: '🥕',
      color: '#dc2626',
      change: 'Crops ready',
      link: '/my-plot/harvest'
    }
  ];

  if (loading) {
    return (
      <div className="gardener-dashboard loading">
        <div className="loading-spinner">Loading gardener dashboard...</div>
      </div>
    );
  }

  return (
    <div className="gardener-dashboard">
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
        {/* My Plots Overview */}
        <div className="dashboard-section plots-section">
          <h3>My Plots</h3>
          <MyPlotsList plots={myPlots} />
          <Link to="/my-plot" className="view-all-link">
            View All Plots →
          </Link>
        </div>

        {/* My Tasks */}
        <div className="dashboard-section tasks-section">
          <h3>My Tasks</h3>
          <TasksList tasks={myTasks} showActions={true} />
          <Link to="/tasks/my-tasks" className="view-all-link">
            View All Tasks →
          </Link>
        </div>

        {/* Crop Tracker */}
        <div className="dashboard-section crops-section">
          <h3>Crop Tracker</h3>
          <CropTracker crops={myCrops} />
          <Link to="/my-plot/crops" className="view-all-link">
            Manage Crops →
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section activity-section">
          <h3>My Garden Activity</h3>
          <RecentActivity activities={recentActivity} />
          <Link to="/activity-log" className="view-all-link">
            View Full Log →
          </Link>
        </div>
      </div>

      {/* Request History */}
      <div className="dashboard-section requests-section">
        <h3>Request History</h3>
        <div className="requests-summary">
          <div className="request-stat">
            <span className="stat-icon">🔧</span>
            <span className="stat-text">3 Tool Requests</span>
            <span className="stat-status">2 Approved</span>
          </div>
          <div className="request-stat">
            <span className="stat-icon">🌱</span>
            <span className="stat-text">1 Plot Request</span>
            <span className="stat-status">Approved</span>
          </div>
          <div className="request-stat">
            <span className="stat-icon">💬</span>
            <span className="stat-text">2 Support Tickets</span>
            <span className="stat-status">Resolved</span>
          </div>
        </div>
        <Link to="/requests/history" className="view-all-link">
          View Request History →
        </Link>
      </div>
    </div>
  );
};

export default GardenerDashboard;
