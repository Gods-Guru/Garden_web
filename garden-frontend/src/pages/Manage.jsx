import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/useAuthStore';
import '../styles/pagestyles/Manage.scss';

const Manage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    fetchManagementData();
  }, []);

  const fetchManagementData = async () => {
    setLoading(true);
    
    try {
      // Simulate API calls - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock management stats
      const mockStats = {
        totalGardens: 5,
        totalMembers: 127,
        activeTasks: 23,
        pendingApplications: 8,
        upcomingEvents: 4,
        totalPlots: 85,
        occupiedPlots: 72,
        monthlyRevenue: 2450
      };
      
      // Mock recent activity
      const mockActivity = [
        {
          id: 1,
          type: 'member_joined',
          message: 'Sarah Johnson joined Central Garden',
          timestamp: '2024-03-20T10:30:00Z',
          garden: 'Central Garden'
        },
        {
          id: 2,
          type: 'task_completed',
          message: 'Watering task completed in Section A',
          timestamp: '2024-03-20T09:15:00Z',
          garden: 'East Side Garden'
        },
        {
          id: 3,
          type: 'plot_assigned',
          message: 'Plot B-12 assigned to Mike Chen',
          timestamp: '2024-03-19T16:45:00Z',
          garden: 'Herb Garden'
        }
      ];
      
      // Mock pending tasks
      const mockTasks = [
        {
          id: 1,
          title: 'Review plot application',
          description: 'Review application from Jane Smith for plot C-5',
          priority: 'high',
          dueDate: '2024-03-22',
          garden: 'Central Garden'
        },
        {
          id: 2,
          title: 'Approve event proposal',
          description: 'Spring planting workshop proposal needs approval',
          priority: 'medium',
          dueDate: '2024-03-25',
          garden: 'Education Center'
        }
      ];
      
      setStats(mockStats);
      setRecentActivity(mockActivity);
      setPendingTasks(mockTasks);
    } catch (err) {
      console.error('Failed to fetch management data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'member_joined': return '👤';
      case 'task_completed': return '✅';
      case 'plot_assigned': return '🏡';
      case 'event_created': return '📅';
      default: return '📢';
    }
  };

  if (!isAuthenticated || (user?.role !== 'manager' && user?.role !== 'admin')) {
    return (
      <div className="manage-page">
        <Navbar />
        <div className="unauthorized">
          <h2>Access Denied</h2>
          <p>You need manager or admin privileges to access this page.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="manage-page">
      <Navbar />
      
      <div className="manage-container">
        {/* Header */}
        <div className="manage-header">
          <div className="header-content">
            <h1>🛠️ Garden Management</h1>
            <p>Manage your gardens, members, and community activities</p>
          </div>
          
          <div className="header-actions">
            <Link to="/manage/gardens/create" className="btn btn-primary">
              Create Garden
            </Link>
            <Link to="/manage/events/create" className="btn btn-secondary">
              Create Event
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading management dashboard..." />
        ) : (
          <>
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🌱</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalGardens}</div>
                  <div className="stat-label">Gardens Managed</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalMembers}</div>
                  <div className="stat-label">Total Members</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.activeTasks}</div>
                  <div className="stat-label">Active Tasks</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.pendingApplications}</div>
                  <div className="stat-label">Pending Applications</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.upcomingEvents}</div>
                  <div className="stat-label">Upcoming Events</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏡</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.occupiedPlots}/{stats.totalPlots}</div>
                  <div className="stat-label">Plots Occupied</div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="manage-content">
              {/* Quick Actions */}
              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                  <Link to="/manage/members" className="action-card">
                    <div className="action-icon">👥</div>
                    <h3>Manage Members</h3>
                    <p>View and manage garden members</p>
                  </Link>
                  
                  <Link to="/manage/plots" className="action-card">
                    <div className="action-icon">🏡</div>
                    <h3>Manage Plots</h3>
                    <p>Assign and manage garden plots</p>
                  </Link>
                  
                  <Link to="/manage/tasks" className="action-card">
                    <div className="action-icon">📋</div>
                    <h3>Manage Tasks</h3>
                    <p>Create and assign garden tasks</p>
                  </Link>
                  
                  <Link to="/manage/events" className="action-card">
                    <div className="action-icon">📅</div>
                    <h3>Manage Events</h3>
                    <p>Organize community events</p>
                  </Link>
                  
                  <Link to="/manage/applications" className="action-card">
                    <div className="action-icon">📝</div>
                    <h3>Review Applications</h3>
                    <p>Process membership applications</p>
                  </Link>
                  
                  <Link to="/manage/reports" className="action-card">
                    <div className="action-icon">📊</div>
                    <h3>View Reports</h3>
                    <p>Garden analytics and reports</p>
                  </Link>
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="pending-tasks">
                <h2>Pending Tasks</h2>
                {pendingTasks.length === 0 ? (
                  <div className="empty-state">
                    <p>No pending management tasks</p>
                  </div>
                ) : (
                  <div className="tasks-list">
                    {pendingTasks.map(task => (
                      <div key={task.id} className="task-item">
                        <div className="task-content">
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                          <div className="task-meta">
                            <span className={`priority ${task.priority}`}>
                              {task.priority} priority
                            </span>
                            <span className="due-date">
                              Due: {formatDate(task.dueDate)}
                            </span>
                            <span className="garden">
                              {task.garden}
                            </span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button className="btn btn-primary btn-sm">
                            Handle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="recent-activity">
                <h2>Recent Activity</h2>
                {recentActivity.length === 0 ? (
                  <div className="empty-state">
                    <p>No recent activity</p>
                  </div>
                ) : (
                  <div className="activity-list">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="activity-content">
                          <p>{activity.message}</p>
                          <div className="activity-meta">
                            <span className="timestamp">
                              {formatDate(activity.timestamp)}
                            </span>
                            <span className="garden">
                              {activity.garden}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Manage;
