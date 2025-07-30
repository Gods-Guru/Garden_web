import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import GardensList from './GardensList';
import VolunteerActivity from './VolunteerActivity';
import IssuesTable from './IssuesTable';
import './ManagerDashboard.scss';

const ManagerDashboard = ({ user, gardens }) => {
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
      // Mock data - replace with actual API calls
      setStats({
        gardensManaged: gardens?.length || 3,
        plotsAllocated: 45,
        taskCompletionRate: 87,
        eventsManaged: 12,
        volunteerCount: 28,
        pendingRequests: 7
      });
    } catch (error) {
      console.error('Error fetching manager stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const managedGardens = gardens.filter(g =>
    g.role === 'coordinator' || g.role === 'owner' || g.garden?.role === 'coordinator' || g.garden?.role === 'owner'
  );

  const managerStats = {
    managedGardens: managedGardens.length,
    pendingRequests: pendingRequests.length,
    activeMembers: 0, // TODO: Calculate from garden data
    upcomingEvents: 0 // TODO: Fetch from events
  };

  return (
    <div className="manager-dashboard">
      <Navbar />
      {/* Header with administrative theme */}
      <div className="dashboard-header manager-theme">
        <div className="header-content">
          <h1>🧑‍🌾 Manager Dashboard</h1>
          <p>Welcome back, {user?.name}! Manage your assigned gardens.</p>
        </div>
        <div className="manager-stats">
          <div className="stat-card">
            <span className="stat-icon">🏡</span>
            <span className="stat-number">{managerStats.managedGardens}</span>
            <span className="stat-label">Gardens</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-icon">⏳</span>
            <span className="stat-number">{managerStats.pendingRequests}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <span className="stat-number">{managerStats.activeMembers}</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <span className="stat-number">{managerStats.upcomingEvents}</span>
            <span className="stat-label">Events</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs manager-tabs">
        <button className="tab active">
          <span className="tab-icon">📊</span>
          Dashboard
        </button>
        <button className="tab">
          <span className="tab-icon">📋</span>
          Plot Requests
        </button>
        <button className="tab">
          <span className="tab-icon">📝</span>
          Garden Logs
        </button>
        <button className="tab">
          <span className="tab-icon">📅</span>
          Events
        </button>
        <button className="tab">
          <span className="tab-icon">💬</span>
          Messages
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-grid manager-grid">
          {/* Pending Requests */}
          <div className="content-card priority">
            <h3>⏳ Pending Plot Requests</h3>
            <div className="requests-list">
              {pendingRequests.length > 0 ? (
                pendingRequests.slice(0, 3).map((request, index) => (
                  <div key={index} className="request-item">
                    <div className="request-info">
                      <span className="requester-name">{request.userName}</span>
                      <span className="request-plot">Plot #{request.plotNumber}</span>
                    </div>
                    <div className="request-actions">
                      <button className="btn btn-success btn-sm">Approve</button>
                      <button className="btn btn-danger btn-sm">Reject</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No pending requests</p>
              )}
              <Link to="/manager/requests" className="view-all-link">
                View All Requests →
              </Link>
            </div>
          </div>

          {/* Managed Gardens */}
          <div className="content-card">
            <h3>🏡 My Gardens</h3>
            <div className="gardens-list">
              {managedGardens.map((garden, index) => (
                <div key={index} className="garden-item">
                  <div className="garden-info">
                    <h4>{garden.name}</h4>
                    <span className="garden-role">{garden.role}</span>
                  </div>
                  <Link 
                    to={`/gardens/${garden._id}/manage`} 
                    className="btn btn-primary btn-sm"
                  >
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="content-card">
            <h3>📊 Garden Activity</h3>
            <div className="activity-chart">
              <p>Activity monitoring coming soon...</p>
              {/* TODO: Add activity chart/graph */}
            </div>
          </div>

          {/* Quick Management Actions */}
          <div className="content-card">
            <h3>⚡ Quick Actions</h3>
            <div className="quick-actions manager-actions">
              <Link to="/manager/assign-plot" className="action-btn">
                <span className="action-icon">🌿</span>
                Assign Plot
              </Link>
              <Link to="/manager/create-event" className="action-btn">
                <span className="action-icon">📅</span>
                Create Event
              </Link>
              <Link to="/manager/send-message" className="action-btn">
                <span className="action-icon">💬</span>
                Send Message
              </Link>
              <Link to="/manager/reports" className="action-btn">
                <span className="action-icon">📊</span>
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManagerDashboard;
