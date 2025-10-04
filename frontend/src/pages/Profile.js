import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams(); // get user ID from URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        const user = res.data;

        // Ensure profilePic is a full URL
        if (user.profilePic && !user.profilePic.startsWith('http')) {
          user.profilePic = `http://localhost:5000${user.profilePic}`;
        }

        setUserData(user);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;
  if (error || !userData) return <p style={{ textAlign: 'center', marginTop: '50px' }}>User not found</p>;

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
        src={userData.profilePic || 'https://via.placeholder.com/150'}
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
      <h2>{userData.displayName || userData.username}</h2>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Bio:</strong> {userData.bio || 'No bio available'}</p>
    </div>
  );
};

export default Profile;
