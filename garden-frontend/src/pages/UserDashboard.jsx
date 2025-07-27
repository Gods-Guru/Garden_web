import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useGardenStore from '../store/useGardenStore';
import useNotificationStore from '../store/useNotificationStore';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GardenCard from '../components/gardens/GardenCard';
import TaskList from '../components/tasks/TaskList';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import './UserDashboard.scss';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const { gardens, loading: gardensLoading, fetchMyGardens } = useGardenStore();
  const { notifications, unreadCount, fetchNotifications } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMyGardens();
    fetchNotifications();
  }, [fetchMyGardens, fetchNotifications]);

  if (gardensLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  const ownedGardens = gardens.filter(g =>
    g.role === 'owner' || g.role === 'admin'
  );
  const memberGardens = gardens.filter(g =>
    g.role === 'member' || g.role === 'coordinator'
  );

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
              <span className="stat-number">{gardens.length}</span>
              <span className="stat-label">Gardens</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{ownedGardens.length}</span>
              <span className="stat-label">Owned</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{unreadCount}</span>
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
            className={`tab ${activeTab === 'gardens' ? 'active' : ''}`}
            onClick={() => setActiveTab('gardens')}
          >
            My Gardens
          </button>
          <button
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
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
                            key={garden.garden._id}
                            garden={garden.garden}
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
                  <TaskList limit={5} />
                </div>
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
                        key={garden.garden._id}
                        garden={garden.garden}
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
                        key={garden.garden._id}
                        garden={garden.garden}
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

          {activeTab === 'tasks' && (
            <div className="tasks-tab">
              <TaskList />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-tab">
              <RecentActivity expanded={true} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;