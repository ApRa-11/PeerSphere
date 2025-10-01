import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout, user } = useContext(AuthContext); // ✅ added user
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // redirect after logout
  };

  return (
    <nav style={styles.nav}>
      
      <Link to="/feed" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2 style={styles.logo}>PeerSphere</h2>
      </Link>
      <div style={styles.links}>
        

        {token ? (
          <>
            <Link to="/feed" style={styles.link}>Home</Link>
            <Link to="/create" style={styles.link}>Create Post</Link>
            <Link to="/profile" style={{ ...styles.link, color: '#fff' }}>
                {user?.name || 'User'}
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#282c34',
    color: '#fff'
  },
  logo: { margin: 0 },
  links: { display: 'flex', gap: '15px', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none' },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default Navbar;
