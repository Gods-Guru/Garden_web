import { useState } from 'react';
import { Bell, User, Settings, Search, Menu } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import NotificationsDropdown from './NotificationsDropdown';
import UserMenu from './UserMenu';
import './Navbar.scss';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Left side */}
          <div className="navbar-left">
            <button className="menu-toggle">
              <Menu className="menu-icon" />
            </button>
            <div className="search-wrapper">
              <SearchBar />
            </div>
          </div>

          {/* Right side */}
          <div className="navbar-right">
            {/* Notifications */}
            <div className="notifications-menu">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="notification-btn"
              >
                <Bell className="notification-icon" />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationsDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Settings */}
            <button className="settings-btn">
              <Settings className="settings-icon" />
            </button>

            {/* User menu */}
            <div className="user-menu">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="user-menu-trigger"
              >
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="avatar-image"
                    />
                  ) : (
                    <User className="avatar-placeholder" />
                  )}
                </div>
                <span className="user-name">
                  {user?.name}
                </span>
              </button>
              {showUserMenu && <UserMenu onClose={() => setShowUserMenu(false)} />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const SearchBar = () => {
  return (
    <div className="search-bar">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="search-input-wrapper">
        <div className="search-icon-wrapper">
          <Search className="search-icon" />
        </div>
        <input
          id="search"
          className="search-input"
          placeholder="Search gardens, tasks, events..."
          type="search"
        />
      </div>
    </div>
  );
};

export default Navbar;
