import React from 'react';
import { useAuth } from '../context/AuthContext';

function SecondAdminDashboard() {
  const { user } = useAuth();
  if (!user || user.role !== 'second-admin') return <div>Access denied.</div>;
  return (
    <div className="second-admin-dashboard">
      <h1>Second-Level Admin Dashboard</h1>
      <ul>
        <li><a href="/second-admin/gardens">Manage Assigned Gardens</a></li>
        <li><a href="/second-admin/community">Moderate Community</a></li>
        <li><a href="/second-admin/events">Approve Events</a></li>
      </ul>
    </div>
  );
}

export default SecondAdminDashboard;
