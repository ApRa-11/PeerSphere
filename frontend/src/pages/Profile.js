import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AddPeerButton from '../components/AddPeerButton';
import { AuthContext } from '../context/AuthContext';
import './styles/Profile.css';
import whiteBg from '../images/white-background.jpg';
import blackBg from '../images/black-background.jpg';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const user = res.data;

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
  }, [id, token]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error || !userData) return <p className="error-text">User not found</p>;

  const isOwnProfile = currentUser?._id === userData._id;

  // Format DOB if available
  const formattedDOB = userData.dob
    ? new Date(userData.dob).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="profile-container">
      {/* Left side */}
      <div
        className="profile-left"
        style={{ backgroundImage: `url(${whiteBg})` }}
      >
        <img
          src={userData.profilePic || 'https://via.placeholder.com/250'}
          alt="Profile"
          className="profile-pic"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/250';
          }}
        />
        <h1 className="display-name">{userData.fullName || userData.username}</h1>
      </div>

      {/* Right side */}
      <div
        className="profile-right"
        style={{ backgroundImage: `url(${blackBg})` }}
      >
        <h1 className="right-display-name">
          {userData.fullName || userData.username}
        </h1>
        <h3 className="username">@{userData.username}</h3>
        <p><strong>Email:</strong> {userData.email}</p>
        {formattedDOB && <p><strong>DOB:</strong> {formattedDOB}</p>}
        <p><strong>Bio:</strong> {userData.bio || 'No bio available'}</p>

        {!isOwnProfile && token && (
          <div className="add-peer-btn">
            <AddPeerButton targetUserId={userData._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
