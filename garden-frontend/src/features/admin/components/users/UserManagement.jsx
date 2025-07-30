import React, { useState } from 'react';
import UserForm from './UserForm';
import useUsers from '@/features/admin/hooks/useUsers';
import './UserManagement.css';

const UserManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { users, isLoading, error, createUser, updateUser, deleteUser } = useUsers();

  const handleCreateUser = async (userData) => {
    await createUser(userData);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(userId);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>
        <button className="btn-primary" onClick={() => setIsFormOpen(true)}>
          + Add User
        </button>
      </div>

      <div className="users-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsFormOpen(true);
                      }}
                      title="Edit User"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <UserForm
          user={selectedUser}
          onSubmit={selectedUser ? updateUser : handleCreateUser}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
