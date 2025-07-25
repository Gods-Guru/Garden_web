import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useGardenStore from '../../store/useGardenStore';
import useNotificationStore from '../../store/useNotificationStore';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// SVG Icons
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const GardenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const AuditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
);

const CreateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

function AdminDashboard() {
  const { user } = useAuthStore();
  const { gardens, loading: gardensLoading, fetchAllGardens } = useGardenStore();
  const { notifications, unreadCount, fetchNotifications } = useNotificationStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGardens: 0,
    activeGardens: 0,
    pendingApplications: 0,
    totalPlots: 0,
    activePlots: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Fetch admin statistics
      await Promise.all([
        fetchAllGardens(),
        fetchNotifications(),
        fetchAdminStats()
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // Set default stats if API fails
      setStats({
        totalUsers: 0,
        totalGardens: gardens.length,
        activeGardens: gardens.filter(g => g.status === 'active').length,
        pendingApplications: 0,
        totalPlots: 0,
        activePlots: 0
      });
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="access-denied">
        <Navbar />
        <div className="container">
          <h1>Access Denied</h1>
          <p>You don't have permission to access the admin dashboard.</p>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (loading || gardensLoading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-dashboard">
      <Navbar />

      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Manage the entire garden management system</p>
          </div>

          {unreadCount > 0 && (
            <div className="notification-badge">
              {unreadCount} new notifications
            </div>
          )}
        </header>

        {/* Statistics Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <UsersIcon />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <GardenIcon />
            </div>
            <div className="stat-content">
              <h3>{stats.totalGardens}</h3>
              <p>Total Gardens</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <AnalyticsIcon />
            </div>
            <div className="stat-content">
              <h3>{stats.activeGardens}</h3>
              <p>Active Gardens</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <AuditIcon />
            </div>
            <div className="stat-content">
              <h3>{stats.pendingApplications}</h3>
              <p>Pending Applications</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/create-garden" className="action-card">
              <CreateIcon />
              <h3>Create Garden</h3>
              <p>Add a new community garden</p>
            </Link>

            <Link to="/admin/users" className="action-card">
              <UsersIcon />
              <h3>Manage Users</h3>
              <p>View and manage user accounts</p>
            </Link>

            <Link to="/admin/gardens" className="action-card">
              <GardenIcon />
              <h3>Manage Gardens</h3>
              <p>Oversee all garden operations</p>
            </Link>

            <Link to="/admin/audit" className="action-card">
              <AuditIcon />
              <h3>Audit Logs</h3>
              <p>Review system activity</p>
            </Link>

            <Link to="/admin/settings" className="action-card">
              <SettingsIcon />
              <h3>System Settings</h3>
              <p>Configure system preferences</p>
            </Link>

            <Link to="/admin/analytics" className="action-card">
              <AnalyticsIcon />
              <h3>Analytics</h3>
              <p>View system analytics</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {gardens.slice(0, 5).map(garden => (
              <div key={garden._id} className="activity-item">
                <div className="activity-icon">🌱</div>
                <div className="activity-content">
                  <h4>{garden.name}</h4>
                  <p>Garden managed by {garden.owner?.name || 'Unknown'}</p>
                  <span className="activity-time">
                    {new Date(garden.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f8fafc;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-content h1 {
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .header-content p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        .notification-badge {
          background: #ef4444;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          background: #10b981;
          color: white;
          padding: 1rem;
          border-radius: 8px;
        }

        .stat-content h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .stat-content p {
          color: #6b7280;
          margin: 0;
          font-size: 0.9rem;
        }

        .admin-actions {
          margin-bottom: 3rem;
        }

        .admin-actions h2 {
          color: #1f2937;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
          text-align: center;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .action-card svg {
          color: #10b981;
          margin-bottom: 1rem;
        }

        .action-card h3 {
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .action-card p {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0;
        }

        .recent-activity h2 {
          color: #1f2937;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .activity-list {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          font-size: 1.5rem;
        }

        .activity-content h4 {
          color: #1f2937;
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
        }

        .activity-content p {
          color: #6b7280;
          margin: 0;
          font-size: 0.9rem;
        }

        .activity-time {
          color: #9ca3af;
          font-size: 0.8rem;
        }

        .access-denied {
          min-height: 100vh;
          background: #f8fafc;
        }

        .access-denied .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 4rem 2rem;
          text-align: center;
        }

        .access-denied h1 {
          color: #ef4444;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .access-denied p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #10b981;
          color: white;
        }

        .btn-primary:hover {
          background: #059669;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
