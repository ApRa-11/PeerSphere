// Profile.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/150');

  useEffect(() => {
    if (user && user.profilePic) {
      // Use profilePic from backend (already a full URL)
      setAvatarUrl(user.profilePic);
    }
  }, [user]);

  if (!user) {
    return (
      <p style={{ textAlign: 'center', marginTop: '50px' }}>
        You must be logged in to view your profile.
      </p>
    );
  }

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        textAlign: 'center',
      }}
    >
      <img
        src={avatarUrl}
        alt="Profile"
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          marginBottom: '20px',
          objectFit: 'cover',
        }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/150';
        }}
      />
      <h2>{user.name}</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Bio:</strong> {user.bio || 'No bio available'}
      </p>
    </div>
  );
};

export default Profile;
