import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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
      onClick={sendRequest}
      disabled={status !== 'none'}
      style={{
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: status === 'accepted' ? '#4caf50' : '#2196f3',
        color: '#fff',
        border: 'none',
        cursor: status === 'none' ? 'pointer' : 'default',
        marginLeft: '10px'
      }}
    >
      {status === 'none' ? 'Add Peer' : status === 'pending' ? 'Sent' : 'Peer'}
    </button>
  );
};

export default AddPeerButton;
