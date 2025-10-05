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

  const userId = user?._id || user?.id || null;

  // --- Search state ---
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // --- Notifications state ---
  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  // Hide search dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Search users
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

  // Fetch incoming peer requests
  const fetchRequests = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/peers/incoming', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [token]);

  // Handle accept/reject
  const handleRespond = async (requesterId, action) => {
    try {
      await axios.post(
        'http://localhost:5000/api/peers/respond',
        { requesterId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
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

            {/* Notification Bell */}
            <div
              style={styles.bellContainer}
              onClick={() => setShowRequests((prev) => !prev)}
            >
              🔔
              {requests.length > 0 && (
                <span style={styles.badge}>{requests.length}</span>
              )}
              {showRequests && (
                <div style={styles.requestsDropdown}>
                  {requests.length === 0 ? (
                    <p style={{ margin: 0 }}>No new requests</p>
                  ) : (
                    requests.map((r) => (
                      <div key={r._id} style={styles.requestItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={r.requesterId?.profilePic || '/images/default-avatar.png'}
                            alt={r.requesterId?.fullName}
                            style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                          />
                          <span>{r.requesterId?.fullName}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '5px' }}>
                          <button
                            style={{ ...styles.reqBtn, background: '#4caf50' }}
                            onClick={() => handleRespond(r.requesterId._id, 'accept')}
                          >
                            Accept
                          </button>
                          <button
                            style={{ ...styles.reqBtn, background: '#f44336' }}
                            onClick={() => handleRespond(r.requesterId._id, 'reject')}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

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
  searchForm: { position: 'relative', display: 'flex', marginRight: '20px' },
  searchInput: { padding: '5px 8px', borderRadius: '6px', border: 'none' },
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
  username: { margin: 0, fontSize: '0.85rem', color: '#666' },

  // Notifications
  bellContainer: { position: 'relative', cursor: 'pointer' },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-10px',
    background: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.7rem'
  },
  requestsDropdown: {
    position: 'absolute',
    right: 0,
    top: '25px',
    background: 'white',
    color: 'black',
    border: '1px solid #ccc',
    borderRadius: '6px',
    minWidth: '220px',
    padding: '8px',
    zIndex: 1000
  },
  requestItem: {
    borderBottom: '1px solid #eee',
    paddingBottom: '6px',
    marginBottom: '6px'
  },
  reqBtn: {
    flex: 1,
    border: 'none',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Navbar;
