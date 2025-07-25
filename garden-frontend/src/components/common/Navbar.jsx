import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useNotificationStore from '../../store/useNotificationStore';
import '../../styles/pagestyles/Navbar.scss';

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={isAuthenticated ? "/dashboard" : "/"}>
          <span role="img" aria-label="logo">🌱</span> Rooted
        </Link>
      </div>

      {isAuthenticated ? (
        // Authenticated navigation
        <>
          <ul className="navbar-links">
            <li><Link to="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
            <li><Link to="/gardens" className={pathname.startsWith('/gardens') ? 'active' : ''}>Gardens</Link></li>
            <li><Link to="/community" className={pathname === '/community' ? 'active' : ''}>Community</Link></li>
            <li><Link to="/media" className={pathname === '/media' ? 'active' : ''}>Media</Link></li>
            <li><Link to="/events" className={pathname === '/events' ? 'active' : ''}>Events</Link></li>
            {user?.role === 'admin' && (
              <li><Link to="/admin/dashboard" className={pathname.startsWith('/admin') ? 'active' : ''}>Admin</Link></li>
            )}
          </ul>

          <div className="navbar-user">
            {/* Notifications */}
            <Link to="/notifications" className="notification-btn">
              <span className="notification-icon">🔔</span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </Link>

            {/* User menu */}
            <div className="user-menu">
              <button
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} />
                  ) : (
                    <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
                  )}
                </div>
                <span className="user-name">{user?.name}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                    Profile
                  </Link>
                  <Link to="/settings" onClick={() => setShowUserMenu(false)}>
                    Settings
                  </Link>
                  <Link to="/gardens/create" onClick={() => setShowUserMenu(false)}>
                    Create Garden
                  </Link>
                  <hr />
                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        // Public navigation
        <>
          <ul className="navbar-links">
            <li><Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/gardens" className={pathname.startsWith('/gardens') ? 'active' : ''}>Gardens</Link></li>
            <li><Link to="/community" className={pathname === '/community' ? 'active' : ''}>Community</Link></li>
          </ul>

          <div className="navbar-auth">
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/register" className="auth-btn">Register</Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
