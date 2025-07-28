import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/gardens', label: 'Gardens', icon: '🌿' },
    { path: '/admin/plots', label: 'Plots', icon: '🏡' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/applications', label: 'Applications', icon: '📝' },
    { path: '/admin/tasks', label: 'Tasks', icon: '✅' },
    { path: '/admin/calendar', label: 'Calendar', icon: '📅' },
    { path: '/admin/announcements', label: 'Announcements', icon: '📢' },
    { path: '/admin/media', label: 'Media', icon: '🖼️' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Garden Admin</h2>
        <button onClick={onToggle} className="toggle-btn">
          {isOpen ? '←' : '→'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
