import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ token, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage('Title and content are required');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/posts',
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        onPostCreated(res.data);
        setTitle('');
        setContent('');
        setMessage('Post created!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Create post error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />
        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%', height: '80px' }}
        />
        <button type="submit">Post</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreatePost;
