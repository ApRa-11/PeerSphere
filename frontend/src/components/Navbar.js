import React, { useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = useCallback(() => {
    logout();
    setTimeout(() => {
      navigate('/');
    }, 0);
  }, [logout, navigate]);

  return (
    <nav style={styles.nav}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2 style={styles.logo}>PeerSphere</h2>
      </Link>
      <div style={styles.links}>
        {token ? (
          <>
            <Link to="/feed" style={styles.link}>Home</Link>
            <Link to="/create" style={styles.link}>Create Post</Link>

            {/* User profile link */}
            {user && (
              <Link
                to={`/profile/${user._id}`}
                style={styles.link}
              >
                {user.name || 'User'}
              </Link>
            )}

            {/* Logout link styled like others */}
            <span
              onClick={handleLogout}
              style={{ ...styles.link, cursor: 'pointer' }}
            >
              Logout
            </span>
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
};

export default Navbar;
