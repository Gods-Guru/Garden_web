import React, { useState, useEffect } from 'react';
import useGardenStore from '../../store/useGardenStore';
import useNotificationStore from '../../store/useNotificationStore';
import LoadingSpinner from '../common/LoadingSpinner';

const MemberManagement = ({ gardenId }) => {
  const { gardenMembers, fetchGardenMembers, loading } = useGardenStore();
  const { showSuccess, showError } = useNotificationStore();
  
  const [filter, setFilter] = useState('all'); // all, active, pending
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchGardenMembers(gardenId);
  }, [gardenId, fetchGardenMembers]);

  const updateMemberRole = async (memberId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/gardens/${gardenId}/members/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        showSuccess('Member role updated successfully');
        fetchGardenMembers(gardenId); // Refresh the list
      } else {
        throw new Error('Failed to update member role');
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const manageMembership = async (memberId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/gardens/${gardenId}/members/${memberId}/manage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        showSuccess(`Membership ${action}d successfully`);
        fetchGardenMembers(gardenId); // Refresh the list
      } else {
        throw new Error(`Failed to ${action} membership`);
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const filteredMembers = gardenMembers.filter(member => {
    const matchesFilter = filter === 'all' || member.status === filter;
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner':
        return 'role-owner';
      case 'admin':
        return 'role-admin';
      case 'coordinator':
        return 'role-coordinator';
      default:
        return 'role-member';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-inactive';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading members..." />;
  }

  return (
    <div className="member-management">
      <div className="management-header">
        <h2>Member Management</h2>
        <p>Manage garden members, roles, and permissions</p>
      </div>

      <div className="management-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search members..."
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
            All ({gardenMembers.length})
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({gardenMembers.filter(m => m.status === 'active').length})
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({gardenMembers.filter(m => m.status === 'pending').length})
          </button>
        </div>
      </div>

      <div className="members-list">
        {filteredMembers.length === 0 ? (
          <div className="empty-state">
            <p>No members found</p>
          </div>
        ) : (
          filteredMembers.map(member => (
            <div key={member._id} className="member-card">
              <div className="member-info">
                <div className="member-avatar">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} />
                  ) : (
                    <span>{member.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                
                <div className="member-details">
                  <h4>{member.name}</h4>
                  <p>{member.email}</p>
                  <div className="member-meta">
                    <span className="join-date">
                      Joined: {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="member-badges">
                <span className={`role-badge ${getRoleBadgeColor(member.role)}`}>
                  {member.role}
                </span>
                <span className={`status-badge ${getStatusBadgeColor(member.status)}`}>
                  {member.status}
                </span>
              </div>

              <div className="member-actions">
                {member.status === 'pending' && (
                  <div className="pending-actions">
                    <button
                      onClick={() => manageMembership(member._id, 'approve')}
                      className="btn btn-success btn-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => manageMembership(member._id, 'reject')}
                      className="btn btn-danger btn-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {member.status === 'active' && member.role !== 'owner' && (
                  <div className="role-actions">
                    <select
                      value={member.role}
                      onChange={(e) => updateMemberRole(member._id, e.target.value)}
                      className="role-select"
                    >
                      <option value="member">Member</option>
                      <option value="coordinator">Coordinator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .member-management {
          .management-header {
            margin-bottom: 2rem;
            
            h2 {
              font-size: 1.5rem;
              font-weight: 600;
              color: #111827;
              margin-bottom: 0.5rem;
            }
            
            p {
              color: #6b7280;
            }
          }

          .management-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            gap: 1rem;
            flex-wrap: wrap;

            .search-input {
              padding: 0.75rem 1rem;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              font-size: 0.875rem;
              min-width: 250px;

              &:focus {
                outline: none;
                border-color: #10b981;
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
              }
            }

            .filter-tabs {
              display: flex;
              gap: 0.5rem;

              .filter-tab {
                padding: 0.5rem 1rem;
                border: 1px solid #d1d5db;
                background: white;
                color: #6b7280;
                border-radius: 6px;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.2s;

                &:hover {
                  background: #f9fafb;
                }

                &.active {
                  background: #10b981;
                  color: white;
                  border-color: #10b981;
                }
              }
            }
          }

          .members-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .empty-state {
              text-align: center;
              padding: 3rem;
              color: #6b7280;
            }

            .member-card {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 1.5rem;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              transition: all 0.2s;

              &:hover {
                border-color: #10b981;
                background: white;
              }

              .member-info {
                display: flex;
                align-items: center;
                gap: 1rem;
                flex: 1;

                .member-avatar {
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  background: #10b981;
                  color: white;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 600;
                  overflow: hidden;

                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }

                .member-details {
                  h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 0.25rem 0;
                  }

                  p {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin: 0 0 0.5rem 0;
                  }

                  .member-meta {
                    .join-date {
                      font-size: 0.75rem;
                      color: #9ca3af;
                    }
                  }
                }
              }

              .member-badges {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;

                .role-badge, .status-badge {
                  padding: 0.25rem 0.75rem;
                  border-radius: 20px;
                  font-size: 0.75rem;
                  font-weight: 600;
                  text-transform: capitalize;
                }

                .role-badge {
                  &.role-owner {
                    background: #fef2f2;
                    color: #dc2626;
                  }
                  &.role-admin {
                    background: #f3e8ff;
                    color: #7c3aed;
                  }
                  &.role-coordinator {
                    background: #eff6ff;
                    color: #2563eb;
                  }
                  &.role-member {
                    background: #f0fdf4;
                    color: #16a34a;
                  }
                }

                .status-badge {
                  &.status-active {
                    background: #f0fdf4;
                    color: #16a34a;
                  }
                  &.status-pending {
                    background: #fffbeb;
                    color: #d97706;
                  }
                  &.status-inactive {
                    background: #f9fafb;
                    color: #6b7280;
                  }
                }
              }

              .member-actions {
                display: flex;
                gap: 0.5rem;
                align-items: center;

                .pending-actions {
                  display: flex;
                  gap: 0.5rem;
                }

                .role-select {
                  padding: 0.5rem;
                  border: 1px solid #d1d5db;
                  border-radius: 6px;
                  font-size: 0.875rem;
                  background: white;

                  &:focus {
                    outline: none;
                    border-color: #10b981;
                  }
                }

                .btn {
                  padding: 0.5rem 1rem;
                  border: none;
                  border-radius: 6px;
                  font-size: 0.875rem;
                  font-weight: 500;
                  cursor: pointer;
                  transition: all 0.2s;

                  &.btn-sm {
                    padding: 0.375rem 0.75rem;
                    font-size: 0.75rem;
                  }

                  &.btn-success {
                    background: #10b981;
                    color: white;

                    &:hover {
                      background: #059669;
                    }
                  }

                  &.btn-danger {
                    background: #ef4444;
                    color: white;

                    &:hover {
                      background: #dc2626;
                    }
                  }
                }
              }
            }
          }

          @media (max-width: 768px) {
            .management-controls {
              flex-direction: column;
              align-items: stretch;

              .search-input {
                min-width: auto;
              }

              .filter-tabs {
                justify-content: center;
              }
            }

            .member-card {
              flex-direction: column;
              align-items: stretch;
              gap: 1rem;

              .member-info {
                justify-content: flex-start;
              }

              .member-badges {
                justify-content: center;
              }

              .member-actions {
                justify-content: center;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default MemberManagement;
