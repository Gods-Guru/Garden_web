import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import './Profile.scss';

function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
    location: '',
    phone: '',
    gardensJoined: [],
    plotsManaged: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        gardensJoined: user.gardens || [],
        plotsManaged: user.plots || []
      });
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // In a real app, this would update the user in the auth store
    setIsEditing(false);
    console.log('Profile updated:', profile);
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-error">Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.avatar || '/default-avatar.png'} alt={profile.name} />
        </div>
        <div className="profile-title">
          <h1>{profile.name}</h1>
          <p className="profile-email">{profile.email}</p>
        </div>
        {!isEditing && (
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={profile.location}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Garden Memberships</h2>
          <div className="gardens-list">
            {profile.gardensJoined.map(garden => (
              <div key={garden._id} className="garden-item">
                <h3>{garden.name}</h3>
                <p>Role: {garden.role}</p>
                <p>Joined: {new Date(garden.joinedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Managed Plots</h2>
          <div className="plots-list">
            {profile.plotsManaged.map(plot => (
              <div key={plot._id} className="plot-item">
                <h3>Plot {plot.number}</h3>
                <p>Garden: {plot.garden.name}</p>
                <p>Status: {plot.status}</p>
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit">
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Profile;
