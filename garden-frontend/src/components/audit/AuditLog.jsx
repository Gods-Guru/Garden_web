import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuditLog.scss';

function AuditLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const res = await fetch(`/api/audit-logs?${queryParams}`, {
        credentials: 'include'
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to fetch audit logs');
      setLogs(data.logs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!user?.isAdmin) {
    return <div className="unauthorized">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="audit-log">
      <h2>Audit Log</h2>
      
      <div className="filters">
        <input
          type="text"
          name="action"
          placeholder="Filter by action"
          value={filters.action}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="user"
          placeholder="Filter by user"
          value={filters.user}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
        />
      </div>

      {loading ? (
        <div className="loading">Loading audit logs...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : logs.length === 0 ? (
        <div className="empty">No audit logs found</div>
      ) : (
        <table className="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td>{formatDate(log.timestamp)}</td>
                <td>{log.user.email}</td>
                <td>{log.action}</td>
                <td>{log.details}</td>
                <td>{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AuditLog;
