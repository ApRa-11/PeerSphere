// Profile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams(); // get :id from URL
  const [userData, setUserData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/150');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUserData(res.data);
        if (res.data.profilePic) setAvatarUrl(res.data.profilePic);
      } catch (err) {
        console.error('Error fetching user:', err);
        setUserData(null);
      }
    };

    fetchUser();
  }, [id]);

  if (!userData) {
    return (
      <p style={{ textAlign: 'center', marginTop: '50px' }}>
        User not found or loading...
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
        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
      />
      <h2>{userData.displayName}</h2>
      <p>
        <strong>Username:</strong> {userData.username}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Bio:</strong> {userData.bio || 'No bio available'}
      </p>
    </div>
  );
};

export default Profile;

