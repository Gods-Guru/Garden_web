import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/users', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (!user || user.role !== 'admin') return <div>Access denied.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.name} ({u.email}) - {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagement;
