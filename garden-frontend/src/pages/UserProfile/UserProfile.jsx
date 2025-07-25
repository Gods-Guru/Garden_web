import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.scss';

function UserProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    preferences: {
      notifications: true,
      newsletter: false,
    },
    avatar: null
  });
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchUserGardens();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfile(data.profile);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserGardens = async () => {
    try {
      const res = await fetch('/api/users/gardens', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGardens(data.gardens);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        avatar: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (key === 'preferences') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'avatar' && value instanceof File) {
        formData.append('avatar', value);
      } else if (value !== null) {
        formData.append(key, value);
      }
    });

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess('Profile updated successfully!');
      updateUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="profile-container">
        <div className="profile-section">
          <form onSubmit={handleSubmit}>
            <div className="avatar-section">
              <img 
                src={profile.avatar || '/default-avatar.png'} 
                alt="Profile" 
                className="avatar"
              />
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="avatar-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="preferences-section">
              <h3>Preferences</h3>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="preferences.notifications"
                    checked={profile.preferences.notifications}
                    onChange={handleChange}
                  />
                  Receive Notifications
                </label>
              </div>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="preferences.newsletter"
                    checked={profile.preferences.newsletter}
                    onChange={handleChange}
                  />
                  Subscribe to Newsletter
                </label>
              </div>
            </div>

            <button type="submit" className="save-button">
              Save Changes
            </button>
          </form>
        </div>

        <div className="gardens-section">
          <h3>My Gardens</h3>
          {gardens.length === 0 ? (
            <p>You haven't joined any gardens yet.</p>
          ) : (
            <div className="gardens-grid">
              {gardens.map(garden => (
                <div key={garden._id} className="garden-card">
                  <h4>{garden.name}</h4>
                  <p>{garden.location}</p>
                  <span className="role-badge">
                    {garden.userRole}
                  </span>
                  <a href={`/gardens/${garden._id}`} className="view-button">
                    View Garden
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
