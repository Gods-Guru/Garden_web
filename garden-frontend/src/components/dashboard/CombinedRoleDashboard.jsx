import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import EnhancedManagerDashboard from './EnhancedManagerDashboard';
import GardenerDashboard from './GardenerDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import './CombinedRoleDashboard.scss';

const CombinedRoleDashboard = ({ user, roles, activeRole, onRoleSwitch, gardens }) => {
  const [viewMode, setViewMode] = useState('unified'); // 'unified' or 'role-specific'

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

  const renderRoleSpecificDashboard = () => {
    switch (activeRole) {
      case 'admin':
        return <AdminDashboard user={user} gardens={gardens} />;
      case 'manager':
        return <EnhancedManagerDashboard user={user} gardens={gardens} />;
      case 'volunteer':
        return <VolunteerDashboard user={user} gardens={gardens} />;
      case 'gardener':
      default:
        return <GardenerDashboard user={user} gardens={gardens} />;
    }
  };

  const renderUnifiedDashboard = () => {
    return (
      <div className="unified-dashboard">
        {/* Combined Stats Overview */}
        <div className="combined-stats-section">
          <h3>Multi-Role Overview</h3>
          <div className="role-stats-grid">
            {roles.map((role) => (
              <div 
                key={role} 
                className="role-stat-card"
                style={{ borderLeftColor: getRoleColor(role) }}
              >
                <div className="role-header">
                  <span className="role-icon">{getRoleIcon(role)}</span>
                  <span className="role-name">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </div>
                <div className="role-quick-stats">
                  {role === 'admin' && (
                    <>
                      <div className="stat-item">
                        <span className="stat-value">23</span>
                        <span className="stat-label">Gardens</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">1,247</span>
                        <span className="stat-label">Users</span>
                      </div>
                    </>
                  )}
                  {role === 'manager' && (
                    <>
                      <div className="stat-item">
                        <span className="stat-value">3</span>
                        <span className="stat-label">Gardens</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">28</span>
                        <span className="stat-label">Volunteers</span>
                      </div>
                    </>
                  )}
                  {role === 'gardener' && (
                    <>
                      <div className="stat-item">
                        <span className="stat-value">2</span>
                        <span className="stat-label">Plots</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">8</span>
                        <span className="stat-label">Crops</span>
                      </div>
                    </>
                  )}
                  {role === 'volunteer' && (
                    <>
                      <div className="stat-item">
                        <span className="stat-value">45</span>
                        <span className="stat-label">Hours</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">6</span>
                        <span className="stat-label">Badges</span>
                      </div>
                    </>
                  )}
                </div>
                <button 
                  className="switch-role-btn"
                  onClick={() => onRoleSwitch(role)}
                  style={{ backgroundColor: getRoleColor(role) }}
                >
                  Switch to {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Unified Notifications */}
        <div className="unified-notifications-section">
          <h3>All Notifications</h3>
          <div className="notifications-by-role">
            <div className="notification-item admin">
              <span className="notification-icon">👑</span>
              <div className="notification-content">
                <p><strong>Admin:</strong> 3 new user registrations pending approval</p>
                <span className="notification-time">2 hours ago</span>
              </div>
            </div>
            <div className="notification-item manager">
              <span className="notification-icon">🧑‍🌾</span>
              <div className="notification-content">
                <p><strong>Manager:</strong> Plot request from Sarah Wilson needs review</p>
                <span className="notification-time">4 hours ago</span>
              </div>
            </div>
            <div className="notification-item gardener">
              <span className="notification-icon">🌱</span>
              <div className="notification-content">
                <p><strong>Gardener:</strong> Your tomatoes in Plot A-23 are ready for harvest</p>
                <span className="notification-time">1 day ago</span>
              </div>
            </div>
            <div className="notification-item volunteer">
              <span className="notification-icon">🤝</span>
              <div className="notification-content">
                <p><strong>Volunteer:</strong> New composting workshop available to join</p>
                <span className="notification-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions for All Roles */}
        <div className="unified-actions-section">
          <h3>Quick Actions (All Roles)</h3>
          <div className="unified-actions-grid">
            {roles.includes('admin') && (
              <div className="action-group admin">
                <h4>Admin Actions</h4>
                <button className="action-btn admin">Manage Users</button>
                <button className="action-btn admin">View Reports</button>
              </div>
            )}
            {roles.includes('manager') && (
              <div className="action-group manager">
                <h4>Manager Actions</h4>
                <button className="action-btn manager">Create Task</button>
                <button className="action-btn manager">Approve Requests</button>
              </div>
            )}
            {roles.includes('gardener') && (
              <div className="action-group gardener">
                <h4>Gardener Actions</h4>
                <button className="action-btn gardener">Update Crops</button>
                <button className="action-btn gardener">Log Activity</button>
              </div>
            )}
            {roles.includes('volunteer') && (
              <div className="action-group volunteer">
                <h4>Volunteer Actions</h4>
                <button className="action-btn volunteer">Join Event</button>
                <button className="action-btn volunteer">Complete Task</button>
              </div>
            )}
          </div>
        </div>

        {/* Combined Calendar/Schedule */}
        <div className="unified-schedule-section">
          <h3>Unified Schedule</h3>
          <div className="schedule-overview">
            <div className="schedule-item">
              <span className="schedule-time">Today 2:00 PM</span>
              <span className="schedule-event">Manager: Review plot applications</span>
              <span className="schedule-role manager">Manager</span>
            </div>
            <div className="schedule-item">
              <span className="schedule-time">Tomorrow 10:00 AM</span>
              <span className="schedule-event">Volunteer: Community composting workshop</span>
              <span className="schedule-role volunteer">Volunteer</span>
            </div>
            <div className="schedule-item">
              <span className="schedule-time">Feb 20 9:00 AM</span>
              <span className="schedule-event">Gardener: Water tomatoes in Plot A-23</span>
              <span className="schedule-role gardener">Gardener</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="combined-role-dashboard">
      {/* View Mode Toggle */}
      <div className="dashboard-controls">
        <div className="view-mode-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'unified' ? 'active' : ''}`}
            onClick={() => setViewMode('unified')}
          >
            📊 Unified View
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'role-specific' ? 'active' : ''}`}
            onClick={() => setViewMode('role-specific')}
          >
            🎭 Role-Specific View
          </button>
        </div>

        {viewMode === 'role-specific' && (
          <div className="role-selector">
            <span className="selector-label">Active Role:</span>
            {roles.map((role) => (
              <button
                key={role}
                className={`role-btn ${role === activeRole ? 'active' : ''}`}
                onClick={() => onRoleSwitch(role)}
                style={{ 
                  backgroundColor: role === activeRole ? getRoleColor(role) : 'transparent',
                  color: role === activeRole ? 'white' : getRoleColor(role),
                  borderColor: getRoleColor(role)
                }}
              >
                {getRoleIcon(role)} {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {viewMode === 'unified' ? renderUnifiedDashboard() : renderRoleSpecificDashboard()}
      </div>
    </div>
  );
};

export default CombinedRoleDashboard;
