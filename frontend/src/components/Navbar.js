import React, { useContext, useCallback, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AddPeerButton from './AddPeerButton';

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    setTimeout(() => navigate('/'), 0);
  }, [logout, navigate]);

  // Get user ID safely
  const userId = user?._id || user?.id || null;

  // --- Search state ---
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await axios.get(`/api/users?search=${searchQuery}`);
      setResults(res.data.users);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2 style={styles.logo}>PeerSphere</h2>
      </Link>

      {/* --- Search Bar --- */}
      {token && (
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>Search</button>

          {showDropdown && results.length > 0 && (
            <div style={styles.dropdown} ref={dropdownRef}>
              {results.map((u) => (
                <div key={u._id} style={styles.dropdownItem}>
                  <img
                    src={u.profilePic || '/images/default-avatar.png'}
                    alt={u.fullName}
                    style={styles.avatar}
                  />
                  <div style={styles.userInfo}>
                    <p style={styles.fullName}>{u.fullName}</p>
                    <p style={styles.username}>@{u.username}</p>
                  </div>
                  <AddPeerButton targetUserId={u._id} />
                </div>
              ))}
            </div>
          )}
        </form>
      )}

      <div style={styles.links}>
        {token ? (
          <>
            <Link to="/feed" style={styles.link}>Home</Link>
            <Link to="/create" style={styles.link}>Create Post</Link>

            {/* Profile link */}
            {userId && (
              <Link to={`/profile/${userId}`} style={styles.link}>
                User
              </Link>
            )}

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
    color: '#fff',
    position: 'relative'
  },
  logo: { margin: 0 },
  links: { display: 'flex', gap: '15px', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none' },

  // Search
  searchForm: {
    position: 'relative',
    display: 'flex',
    marginRight: '20px'
  },
  searchInput: {
    padding: '5px 8px',
    borderRadius: '6px',
    border: 'none'
  },
  searchButton: {
    marginLeft: '5px',
    padding: '5px 10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#2196f3',
    color: '#fff'
  },
  dropdown: {
    position: 'absolute',
    top: '35px',
    left: 0,
    right: 0,
    background: 'white',
    color: 'black',
    border: '1px solid #ccc',
    borderRadius: '6px',
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 1000
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 8px',
    borderBottom: '1px solid #eee'
  },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', marginRight: '8px' },
  userInfo: { flex: 1 },
  fullName: { margin: 0, fontWeight: 600 },
  username: { margin: 0, fontSize: '0.85rem', color: '#666' }
};

export default Navbar;
