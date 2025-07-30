import React from 'react';
import { Link } from 'react-router-dom';
import './IssuesTable.scss';

const IssuesTable = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="issues-table empty">
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <p>No issues reported</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#dc2626',
      medium: '#d97706',
      low: '#059669'
    };
    return colors[priority] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#d97706',
      'in-progress': '#2563eb',
      resolved: '#059669'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="issues-table">
      <div className="issues-list">
        {issues.slice(0, 4).map((issue) => (
          <div key={issue.id} className="issue-item">
            <div className="issue-header">
              <h4>{issue.title}</h4>
              <div className="issue-badges">
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(issue.priority) }}
                >
                  {issue.priority}
                </span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status}
                </span>
              </div>
            </div>
            <div className="issue-details">
              <span className="issue-garden">🌱 {issue.garden}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssuesTable;
