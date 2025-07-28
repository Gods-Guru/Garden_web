import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './AdminMemberManagement.scss';

const AdminMemberManagement = () => {
  const { gardenId } = useParams();
  const { token } = useAuthStore();
  const [garden, setGarden] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteLink, setInviteLink] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Fetch garden and member data
  const fetchGardenData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gardens/${gardenId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch garden data');
      }

      const data = await response.json();
      setGarden(data.data);
      setMembers(data.data.members || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Invite member by email
  const inviteMember = async () => {
    try {
      const response = await fetch(`/api/gardens/${gardenId}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        })
      });

      if (response.ok) {
        setInviteEmail('');
        setInviteRole('member');
        fetchGardenData(); // Refresh data
        alert('Member invited successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to invite member');
      }
    } catch (err) {
      alert('Failed to invite member');
    }
  };

  // Generate invite link
  const generateInviteLink = async () => {
    try {
      const response = await fetch(`/api/gardens/${gardenId}/invite-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expiresIn: 7 })
      });

      if (response.ok) {
        const data = await response.json();
        setInviteLink(data.data.inviteLink);
        setShowInviteModal(true);
      } else {
        alert('Failed to generate invite link');
      }
    } catch (err) {
      alert('Failed to generate invite link');
    }
  };

  // Promote/demote user
  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/gardens/${gardenId}/members/${userId}/promote`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newRole })
      });

      if (response.ok) {
        fetchGardenData(); // Refresh data
        alert('User role updated successfully!');
      } else {
        alert('Failed to update user role');
      }
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  // Block user
  const blockUser = async (userId, reason) => {
    try {
      const response = await fetch(`/api/gardens/${gardenId}/members/${userId}/block`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        fetchGardenData(); // Refresh data
        alert('User blocked successfully!');
      } else {
        alert('Failed to block user');
      }
    } catch (err) {
      alert('Failed to block user');
    }
  };

  // Copy invite link to clipboard
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  useEffect(() => {
    if (gardenId && token) {
      fetchGardenData();
    }
  }, [gardenId, token]);

  if (loading) {
    return <LoadingSpinner message="Loading garden management..." />;
  }

  if (error) {
    return (
      <div className="admin-member-management">
        <Navbar />
        <div className="error-container">
          <h2>Error loading garden</h2>
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-member-management">
      <Navbar />
      
      <div className="management-container">
        <header className="management-header">
          <h1>Manage Members - {garden?.name}</h1>
          <p>{garden?.description}</p>
        </header>

        {/* Invite Section */}
        <section className="invite-section">
          <h2>Invite New Members</h2>
          
          <div className="invite-methods">
            <div className="invite-by-email">
              <h3>Invite by Email</h3>
              <div className="invite-form">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={inviteMember} className="btn btn-primary">
                  Send Invite
                </button>
              </div>
            </div>

            <div className="invite-by-link">
              <h3>Generate Invite Link</h3>
              <p>Create a shareable link that expires in 7 days</p>
              <button onClick={generateInviteLink} className="btn btn-secondary">
                Generate Link
              </button>
            </div>
          </div>
        </section>

        {/* Members List */}
        <section className="members-section">
          <h2>Current Members ({members.length})</h2>
          
          <div className="members-grid">
            {members.map(member => (
              <div key={member.user._id} className="member-card">
                <div className="member-info">
                  <img 
                    src={member.user.profilePicture || '/api/placeholder/60/60'} 
                    alt={member.user.name}
                    className="member-avatar"
                  />
                  <div className="member-details">
                    <h3>{member.user.name}</h3>
                    <p>{member.user.email}</p>
                    <span className={`member-role ${member.role}`}>
                      {member.role}
                    </span>
                    <span className={`member-status ${member.status}`}>
                      {member.status}
                    </span>
                  </div>
                </div>

                <div className="member-actions">
                  <select
                    value={member.role}
                    onChange={(e) => updateUserRole(member.user._id, e.target.value)}
                    disabled={member.role === 'owner'}
                  >
                    <option value="member">Member</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="admin">Admin</option>
                    {member.role === 'owner' && <option value="owner">Owner</option>}
                  </select>

                  {member.status === 'active' && member.role !== 'owner' && (
                    <button
                      onClick={() => {
                        const reason = prompt('Reason for blocking:');
                        if (reason) blockUser(member.user._id, reason);
                      }}
                      className="btn btn-danger btn-sm"
                    >
                      Block
                    </button>
                  )}

                  {member.status === 'blocked' && (
                    <button
                      onClick={() => updateUserRole(member.user._id, member.role)}
                      className="btn btn-success btn-sm"
                    >
                      Unblock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Invite Link Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Invite Link Generated</h3>
            <p>Share this link with people you want to invite to the garden:</p>
            <div className="invite-link-container">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="invite-link-input"
              />
              <button onClick={copyInviteLink} className="btn btn-primary">
                Copy
              </button>
            </div>
            <p className="link-expiry">This link expires in 7 days</p>
            <button 
              onClick={() => setShowInviteModal(false)}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminMemberManagement;
