import React, { useState, useEffect } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar')) {
        setShowUserMenu(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowUserMenu(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to={isAuthenticated ? "/dashboard" : "/"}>
            <span role="img" aria-label="logo">🌱</span> Rooted
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            // Authenticated navigation
            <>
              <ul className="navbar-links">
                <li><Link to="/dashboard" className={pathname === '/dashboard' ? 'active' : ''} onClick={closeMobileMenu}>Dashboard</Link></li>
                <li><Link to="/gardens" className={pathname.startsWith('/gardens') ? 'active' : ''} onClick={closeMobileMenu}>Gardens</Link></li>
                <li><Link to="/community" className={pathname === '/community' ? 'active' : ''} onClick={closeMobileMenu}>Community</Link></li>
                <li><Link to="/media" className={pathname === '/media' ? 'active' : ''} onClick={closeMobileMenu}>Media</Link></li>
                <li><Link to="/events" className={pathname === '/events' ? 'active' : ''} onClick={closeMobileMenu}>Events</Link></li>
                {user?.role === 'admin' && (
                  <li><Link to="/admin/dashboard" className={pathname.startsWith('/admin') ? 'active' : ''} onClick={closeMobileMenu}>Admin</Link></li>
                )}
                {(user?.role === 'manager' || user?.role === 'admin') && (
                  <li><Link to="/manage" className={pathname.startsWith('/manage') ? 'active' : ''} onClick={closeMobileMenu}>Manage</Link></li>
                )}
              </ul>

              <div className="navbar-user">
                {/* Notifications */}
                <Link to="/notifications" className="notification-btn" onClick={closeMobileMenu}>
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
                      <div className="user-info">
                        <span className="user-email">{user?.email}</span>
                        <span className={`user-role role-${user?.role}`}>
                          {user?.role === 'admin' && '🛠️ Admin'}
                          {user?.role === 'manager' && '🧑‍🌾 Manager'}
                          {user?.role === 'user' && '👤 Gardener'}
                        </span>
                      </div>
                      <hr />
                      <Link to="/profile" onClick={() => { setShowUserMenu(false); closeMobileMenu(); }}>
                        👤 Profile
                      </Link>
                      <Link to="/settings" onClick={() => { setShowUserMenu(false); closeMobileMenu(); }}>
                        ⚙️ Settings
                      </Link>
                      <Link to="/gardens/create" onClick={() => { setShowUserMenu(false); closeMobileMenu(); }}>
                        ➕ Create Garden
                      </Link>
                      <hr />
                      <button onClick={handleLogout}>
                        🚪 Logout
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
                <li><Link to="/" className={pathname === '/' ? 'active' : ''} onClick={closeMobileMenu}>Home</Link></li>
                <li><Link to="/about" className={pathname === '/about' ? 'active' : ''} onClick={closeMobileMenu}>About</Link></li>
                <li><Link to="/gardens" className={pathname.startsWith('/gardens') ? 'active' : ''} onClick={closeMobileMenu}>Gardens</Link></li>
                <li><Link to="/community" className={pathname === '/community' ? 'active' : ''} onClick={closeMobileMenu}>Community</Link></li>
              </ul>

              <div className="navbar-auth">
                <Link to="/login" className="auth-link" onClick={closeMobileMenu}>Login</Link>
                <Link to="/register" className="auth-btn" onClick={closeMobileMenu}>Register</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
