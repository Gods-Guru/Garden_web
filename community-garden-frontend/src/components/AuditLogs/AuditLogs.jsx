import React, { useEffect, useState } from 'react';
import API from '../../api';
import './AuditLogs.scss';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/audit-logs')
      .then(res => setLogs(res.data.logs))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="auditlogs">Loading...</div>;

  return (
    <div className="auditlogs">
      <h2>Audit Logs</h2>
      {logs.length === 0 ? (
        <div>No logs found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td>{log.user?.name || '-'}</td>
                <td>{log.action}</td>
                <td>{log.targetType || '-'} {log.targetId || ''}</td>
                <td>{log.details ? JSON.stringify(log.details) : '-'}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;
