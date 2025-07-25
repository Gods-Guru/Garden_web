import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function AuditLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/audit', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch logs');
        setLogs(data.logs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (!user || user.role !== 'admin') return <div>Access denied.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="audit-log">
      <h2>Audit Log</h2>
      <ul>
        {logs.map(log => (
          <li key={log._id}>
            {log.action} by {log.user?.name || 'Unknown'} at {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuditLog;
