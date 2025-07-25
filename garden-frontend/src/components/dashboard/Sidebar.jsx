import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiMapPin, FiUsers, FiCalendar, FiImage, FiBookOpen,
  FiSettings, FiUser, FiClipboard, FiDollarSign, FiShield,
  FiBarChart3, FiFileText, FiHelpCircle, FiLogOut
} from 'react-icons/fi';
import './Sidebar.scss';

const Sidebar = ({ isOpen, onClose, user, currentPath }) => {
  const navigate = useNavigate();

  const getNavigationItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        icon: FiHome,
        path: '/dashboard',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'Gardens',
        icon: FiMapPin,
        path: '/gardens',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'My Plots',
        icon: FiClipboard,
        path: '/plots',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'Tasks',
        icon: FiClipboard,
        path: '/tasks',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'Community',
        icon: FiUsers,
        path: '/community',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'Events',
        icon: FiCalendar,
        path: '/events',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'Media Gallery',
        icon: FiImage,
        path: '/media',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'Plant Guides',
        icon: FiBookOpen,
        path: '/guides',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'Payments',
        icon: FiDollarSign,
        path: '/payments',
        roles: ['user', 'garden_manager', 'admin']
      }
    ];

    const managerItems = [
      {
        label: 'Garden Management',
        icon: FiShield,
        path: '/manage',
        roles: ['garden_manager', 'admin']
      },
      {
        label: 'Applications',
        icon: FiFileText,
        path: '/applications',
        roles: ['garden_manager', 'admin']
      }
    ];

    const adminItems = [
      {
        label: 'Admin Panel',
        icon: FiShield,
        path: '/admin',
        roles: ['admin']
      },
      {
        label: 'Analytics',
        icon: FiBarChart3,
        path: '/analytics',
        roles: ['admin']
      },
      {
        label: 'System Settings',
        icon: FiSettings,
        path: '/admin/settings',
        roles: ['admin']
      }
    ];

    const bottomItems = [
      {
        label: 'Profile',
        icon: FiUser,
        path: '/profile',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'Settings',
        icon: FiSettings,
        path: '/settings',
        roles: ['user', 'garden_manager', 'admin']
      },
      {
        label: 'Help & Support',
        icon: FiHelpCircle,
        path: '/help',
        roles: ['user', 'garden_manager', 'admin']
      }
    ];

    // Filter items based on user role
    const userRole = user?.role || 'user';
    const filteredBase = baseItems.filter(item => item.roles.includes(userRole));
    const filteredManager = managerItems.filter(item => item.roles.includes(userRole));
    const filteredAdmin = adminItems.filter(item => item.roles.includes(userRole));
    const filteredBottom = bottomItems.filter(item => item.roles.includes(userRole));

    return {
      main: [...filteredBase, ...filteredManager, ...filteredAdmin],
      bottom: filteredBottom
    };
  };

  const { main: mainItems, bottom: bottomItems } = getNavigationItems();

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Logo and Brand */}
        <div className="sidebar-header">
          <Link to="/dashboard" className="brand-link" onClick={() => handleNavigation('/dashboard')}>
            <div className="brand-logo">
              <span className="logo-icon">🌱</span>
              <span className="brand-name">GreenSpace</span>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
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
            <h4 className="user-name">{user.name}</h4>
            <span className="user-role">
              {user.role === 'garden_manager' ? 'Garden Manager' : 
               user.role === 'admin' ? 'Administrator' : 'Gardener'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {mainItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="nav-item">
                  <button
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="sidebar-bottom">
          <ul className="nav-list">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="nav-item">
                  <button
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Close Button for Mobile */}
        <button className="sidebar-close" onClick={onClose}>
          <span>×</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
