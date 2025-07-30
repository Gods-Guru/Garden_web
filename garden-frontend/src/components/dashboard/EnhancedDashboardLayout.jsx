import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useNotificationStore from '../../store/useNotificationStore';
import WeatherWidget from './WeatherWidget';
import NotificationBell from './NotificationBell';
import SearchBar from './SearchBar';
import RoleSwitcher from './RoleSwitcher';
import './EnhancedDashboardLayout.scss';

const EnhancedDashboardLayout = ({ children, user, roles, activeRole }) => {
  const { logout } = useAuthStore();
  const { notifications, fetchNotifications } = useNotificationStore();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();
  }, [fetchNotifications]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#2563eb',
      manager: '#059669', 
      gardener: '#d97706',
      volunteer: '#7c2d12'
    };
    return colors[role] || '#059669';
  };

  const getNavigationLinks = () => {
    const baseLinks = [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠', roles: ['admin', 'manager', 'gardener', 'volunteer'] },
      { path: '/profile', label: 'My Profile', icon: '👤', roles: ['admin', 'manager', 'gardener', 'volunteer'] },
      { path: '/notifications', label: 'Notifications', icon: '🔔', roles: ['admin', 'manager', 'gardener', 'volunteer'] },
      { path: '/community', label: 'Community', icon: '💬', roles: ['admin', 'manager', 'gardener', 'volunteer'] },
    ];

    const roleSpecificLinks = [
      // Admin links
      { path: '/admin/users', label: 'Manage Users', icon: '👥', roles: ['admin'] },
      { path: '/admin/gardens', label: 'Admin Gardens', icon: '🌱', roles: ['admin'] },
      { path: '/admin/settings', label: 'Admin Settings', icon: '⚙️', roles: ['admin'] },
      { path: '/admin/audit-log', label: 'Audit Log', icon: '📋', roles: ['admin'] },

      // Manager & Admin links
      { path: '/gardens', label: 'Gardens', icon: '🌱', roles: ['admin', 'manager'] },
      { path: '/garden-management', label: 'Garden Management', icon: '🌿', roles: ['admin', 'manager'] },

      // All user links
      { path: '/plots', label: 'Plots', icon: '🌿', roles: ['admin', 'manager', 'gardener'] },
      { path: '/my-plot', label: 'My Plot', icon: '🏡', roles: ['gardener'] },
      { path: '/tasks', label: 'Tasks', icon: '✅', roles: ['admin', 'manager', 'gardener', 'volunteer'] },
      { path: '/events', label: 'Events', icon: '📅', roles: ['admin', 'manager', 'gardener', 'volunteer'] },
      { path: '/forum', label: 'Forum', icon: '💬', roles: ['admin', 'manager', 'gardener', 'volunteer'] },
      { path: '/media', label: 'Media Gallery', icon: '📸', roles: ['admin', 'manager', 'gardener', 'volunteer'] },
      { path: '/applications', label: 'Applications', icon: '📝', roles: ['admin', 'manager'] },
      { path: '/report-issue', label: 'Report Issue', icon: '🚨', roles: ['admin', 'manager', 'gardener', 'volunteer'] },

      // Settings
      { path: '/settings', label: 'Settings', icon: '⚙️', roles: ['admin', 'manager', 'gardener', 'volunteer'] },
    ];

    return [...baseLinks, ...roleSpecificLinks].filter(link =>
      link.roles.includes(activeRole || 'gardener')
    );
  };

  return (
    <div className="enhanced-dashboard-layout">
      {/* Navigation Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🌱</span>
            {!sidebarCollapsed && <span className="logo-text">Garden Manager</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {getNavigationLinks().map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="nav-link"
              title={sidebarCollapsed ? link.label : ''}
            >
              <span className="nav-icon">{link.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{link.label}</span>}
            </Link>
          ))}
        </nav>



        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={logout}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <span className="nav-icon">🚪</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="welcome-section">
              <h1 className="welcome-title">
                {getGreeting()}, {user?.name || 'User'}!
              </h1>
              <div className="user-role-badge" style={{ backgroundColor: getRoleColor(activeRole) }}>
                {activeRole?.charAt(0).toUpperCase() + activeRole?.slice(1)}
              </div>
            </div>
            <WeatherWidget />
          </div>

          <div className="header-right">
            <SearchBar />
            {roles && roles.length > 1 && (
              <RoleSwitcher 
                roles={roles} 
                activeRole={activeRole} 
                onRoleChange={(role) => window.location.reload()} 
              />
            )}
            <NotificationBell notifications={notifications} />
            <div className="user-avatar">
              <img 
                src={user?.avatar || '/default-avatar.png'} 
                alt={user?.name}
                className="avatar-image"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default EnhancedDashboardLayout;
