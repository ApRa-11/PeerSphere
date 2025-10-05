import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      login(res.data.token, res.data.user);
      navigate('/feed');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="login-btn-container">
            <button type="submit">Login</button>
          </div>
        </form>

        <p className="signup-text">
          New peer?{' '}
          <span onClick={() => navigate('/register')} className="signup-link">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
