import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CreatePost from './CreatePost';

const CommentInput = ({ postId, onAddComment }) => {
  const [text, setText] = useState('');
  const handleSubmit = () => {
    if (text.trim()) {
      onAddComment(postId, text);
      setText('');
    }
  };
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <input
        type="text"
        value={text}
        placeholder="Write a comment..."
        onChange={(e) => setText(e.target.value)}
        style={{ padding: '0.5rem', width: '80%', marginRight: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        disabled={!postId}
      />
      <button style={styles.btn} onClick={handleSubmit} disabled={!text.trim()}>Post</button>
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (token) fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    }
  };

  const handleLike = async (postId) => {
    if (!token || !user) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(prev => prev.map(p => (p?._id === postId ? res.data : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId, text) => {
    if (!token || !user) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => prev.map(p => (p?._id === postId ? res.data : p)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      {token && <CreatePost token={token} onPostCreated={newPost => setPosts(prev => [newPost, ...prev])} />}
      <h2 style={{ marginBottom: '1.5rem' }}>Feed</h2>

      {!posts.length ? <p>No posts yet.</p> :
        posts.map(post => {
          if (!post) return null;
          const isLiked = user ? post.likes?.includes(user.id) : false;

          return (
            <div key={post._id} style={styles.card}>
              <div style={styles.header}>
                {/* Clickable profile picture */}
                <Link to={`/profile/${post.author?._id}`}>
                  <img
                    src={post.author?.profilePic || 'https://via.placeholder.com/40'}
                    alt={post.author?.displayName || 'User'}
                    style={styles.avatar}
                  />
                </Link>

                <div>
                  {/* Clickable author name */}
                  <Link to={`/profile/${post.author?._id}`} style={{ textDecoration: 'none', color: '#000' }}>
                    <strong>{post.author?.displayName || 'Unknown'}</strong>
                  </Link>
                  <p style={styles.timestamp}>
                    {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>

              <div style={styles.body}>
                <h3>{post.title || ''}</h3>
                <p>{post.content || ''}</p>
              </div>

              <div style={styles.footer}>
                <button style={styles.btn} onClick={() => handleLike(post._id)} disabled={!user}>
                  {isLiked ? '❤️ Unlike' : '👍 Like'} ({post.likes?.length || 0})
                </button>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <strong>Comments:</strong>
                <ul>
                  {post.comments?.map((c, i) => (
                    <li key={i}>
                      <Link to={`/profile/${c.author?._id}`} style={{ textDecoration: 'none', color: '#000' }}>
                        <b>{c.author?.displayName || 'Unknown'}</b>
                      </Link>: {c.text}
                    </li>
                  )) || <li>No comments yet.</li>}
                </ul>
                {user && <CommentInput postId={post._id} onAddComment={handleAddComment} />}
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

const styles = {
  card: { border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '1rem' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', marginRight: '0.75rem', objectFit: 'cover', cursor: 'pointer' },
  timestamp: { fontSize: '0.8rem', color: '#666', margin: 0 },
  body: { marginBottom: '1rem' },
  footer: { display: 'flex', gap: '1rem' },
  btn: { background: '#f0f0f0', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' },
};

export default Feed;
