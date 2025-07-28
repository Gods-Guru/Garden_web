import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/useAuthStore';
import '../styles/pagestyles/Profile.scss';

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      location: user.location || '',
      phone: user.phone || ''
    });
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="unauthorized">
          <h2>Please log in to view your profile</h2>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={user.avatar || '/api/placeholder/120/120'}
              alt={user.name}
              className="avatar-image"
            />
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="profile-role">{user.role}</p>
            <p className="profile-email">{user.email}</p>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <div className="profile-details">
            <h2>Profile Details</h2>

            {isEditing ? (
              <div className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <div className="detail-item">
                  <strong>Full Name:</strong>
                  <span>{user.name || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <strong>Email:</strong>
                  <span>{user.email}</span>
                </div>
                <div className="detail-item">
                  <strong>Phone:</strong>
                  <span>{user.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <strong>Location:</strong>
                  <span>{user.location || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <strong>Role:</strong>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Member Since:</strong>
                  <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                {user.bio && (
                  <div className="detail-item bio">
                    <strong>Bio:</strong>
                    <p>{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="profile-stats">
            <h2>My Activity</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{user.gardens?.length || 0}</div>
                <div className="stat-label">Gardens Joined</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user.plots?.length || 0}</div>
                <div className="stat-label">Plots Assigned</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user.tasksCompleted || 0}</div>
                <div className="stat-label">Tasks Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user.eventsAttended || 0}</div>
                <div className="stat-label">Events Attended</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="profile-quick-links">
            <h2>Quick Links</h2>
            <div className="quick-links-grid">
              <Link to="/gardens" className="quick-link">
                🌱 My Gardens
              </Link>
              <Link to="/plots" className="quick-link">
                🏡 My Plots
              </Link>
              <Link to="/tasks" className="quick-link">
                📋 My Tasks
              </Link>
              <Link to="/events" className="quick-link">
                📅 My Events
              </Link>
              <Link to="/settings" className="quick-link">
                ⚙️ Settings
              </Link>
              <Link to="/help" className="quick-link">
                🆘 Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
