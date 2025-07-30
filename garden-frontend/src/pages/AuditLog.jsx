import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './AuditLog.scss';

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, user_actions, system_events, admin_actions
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage, filter, dateFilter]);

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = `/api/admin/audit-log?page=${currentPage}&limit=${itemsPerPage}`;
      if (filter !== 'all') {
        endpoint += `&type=${filter}`;
      }
      if (dateFilter !== 'all') {
        endpoint += `&period=${dateFilter}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }

      const data = await response.json();
      setAuditLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setError(error.message);
      // Fallback mock data for development
      setAuditLogs([
        {
          id: 1,
          action: 'user_login',
          description: 'User logged in successfully',
          userId: { name: 'John Doe', email: 'john@example.com' },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          severity: 'info'
        },
        {
          id: 2,
          action: 'plot_assigned',
          description: 'Plot A-23 assigned to Sarah Wilson',
          userId: { name: 'Admin User', email: 'admin@example.com' },
          metadata: { plotId: 'A-23', assignedTo: 'Sarah Wilson' },
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          severity: 'info'
        },
        {
          id: 3,
          action: 'failed_login',
          description: 'Failed login attempt',
          ipAddress: '192.168.1.200',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          severity: 'warning'
        },
        {
          id: 4,
          action: 'user_created',
          description: 'New user account created',
          userId: { name: 'Admin User', email: 'admin@example.com' },
          metadata: { newUserId: 'user123', newUserEmail: 'newuser@example.com' },
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          severity: 'info'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      user_login: '🔐',
      user_logout: '🚪',
      user_created: '👤',
      user_updated: '✏️',
      user_deleted: '🗑️',
      plot_assigned: '🌱',
      plot_unassigned: '📤',
      garden_created: '🏡',
      garden_updated: '🔧',
      task_created: '📋',
      task_completed: '✅',
      payment_processed: '💰',
      failed_login: '❌',
      system_error: '⚠️',
      admin_action: '👑'
    };
    return icons[action] || '📝';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: '#2563eb',
      warning: '#d97706',
      error: '#dc2626',
      success: '#059669'
    };
    return colors[severity] || '#6b7280';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const getFilteredLogs = () => {
    let filtered = auditLogs;
    
    if (filter !== 'all') {
      filtered = filtered.filter(log => {
        switch (filter) {
          case 'user_actions':
            return ['user_login', 'user_logout', 'user_created', 'user_updated'].includes(log.action);
          case 'system_events':
            return ['system_error', 'failed_login'].includes(log.action);
          case 'admin_actions':
            return ['garden_created', 'plot_assigned', 'user_created', 'admin_action'].includes(log.action);
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const getPaginatedLogs = () => {
    const filtered = getFilteredLogs();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filtered = getFilteredLogs();
    return Math.ceil(filtered.length / itemsPerPage);
  };

  if (loading) {
    return (
      <div className="audit-log-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading audit logs...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="audit-log-page">
      <Navbar />
      
      <div className="audit-log-container">
        <div className="audit-log-header">
          <h1>Audit Log</h1>
          <p>System activity and security monitoring</p>
        </div>

        <div className="audit-log-controls">
          <div className="filter-section">
            <div className="filter-group">
              <label>Activity Type:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Activities</option>
                <option value="user_actions">User Actions</option>
                <option value="system_events">System Events</option>
                <option value="admin_actions">Admin Actions</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Time Period:</label>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          <div className="log-stats">
            <span className="stat-item">
              Total Logs: {getFilteredLogs().length}
            </span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>Error loading audit logs: {error}</span>
          </div>
        )}

        <div className="audit-log-list">
          {getPaginatedLogs().length > 0 ? (
            getPaginatedLogs().map((log) => (
              <div key={log.id} className="audit-log-item">
                <div className="log-header">
                  <div className="log-icon-section">
                    <span className="log-icon">{getActionIcon(log.action)}</span>
                    <span 
                      className="severity-indicator"
                      style={{ backgroundColor: getSeverityColor(log.severity) }}
                    ></span>
                  </div>
                  
                  <div className="log-content">
                    <div className="log-action">
                      <span className="action-name">{log.action.replace('_', ' ')}</span>
                      <span className="log-time">{getTimeAgo(log.timestamp)}</span>
                    </div>
                    <div className="log-description">{log.description}</div>
                  </div>
                </div>

                <div className="log-details">
                  {log.userId && (
                    <div className="detail-item">
                      <span className="detail-label">User:</span>
                      <span className="detail-value">
                        {log.userId.name} ({log.userId.email})
                      </span>
                    </div>
                  )}
                  
                  {log.ipAddress && (
                    <div className="detail-item">
                      <span className="detail-label">IP Address:</span>
                      <span className="detail-value">{log.ipAddress}</span>
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <span className="detail-label">Timestamp:</span>
                    <span className="detail-value">
                      {log.timestamp.toLocaleString()}
                    </span>
                  </div>
                  
                  {log.metadata && (
                    <div className="detail-item">
                      <span className="detail-label">Additional Info:</span>
                      <span className="detail-value">
                        {JSON.stringify(log.metadata, null, 2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-audit-log">
              <span className="empty-icon">📋</span>
              <h3>No audit logs found</h3>
              <p>No activities match your current filters.</p>
            </div>
          )}
        </div>

        {getTotalPages() > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            
            <div className="pagination-info">
              Page {currentPage} of {getTotalPages()}
            </div>
            
            <button 
              className="pagination-btn"
              disabled={currentPage === getTotalPages()}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AuditLog;
