import React from 'react';
import MyGardens from '../components/gardens/MyGardens';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <MyGardens />
    </div>
  );
}

export default Profile;
