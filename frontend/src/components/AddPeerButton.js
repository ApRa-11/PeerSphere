import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddPeerButton = ({ targetUserId }) => {
  const { token } = useContext(AuthContext);
  const [status, setStatus] = useState('add'); // add / sent / peer / self
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `/api/peers/status/${targetUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatus(res.data.status);
      } catch (err) {
        console.error('Failed to fetch peer status:', err);
      }
    };

    fetchStatus();
  }, [targetUserId, token]);

  const handleAddPeer = async () => {
    if (!token) return;
    setLoading(true);

    try {
      await axios.post(
        '/api/peers/request',
        { receiverId: targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('sent');
    } catch (err) {
      console.error('Failed to send request:', err);
      alert(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'self') return null;

  return (
    <button
      onClick={handleAddPeer}
      disabled={status !== 'add' || loading}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor:
          status === 'peer' ? '#28a745' : status === 'sent' ? '#ffc107' : '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: status === 'add' ? 'pointer' : 'default',
        marginTop: '10px'
      }}
    >
      {status === 'add' ? 'Add Peer' : status === 'sent' ? 'Sent' : 'Peer'}
    </button>
  );
};

export default AddPeerButton;
