import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import './ManageUsers.scss';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, admin, manager, gardener, volunteer
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 15;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filter, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = `/api/admin/users?page=${currentPage}&limit=${itemsPerPage}`;
      if (filter !== 'all') {
        endpoint += `&role=${filter}`;
      }
      if (searchTerm) {
        endpoint += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      // Refresh users after action
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      setError(error.message);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#dc2626',
      manager: '#059669',
      gardener: '#d97706',
      volunteer: '#7c2d12'
    };
    return colors[role] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#059669',
      inactive: '#6b7280',
      suspended: '#dc2626',
      pending: '#d97706'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="manage-users-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="manage-users-page">
      <Navbar />
      
      <div className="manage-users-container">
        <div className="page-header">
          <h1>Manage Users</h1>
          <p>Manage user accounts, roles, and permissions</p>
        </div>

        <div className="users-controls">
          <div className="search-filter-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Users
              </button>
              <button 
                className={`filter-btn ${filter === 'admin' ? 'active' : ''}`}
                onClick={() => setFilter('admin')}
              >
                Admins
              </button>
              <button 
                className={`filter-btn ${filter === 'manager' ? 'active' : ''}`}
                onClick={() => setFilter('manager')}
              >
                Managers
              </button>
              <button 
                className={`filter-btn ${filter === 'gardener' ? 'active' : ''}`}
                onClick={() => setFilter('gardener')}
              >
                Gardeners
              </button>
              <button 
                className={`filter-btn ${filter === 'volunteer' ? 'active' : ''}`}
                onClick={() => setFilter('volunteer')}
              >
                Volunteers
              </button>
            </div>
          </div>

          <Link to="/admin/users/create" className="btn btn-primary">
            Add New User
          </Link>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>Error: {error}</span>
          </div>
        )}

        <div className="users-table">
          <div className="table-header">
            <div className="header-cell">User</div>
            <div className="header-cell">Role</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Joined</div>
            <div className="header-cell">Actions</div>
          </div>

          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="table-row">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} />
                    ) : (
                      <span className="avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="user-details">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    {user.phone && <p className="phone">{user.phone}</p>}
                  </div>
                </div>

                <div className="user-role">
                  <span 
                    className="role-badge"
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="user-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  >
                    {user.status}
                  </span>
                </div>

                <div className="user-joined">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>

                <div className="user-actions">
                  <Link 
                    to={`/admin/users/${user.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    View
                  </Link>
                  <Link 
                    to={`/admin/users/${user.id}/edit`}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </Link>
                  {user.status === 'active' ? (
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => handleUserAction(user.id, 'suspend')}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => handleUserAction(user.id, 'activate')}
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-users">
              <span className="empty-icon">👥</span>
              <h3>No users found</h3>
              <p>No users match your current search and filter criteria.</p>
            </div>
          )}
        </div>

        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage}
          </div>
          
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ManageUsers;
