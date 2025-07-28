import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAuthStore from '../../store/useAuthStore';
import '../../styles/pagestyles/AdminUsers.scss';

const AdminUsers = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive, pending
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users data
      const mockUsers = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@email.com',
          role: 'user',
          status: 'active',
          joinedDate: '2024-01-15',
          lastLogin: '2024-03-20',
          gardens: ['Central Garden', 'East Side Garden'],
          plots: 2,
          avatar: '/api/placeholder/50/50'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          role: 'manager',
          status: 'active',
          joinedDate: '2023-11-20',
          lastLogin: '2024-03-19',
          gardens: ['Central Garden'],
          plots: 1,
          avatar: '/api/placeholder/50/50'
        },
        {
          id: 3,
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          role: 'user',
          status: 'inactive',
          joinedDate: '2024-02-10',
          lastLogin: '2024-02-25',
          gardens: ['Herb Garden'],
          plots: 1,
          avatar: '/api/placeholder/50/50'
        },
        {
          id: 4,
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          role: 'user',
          status: 'pending',
          joinedDate: '2024-03-18',
          lastLogin: null,
          gardens: [],
          plots: 0,
          avatar: '/api/placeholder/50/50'
        }
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && user.status === filter;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'manager': return 'role-manager';
      case 'user': return 'role-user';
      default: return 'role-user';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="admin-users-page">
        <Navbar />
        <div className="unauthorized">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <Navbar />
      
      <div className="admin-users-container">
        {/* Header */}
        <div className="admin-users-header">
          <div className="header-content">
            <h1>👥 User Management</h1>
            <p>Manage user accounts, roles, and permissions</p>
          </div>
          
          <div className="header-actions">
            <Link to="/admin/users/invite" className="btn btn-primary">
              Invite User
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.status === 'active').length}</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.status === 'pending').length}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.role === 'manager').length}</div>
            <div className="stat-label">Managers</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="users-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Users
            </button>
            <button
              className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-tab ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              Inactive
            </button>
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="users-content">
          {loading ? (
            <LoadingSpinner message="Loading users..." />
          ) : error ? (
            <div className="error-state">
              <h3>Unable to load users</h3>
              <p>{error}</p>
              <button onClick={fetchUsers} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <h3>No users found</h3>
              <p>
                {searchTerm 
                  ? `No users match "${searchTerm}"`
                  : 'No users available for the selected filter'
                }
              </p>
            </div>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Gardens</th>
                    <th>Plots</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="user-info">
                        <img src={user.avatar} alt={user.name} className="user-avatar" />
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`role-select ${getRoleColor(user.role)}`}
                        >
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className={`status-select ${getStatusColor(user.status)}`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td>{user.gardens.length}</td>
                      <td>{user.plots}</td>
                      <td>{formatDate(user.joinedDate)}</td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td className="user-actions">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="btn btn-sm btn-secondary"
                        >
                          View
                        </button>
                        <Link 
                          to={`/admin/users/${user.id}/edit`}
                          className="btn btn-sm btn-primary"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="user-modal" onClick={() => setSelectedUser(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="modal-close"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
              
              <div className="modal-header">
                <img src={selectedUser.avatar} alt={selectedUser.name} />
                <div>
                  <h2>{selectedUser.name}</h2>
                  <p>{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="modal-body">
                <div className="user-details">
                  <div className="detail-item">
                    <strong>Role:</strong> {selectedUser.role}
                  </div>
                  <div className="detail-item">
                    <strong>Status:</strong> {selectedUser.status}
                  </div>
                  <div className="detail-item">
                    <strong>Joined:</strong> {formatDate(selectedUser.joinedDate)}
                  </div>
                  <div className="detail-item">
                    <strong>Last Login:</strong> {formatDate(selectedUser.lastLogin)}
                  </div>
                  <div className="detail-item">
                    <strong>Gardens:</strong> {selectedUser.gardens.join(', ') || 'None'}
                  </div>
                  <div className="detail-item">
                    <strong>Plots:</strong> {selectedUser.plots}
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <Link 
                  to={`/admin/users/${selectedUser.id}/edit`}
                  className="btn btn-primary"
                  onClick={() => setSelectedUser(null)}
                >
                  Edit User
                </Link>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminUsers;
