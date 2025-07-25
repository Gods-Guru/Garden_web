import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.scss';

function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSettings(data.settings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [key]: value })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user?.isAdmin) {
    return <div className="unauthorized">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''} 
          onClick={() => setActiveTab('settings')}
        >
          System Settings
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : activeTab === 'users' ? (
        <div className="users-management">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Gardens</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>
                    <select 
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="gardenAdmin">Garden Admin</option>
                      <option value="secondAdmin">Second Admin</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{user.gardens?.length || 0}</td>
                  <td>
                    <button onClick={() => {}}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="system-settings">
          <div className="setting-item">
            <label>Enable 2FA</label>
            <input
              type="checkbox"
              checked={settings.require2FA}
              onChange={(e) => updateSetting('require2FA', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Max Gardens Per User</label>
            <input
              type="number"
              value={settings.maxGardensPerUser}
              onChange={(e) => updateSetting('maxGardensPerUser', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label>Allow Public Registration</label>
            <input
              type="checkbox"
              checked={settings.allowPublicRegistration}
              onChange={(e) => updateSetting('allowPublicRegistration', e.target.checked)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
