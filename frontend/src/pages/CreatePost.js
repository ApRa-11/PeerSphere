import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ token, user, onPostCreated }) => {
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
        const newPost = {
          ...res.data,
          author: {
            _id: user.id,
            displayName: user.displayName,
            profilePic: user.profilePic,
          },
        };
        if (onPostCreated) onPostCreated(newPost);
        setTitle('');
        setContent('');
        setMessage('Post created!');
      } else {
        setMessage(res.data.message || 'Error creating post');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
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
          required
        /><br />
        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        /><br />
        <button type="submit">Post</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CreatePost;
