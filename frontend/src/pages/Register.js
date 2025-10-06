import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Register.css';
import defaultProfilePic from '../images/profile-picture.jpeg';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    displayName: '', // renamed from fullName
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    dob: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form Data before submit:', formData); // Debug

    const { username, displayName, email, password, confirmPassword } = formData;

    if (!username.trim() || !displayName.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage('Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('username', username.trim());
      data.append('displayName', displayName.trim()); // match backend
      data.append('email', email.trim());
      data.append('password', password);
      data.append('confirmPassword', confirmPassword);
      data.append('bio', formData.bio.trim());
      data.append('dob', formData.dob);
      if (profilePic) data.append('profilePic', profilePic);

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage('Registration successful!');
        console.log('Registered user:', result.user);
        navigate('/login');
      } else {
        setMessage(result.message || 'Error registering user');
      }
    } catch (err) {
      console.error('Server error:', err);
      setMessage('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Register</h2>

        <div className="profile-pic-upload">
          <div className="profile-pic-container">
            <img
              src={profilePic ? URL.createObjectURL(profilePic) : defaultProfilePic}
              alt="Profile"
              className="profile-pic-img"
            />
            <label htmlFor="profilePicInput" className="add-picture-btn">
              Add Picture
            </label>
          </div>
          <input
            type="file"
            id="profilePicInput"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="register-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="displayName" // changed from fullName
            placeholder="Full Name"
            value={formData.displayName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
