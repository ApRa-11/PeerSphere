import React, { useContext, useCallback, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AddPeerButton from './AddPeerButton';
import './Navbar.css';

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
    const interval = setInterval(fetchRequests, 10000);
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
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/feed" className="logo-link">
          <h2 className="logo">PeerSphere</h2>
        </Link>
      </div>

      {/* --- Search Bar --- */}
      {token && (
        <form onSubmit={handleSearch} className="search-form" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>

          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((u) => (
                <div key={u._id} className="dropdown-item">
                  <img
                    src={u.profilePic || '/images/default-avatar.png'}
                    alt={u.fullName}
                    className="dropdown-avatar"
                  />
                  <div className="dropdown-info">
                    <p className="dropdown-name">{u.fullName}</p>
                    <p className="dropdown-username">@{u.username}</p>
                  </div>
                  <AddPeerButton targetUserId={u._id} />
                </div>
              ))}
            </div>
          )}
        </form>
      )}

      <div className="navbar-right">
        {token ? (
          <>
            <Link to="/feed" className="nav-link">Home</Link>
            <Link to="/create" className="nav-link">Create Post</Link>

            {/* Notification Bell */}
            <div
              className="bell-container"
              onClick={() => setShowRequests((prev) => !prev)}
            >
              🔔
              {requests.length > 0 && (
                <span className="badge">{requests.length}</span>
              )}
              {showRequests && (
                <div className="requests-dropdown">
                  {requests.length === 0 ? (
                    <p>No new requests</p>
                  ) : (
                    requests.map((r) => (
                      <div key={r._id} className="request-item">
                        <div className="request-user">
                          <img
                            src={r.requesterId?.profilePic || '/images/default-avatar.png'}
                            alt={r.requesterId?.fullName}
                            className="request-avatar"
                          />
                          <span>{r.requesterId?.fullName}</span>
                        </div>
                        <div className="request-actions">
                          <button
                            className="accept-btn"
                            onClick={() => handleRespond(r.requesterId._id, 'accept')}
                          >
                            Accept
                          </button>
                          <button
                            className="reject-btn"
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

            {userId && (
              <Link to={`/profile/${userId}`} className="nav-link">User</Link>
            )}

            <span className="nav-link logout-link" onClick={handleLogout}>
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
