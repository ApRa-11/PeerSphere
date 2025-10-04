import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState(''); // changed from email → username
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,   // send username instead of email
        password,
      });

      // save token & user using AuthContext
      login(res.data.token, res.data.user);

      // redirect to feed
      navigate('/feed');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}
      >
        <input
          type="text"
          placeholder="Username" // changed placeholder
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: '1rem', padding: '0.5rem' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '1rem', padding: '0.5rem' }}
          required
        />
        <button
          type="submit"
          style={{ padding: '0.5rem', backgroundColor: '#282c34', color: '#fff' }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
