import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAuthStore from '../../store/useAuthStore';
import './Profile.scss';

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
        location: typeof user.location === 'string' ? user.location :
                 user.location?.name || user.location?.city || '',
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
      <div className="profilePage">
        <Navbar />
        <div className="profileUnauthorized">
          <h2>Please log in to view your profile</h2>
          <Link to="/login" className="profileLoginButton">
            Go to Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Ensure all user properties are safe to render
  const safeUser = {
    ...user,
    name: String(user.name || ''),
    email: String(user.email || ''),
    bio: String(user.bio || ''),
    location: typeof user.location === 'string' ? user.location :
              user.location?.name || user.location?.city || 'Not provided',
    phone: String(user.phone || ''),
    role: String(user.role || 'user')
  };

  return (
    <div className="profilePage">
      <Navbar />

      <div className="profileContainer">
        {/* Header */}
        <div className="profileHeader">
          <div className="profileAvatarContainer">
            <div className="profileAvatarWrapper">
              <img
                src={safeUser.avatar || '/default-avatar.jpg'}
                alt={safeUser.name}
                className="profileAvatarImage"
              />
              {isEditing && (
                <button className="profileAvatarEditButton">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="profileInfo">
            <h1 className="profileName">{safeUser.name}</h1>
            <p className="profileRole">{safeUser.role}</p>
            <p className="profileEmail">{safeUser.email}</p>
          </div>
          
          <div className="profileActions">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="profileEditButton"
              >
                Edit Profile
              </button>
            ) : (
              <div className="profileEditActions">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="profileSaveButton"
                >
                  {loading ? <LoadingSpinner size="small" /> : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="profileCancelButton"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="profileContent">
          <div className="profileDetailsSection">
            <h2 className="profileSectionTitle">Profile Details</h2>

            {isEditing ? (
              <div className="profileForm">
                <div className="profileFormGroup">
                  <label htmlFor="name" className="profileFormLabel">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="profileFormInput"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="profileFormGroup">
                  <label htmlFor="email" className="profileFormLabel">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="profileFormInput"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="profileFormGroup">
                  <label htmlFor="phone" className="profileFormLabel">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="profileFormInput"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="profileFormGroup">
                  <label htmlFor="location" className="profileFormLabel">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="profileFormInput"
                    placeholder="Enter your location"
                  />
                </div>

                <div className="profileFormGroup">
                  <label htmlFor="bio" className="profileFormLabel">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="profileFormTextarea"
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>
              </div>
            ) : (
              <div className="profileDetailsDisplay">
                <div className="profileDetailItem">
                  <span className="profileDetailLabel">Full Name:</span>
                  <span className="profileDetailValue">{safeUser.name || 'Not provided'}</span>
                </div>
                <div className="profileDetailItem">
                  <span className="profileDetailLabel">Email:</span>
                  <span className="profileDetailValue">{safeUser.email}</span>
                </div>
                <div className="profileDetailItem">
                  <span className="profileDetailLabel">Phone:</span>
                  <span className="profileDetailValue">{safeUser.phone || 'Not provided'}</span>
                </div>
                <div className="profileDetailItem">
                  <span className="profileDetailLabel">Location:</span>
                  <span className="profileDetailValue">{safeUser.location}</span>
                </div>
                <div className="profileDetailItem">
                  <span className="profileDetailLabel">Role:</span>
                  <span className={`profileRoleBadge profileRoleBadge--${safeUser.role}`}>
                    {safeUser.role}
                  </span>
                </div>
                <div className="profileDetailItem">
                  <span className="profileDetailLabel">Member Since:</span>
                  <span className="profileDetailValue">
                    {new Date(safeUser.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                {safeUser.bio && (
                  <div className="profileDetailItem profileBioItem">
                    <span className="profileDetailLabel">Bio:</span>
                    <p className="profileBioText">{safeUser.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Activity Section */}
          <div className="profileActivitySection">
            <h2 className="profileSectionTitle">My Activity</h2>
            <div className="profileStatsGrid">
              <div className="profileStatCard">
                <div className="profileStatNumber">{safeUser.gardens?.length || 0}</div>
                <div className="profileStatLabel">Gardens Joined</div>
              </div>
              <div className="profileStatCard">
                <div className="profileStatNumber">{safeUser.plots?.length || 0}</div>
                <div className="profileStatLabel">Plots Assigned</div>
              </div>
              <div className="profileStatCard">
                <div className="profileStatNumber">{safeUser.tasksCompleted || 0}</div>
                <div className="profileStatLabel">Tasks Completed</div>
              </div>
              <div className="profileStatCard">
                <div className="profileStatNumber">{safeUser.eventsAttended || 0}</div>
                <div className="profileStatLabel">Events Attended</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="profileQuickLinksSection">
            <h2 className="profileSectionTitle">Quick Links</h2>
            <div className="profileQuickLinksGrid">
              <Link to="/gardens" className="profileQuickLink">
                <span className="profileQuickLinkIcon">🌱</span>
                <span className="profileQuickLinkText">My Gardens</span>
              </Link>
              <Link to="/plots" className="profileQuickLink">
                <span className="profileQuickLinkIcon">🏡</span>
                <span className="profileQuickLinkText">My Plots</span>
              </Link>
              <Link to="/tasks" className="profileQuickLink">
                <span className="profileQuickLinkIcon">📋</span>
                <span className="profileQuickLinkText">My Tasks</span>
              </Link>
              <Link to="/events" className="profileQuickLink">
                <span className="profileQuickLinkIcon">📅</span>
                <span className="profileQuickLinkText">My Events</span>
              </Link>
              <Link to="/settings" className="profileQuickLink">
                <span className="profileQuickLinkIcon">⚙️</span>
                <span className="profileQuickLinkText">Settings</span>
              </Link>
              <Link to="/help" className="profileQuickLink">
                <span className="profileQuickLinkIcon">🆘</span>
                <span className="profileQuickLinkText">Help Center</span>
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