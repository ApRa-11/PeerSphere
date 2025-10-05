import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Landing.css';
import graduationImg from '../images/graduation.png';

function Landing() {
  const navigate = useNavigate();
  
  return (
    <div className="landing-container">
      <div className="left-side">
        <h1>PeerSphere</h1>
        <p>Your campus social media hub to connect with your peers</p>
        <button className="btn" onClick={() => navigate('/register')}>
          Sign Up
        </button>
        <button className="btn" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
      <div className="right-side">
        <img
          src={graduationImg}
          alt="Graduation"
          className="graduation-img"
        />
      </div>
    </div>
  );
}

export default Landing;
