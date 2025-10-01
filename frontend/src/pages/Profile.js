import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { token, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setBio(res.data.bio || '');
        setProfilePic(res.data.profilePic || '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [user.id, token]);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        { bio, profilePic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>My Profile</h2>
      <img
        src={profile.profilePic || 'https://via.placeholder.com/150'}
        alt="Profile"
        style={{ borderRadius: '50%', width: '150px', height: '150px' }}
      />
      <h3>{profile.name}</h3>
      <p>{profile.email}</p>

      {editing ? (
        <div>
          <input
            type="text"
            value={bio}
            placeholder="Your bio..."
            onChange={(e) => setBio(e.target.value)}
          />
          <input
            type="text"
            value={profilePic}
            placeholder="Profile pic URL"
            onChange={(e) => setProfilePic(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <>
          <p>{profile.bio || 'No bio yet.'}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
};

export default Profile;
