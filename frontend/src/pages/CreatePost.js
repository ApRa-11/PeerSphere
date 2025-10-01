import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage('Title and content cannot be empty');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Post created successfully!');
        setTitle('');
        setContent('');
        console.log('Created post:', data);
        navigate('/feed'); // navigate to feed after post creation
      } else {
        setMessage(data.message || 'Error creating post');
      }
    } catch (err) {
      console.error('Server error:', err);
      setMessage('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      {token ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          /><br />
          <textarea
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          /><br />
          <button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      ) : (
        <p>You must be logged in to create a post.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreatePost;
