import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import QuickActions from '../components/dashboard/QuickActions';
import GardenCard from '../components/gardens/GardenCard'; // Add this import
import RecentActivity from '../components/dashboard/RecentActivity'; // Add this import
import './UserDashboard.scss';


const UserDashboard = () => {
  const { user, token } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch comprehensive dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
      // Set demo data as fallback
      setDashboardData({
        user: user,
        gardens: [],
        tasks: [],
        events: [],
        plots: [],
        notifications: [],
        stats: {
          totalGardens: 0,
          totalPlots: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          upcomingEvents: 0,
          unreadNotifications: 0
        },
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  // Task management functions
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error && !dashboardData) {
    return (
      <div className="user-dashboard">
        <Navbar />
        <div className="error-container">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const { gardens = [], tasks = [], events = [], plots = [], notifications = [], stats = {}, recentActivity = [] } = dashboardData || {};

  // Calculate owned and member gardens for display
  const ownedGardens = gardens.filter(g => g.role === 'owner' || g.role === 'admin');
  const memberGardens = gardens.filter(g => g.role === 'member' || g.role === 'coordinator');

  return (
    <div className="user-dashboard">
      <Navbar />

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Welcome back, {user?.name}! 🌱</h1>
            <p>Manage your gardens, track your progress, and connect with your community.</p>
          </div>

          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{stats.totalGardens || 0}</span>
              <span className="stat-label">Gardens</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.totalPlots || 0}</span>
              <span className="stat-label">Plots</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.pendingTasks || 0}</span>
              <span className="stat-label">Pending Tasks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.unreadNotifications || 0}</span>
              <span className="stat-label">Notifications</span>
            </div>
          </div>
        </header>

        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            My Tasks ({tasks.length})
          </button>
          <button
            className={`tab ${activeTab === 'gardens' ? 'active' : ''}`}
            onClick={() => setActiveTab('gardens')}
          >
            My Gardens ({gardens.length})
          </button>
          <button
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events ({events.length})
          </button>
          <button
            className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications ({notifications.length})
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="dashboard-grid">
                <div className="main-content">
                  <QuickActions />

                  <section className="dashboard-section">
                    <h2>Your Gardens</h2>
                    {gardens.length === 0 ? (
                      <div className="empty-state">
                        <p>You haven't joined any gardens yet.</p>
                        <Link to="/gardens/create" className="btn btn-primary">
                          Create Your First Garden
                        </Link>
                      </div>
                    ) : (
                      <div className="gardens-grid">
                        {gardens.slice(0, 4).map(garden => (
                          <GardenCard
                            key={garden._id}
                            garden={garden}
                            userRole={garden.role}
                          />
                        ))}
                      </div>
                    )}
                    {gardens.length > 4 && (
                      <Link to="/gardens" className="view-all-link">
                        View All Gardens →
                      </Link>
                    )}
                  </section>
                </div>

                <div className="sidebar">
                  <RecentActivity />
                  <div className="tasks-preview">
                    <h3>📋 Recent Tasks</h3>
                    <p>Task management coming soon...</p>
                    <Link to="/tasks" className="view-all-link">View All Tasks →</Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="tasks-tab">
              <div className="tasks-header">
                <h2>My Tasks</h2>
                <div className="task-filters">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Pending</button>
                  <button className="filter-btn">In Progress</button>
                  <button className="filter-btn">Completed</button>
                </div>
              </div>

              <div className="tasks-grid">
                {tasks.length === 0 ? (
                  <div className="empty-state">
                    <p>No tasks assigned yet.</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div key={task._id} className="task-card">
                      <div className="task-header">
                        <h3>{task.title}</h3>
                        <span className={`task-priority ${task.priority}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="task-description">{task.description}</p>
                      <div className="task-meta">
                        <span className="task-garden">🌱 {task.garden?.name}</span>
                        {task.plot && <span className="task-plot">📍 {task.plot.name}</span>}
                        <span className="task-due">
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="task-footer">
                        <span className={`task-status ${task.status}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        <div className="task-actions">
                          {task.status === 'pending' && (
                            <button
                              onClick={() => updateTaskStatus(task._id, 'in-progress')}
                              className="btn btn-sm btn-primary"
                            >
                              Start Task
                            </button>
                          )}
                          {task.status === 'in-progress' && (
                            <button
                              onClick={() => updateTaskStatus(task._id, 'completed')}
                              className="btn btn-sm btn-success"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'gardens' && (
            <div className="gardens-tab">
              {ownedGardens.length > 0 && (
                <section className="dashboard-section">
                  <h2>Gardens You Manage</h2>
                  <div className="gardens-grid">
                    {ownedGardens.map(garden => (
                      <GardenCard
                        key={garden._id}
                        garden={garden}
                        userRole={garden.role}
                        showManageButton={true}
                      />
                    ))}
                  </div>
                </section>
              )}

              {memberGardens.length > 0 && (
                <section className="dashboard-section">
                  <h2>Gardens You're Part Of</h2>
                  <div className="gardens-grid">
                    {memberGardens.map(garden => (
                      <GardenCard
                        key={garden._id}
                        garden={garden}
                        userRole={garden.role}
                      />
                    ))}
                  </div>
                </section>
              )}

              {gardens.length === 0 && (
                <div className="empty-state">
                  <h3>No Gardens Yet</h3>
                  <p>Start your gardening journey by creating or joining a garden.</p>
                  <div className="empty-actions">
                    <Link to="/gardens/create" className="btn btn-primary">
                      Create Garden
                    </Link>
                    <Link to="/gardens" className="btn btn-secondary">
                      Browse Gardens
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-tab">
              <h2>Upcoming Events</h2>
              <div className="events-grid">
                {events.length === 0 ? (
                  <div className="empty-state">
                    <p>No upcoming events.</p>
                  </div>
                ) : (
                  events.map(event => (
                    <div key={event._id} className="event-card">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      <div className="event-meta">
                        <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                        <span>🌱 {event.garden?.name}</span>
                      </div>
                      <Link to={`/events/${event._id}`} className="btn btn-primary">
                        View Event
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-tab">
              <h2>Notifications</h2>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <p>No notifications.</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div key={notification._id} className="notification-item">
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-time">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification._id)}
                          className="btn btn-sm btn-secondary"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;