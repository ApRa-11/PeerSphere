import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AddPeerButton.css'; // import the CSS file

const AddPeerButton = ({ targetUserId }) => {
  const { token } = useContext(AuthContext);
  const [status, setStatus] = useState('none'); // none, pending, accepted, self

  const fetchStatus = async () => {
    if (!token || !targetUserId) return;
    try {
      const res = await axios.get(`/api/peers/status/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [targetUserId, token]);

  const sendRequest = async () => {
    try {
      await axios.post('/api/peers/request', { receiverId: targetUserId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus('pending');
    } catch (err) {
      console.error('Failed to send request:', err);
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  if (status === 'self') return null;

  return (
    <button
      className="add-peer-button"
      onClick={sendRequest}
      disabled={status !== 'none'}
    >
      {status === 'none' ? 'Add Peer' : status === 'pending' ? 'Sent' : 'Peer'}
    </button>
  );
};

export default AddPeerButton;
