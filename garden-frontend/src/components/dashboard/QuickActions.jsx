import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import './QuickActions.scss';

const QuickActions = ({ actions: propActions }) => {
  const { user } = useAuthStore();

  // Use provided actions or default actions
  const defaultActions = [
    {
      title: 'Create Garden',
      description: 'Start a new community garden',
      icon: '🌱',
      link: '/gardens/create',
      color: 'green'
    },
    {
      title: 'Browse Gardens',
      description: 'Find gardens to join',
      icon: '🔍',
      link: '/gardens',
      color: 'blue'
    },
    {
      title: 'Upload Photos',
      description: 'Share your garden progress',
      icon: '📸',
      link: '/media/upload',
      color: 'purple'
    },
    {
      title: 'Community',
      description: 'Connect with other gardeners',
      icon: '👥',
      link: '/community',
      color: 'orange'
    },
    {
      title: 'Garden Guides',
      description: 'Learn gardening tips',
      icon: '📚',
      link: '/guides',
      color: 'teal'
    },
    {
      title: 'Events',
      description: 'View upcoming events',
      icon: '📅',
      link: '/events',
      color: 'pink'
    }
  ];

  // Add admin-specific actions to default actions
  if (user?.role === 'admin') {
    defaultActions.push(
      {
        title: 'Admin Panel',
        description: 'Manage system settings',
        icon: '⚙️',
        link: '/admin/dashboard',
        color: 'red'
      },
      {
        title: 'User Management',
        description: 'Manage users and roles',
        icon: '👤',
        link: '/admin/users',
        color: 'gray'
      }
    );
  }

  // Use provided actions or default actions
  const actions = propActions || defaultActions;

  return (
    <section className="quick-actions">
      <h2>Quick Actions</h2>
      <div className="actions-grid">
        {actions.map((action, index) => {
          // Handle different action formats
          if (action.action && typeof action.action === 'function') {
            // New format with action function
            return (
              <button
                key={index}
                className="action-card action-button"
                onClick={action.action}
                style={{ backgroundColor: action.color }}
              >
                <div className="action-icon">
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3>{action.label}</h3>
                </div>
              </button>
            );
          } else {
            // Original format with link
            return (
              <Link
                key={index}
                to={action.link}
                className={`action-card action-${action.color}`}
              >
                <div className="action-icon">
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">
                  →
                </div>
              </Link>
            );
          }
        })}
      </div>
    </section>
  );
};

export default QuickActions;
