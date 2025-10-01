import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext); // logged-in user

  if (!user) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>You must be logged in to view your profile.</p>;
  }

  // Determine avatar URL
  const getAvatarUrl = () => {
    if (!user.avatar) return 'https://via.placeholder.com/150'; // fallback

    // If the avatar is a full URL (starts with http or https)
    if (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) {
      return user.avatar;
    }

    // Otherwise, assume it is a local uploaded file stored in public/uploads
    return `${process.env.PUBLIC_URL}/uploads/${user.avatar}`;
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      textAlign: 'center'
    }}>
      <img
        src={getAvatarUrl()}
        alt="Profile"
        style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px' }}
      />
      <h2>{user.name}</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Bio:</strong> {user.bio || 'No bio available'}</p>
    </div>
  );
};

export default Profile;
