import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMenu, FiBell, FiSearch, FiUser, FiSettings, 
  FiLogOut, FiChevronDown, FiSun, FiMoon 
} from 'react-icons/fi';
import './Header.scss';

const Header = ({ 
  user, 
  onToggleSidebar, 
  onToggleNotifications, 
  onLogout, 
  unreadCount 
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleUserMenuAction = (action) => {
    setUserMenuOpen(false);
    if (action === 'logout') {
      onLogout();
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        {/* Mobile Menu Toggle */}
        <button 
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FiMenu />
        </button>

        {/* Search Bar */}
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search gardens, plots, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </form>
      </div>

      <div className="header-right">
        {/* Dark Mode Toggle */}
        <button 
          className="icon-button theme-toggle"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        {/* Notifications */}
        <button 
          className="icon-button notification-button"
          onClick={onToggleNotifications}
          aria-label="View notifications"
        >
          <FiBell />
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="user-menu-wrapper">
          <button 
            className="user-menu-trigger"
            onClick={toggleUserMenu}
            aria-label="User menu"
          >
            <div className="user-avatar">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">
                {user.role === 'admin' ? 'Administrator' : 
                 user.role === 'garden_manager' ? 'Garden Manager' : 'Gardener'}
              </span>
            </div>
            <FiChevronDown className="dropdown-icon" />
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-avatar-large">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <span className="role-badge">
                    {user.role === 'admin' ? 'Administrator' : 
                     user.role === 'garden_manager' ? 'Garden Manager' : 'Gardener'}
                  </span>
                </div>
              </div>

              <div className="dropdown-menu">
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <FiUser className="item-icon" />
                  <span>My Profile</span>
                </Link>
                
                <Link 
                  to="/settings" 
                  className="dropdown-item"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <FiSettings className="item-icon" />
                  <span>Settings</span>
                </Link>

                <div className="dropdown-divider"></div>

                <button 
                  className="dropdown-item logout-item"
                  onClick={() => handleUserMenuAction('logout')}
                >
                  <FiLogOut className="item-icon" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div 
          className="dropdown-overlay"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
