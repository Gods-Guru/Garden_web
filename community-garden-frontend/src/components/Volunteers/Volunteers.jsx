import React, { useEffect, useState } from 'react';
import API from '../../api';
import './Volunteers.scss';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/volunteers')
      .then(res => setVolunteers(res.data.volunteers))
      .catch(() => setVolunteers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="volunteers">Loading...</div>;

  return (
    <div className="volunteers">
      <h2>Volunteers</h2>
      {volunteers.length === 0 ? (
        <div>No volunteers found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Hours</th>
              <th>Badges</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map(v => (
              <tr key={v._id}>
                <td>{v.user?.name || '-'}</td>
                <td>{v.hours}</td>
                <td>{v.badges && v.badges.length > 0 ? v.badges.join(', ') : '-'}</td>
                <td>{v.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Volunteers;
