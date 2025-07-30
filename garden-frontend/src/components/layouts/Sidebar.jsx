import { NavLink } from 'react-router-dom';
import {
  Home,
  Layout,
  Calendar,
  Users,
  Leaf,
  CheckSquare,
  Bell,
  Map,
  Settings,
  HelpCircle,
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import './Sidebar.scss';

const Sidebar = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole('admin');
  const isManager = hasRole('manager');

  const navigationItems = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: Home,
      show: true,
    },
    {
      name: 'Gardens',
      to: '/gardens',
      icon: Layout,
      show: true,
    },
    {
      name: 'Plots',
      to: '/plots',
      icon: Map,
      show: true,
    },
    {
      name: 'Events',
      to: '/events',
      icon: Calendar,
      show: true,
    },
    {
      name: 'Tasks',
      to: '/tasks',
      icon: CheckSquare,
      show: true,
    },
    {
      name: 'Members',
      to: '/members',
      icon: Users,
      show: isAdmin || isManager,
    },
    {
      name: 'Plant Guide',
      to: '/plant-guide',
      icon: Leaf,
      show: true,
    },
    {
      name: 'Notifications',
      to: '/notifications',
      icon: Bell,
      show: true,
    },
    {
      name: 'Settings',
      to: '/settings',
      icon: Settings,
      show: true,
    },
    {
      name: 'Help',
      to: '/help',
      icon: HelpCircle,
      show: true,
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-header">
          <img
            className="logo"
            src="/logo.svg"
            alt="Community Garden Manager"
          />
          <span className="logo-text">
            Garden Manager
          </span>
        </div>
        <nav className="sidebar-nav">
          {navigationItems
            .filter(item => item.show)
            .map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon className="nav-icon" />
                  <span className="nav-text">{item.name}</span>
                </NavLink>
              );
            })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
