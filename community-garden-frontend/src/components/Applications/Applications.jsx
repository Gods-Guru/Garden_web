import React, { useEffect, useState } from 'react';
import API from '../../api';
import './Applications.scss';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/applications/my')
      .then(res => setApplications(res.data.applications))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="applications">Loading...</div>;

  return (
    <div className="applications">
      <h2>My Plot Applications</h2>
      {applications.length === 0 ? (
        <div>No applications found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Garden</th>
              <th>Plot</th>
              <th>Status</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app.garden?.name || '-'}</td>
                <td>{app.plot?.number || '-'}</td>
                <td>{app.status}</td>
                <td>{app.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Applications;
