import React from 'react';
import { useAuth } from '../../context/AuthContext';

function AdminSettings() {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <div>Access denied.</div>;
  return (
    <div className="admin-settings">
      <h2>Admin Settings</h2>
      <p>Settings management for the platform.</p>
      {/* Add settings controls here */}
    </div>
  );
}

export default AdminSettings;
