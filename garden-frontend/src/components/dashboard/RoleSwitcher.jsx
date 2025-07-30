import React, { useState } from 'react';
import './RoleSwitcher.scss';

const RoleSwitcher = ({ roles, activeRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getRoleColor = (role) => {
    const colors = {
      admin: '#2563eb',
      manager: '#059669',
      gardener: '#d97706',
      volunteer: '#7c2d12'
    };
    return colors[role] || '#6b7280';
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: '👑',
      manager: '🧑‍🌾',
      gardener: '🌱',
      volunteer: '🤝'
    };
    return icons[role] || '👤';
  };

  if (!roles || roles.length <= 1) {
    return null;
  }

  return (
    <div className="role-switcher">
      <button 
        className="role-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: getRoleColor(activeRole) }}
      >
        <span className="role-icon">{getRoleIcon(activeRole)}</span>
        <span className="role-name">
          {activeRole?.charAt(0).toUpperCase() + activeRole?.slice(1)}
        </span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="role-dropdown">
          {roles.map((role) => (
            <button
              key={role}
              className={`role-option ${role === activeRole ? 'active' : ''}`}
              onClick={() => {
                onRoleChange(role);
                setIsOpen(false);
              }}
              style={{ 
                backgroundColor: role === activeRole ? getRoleColor(role) : 'transparent',
                color: role === activeRole ? 'white' : getRoleColor(role)
              }}
            >
              <span className="role-icon">{getRoleIcon(role)}</span>
              <span className="role-name">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
