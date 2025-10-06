import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CreatePost from './CreatePost';
import AddPeerButton from '../components/AddPeerButton';
import './styles/Feed.css';

const CommentInput = ({ postId, onAddComment }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAddComment(postId, text);
      setText('');
    }
  };

  return (
    <div className="comment-input">
      <input
        type="text"
        value={text}
        placeholder="Write a comment..."
        onChange={(e) => setText(e.target.value)}
        disabled={!postId}
      />
      <button onClick={handleSubmit} disabled={!text.trim()}>Post</button>
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
      const res = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => prev.map(p => (p?._id === postId ? res.data : p)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="feed-container">
      <div className="center-panel">
        <h2>See what your peers are talking about</h2>
        {!posts.length ? <p>No posts yet.</p> :
          posts.map(post => {
            if (!post) return null;
            const isLiked = user ? post.likes?.includes(user.id || user._id) : false;
            const isOwnPost = user?._id === post.author?._id;

            return (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <Link to={`/profile/${post.author?._id}`}>
                    <img
                      src={post.author?.profilePic || 'https://via.placeholder.com/40'}
                      alt={post.author?.displayName || 'User'}
                      className="avatar"
                    />
                  </Link>
                  <div>
                    <div className="author-row">
                      <Link to={`/profile/${post.author?._id}`} className="author-name">
                        {post.author?.displayName || 'Unknown'}
                      </Link>
                      {!isOwnPost && token && <AddPeerButton targetUserId={post.author?._id} />}
                    </div>
                    <p className="timestamp">{post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}</p>
                  </div>
                </div>

                <div className="post-body">
                  <h3>{post.title || ''}</h3>
                  <p>{post.content || ''}</p>
                </div>

                <div className="post-footer">
                  <button onClick={() => handleLike(post._id)} disabled={!user}>
                    {isLiked ? '❤️ Unlike' : '👍 Like'} ({post.likes?.length || 0})
                  </button>
                </div>

                <div className="comments-section">
                  <strong>Comments:</strong>
                  <ul>
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((c, i) => (
                        <li key={i}>
                          <Link to={`/profile/${c.author?._id}`} className="comment-author">
                            <b>{c.author?.displayName || 'Unknown'}</b>
                          </Link>: {c.text}
                        </li>
                      ))
                    ) : (
                      <li>No comments yet.</li>
                    )}
                  </ul>
                  {user && <CommentInput postId={post._id} onAddComment={handleAddComment} />}
                </div>
              </div>
            );
          })
        }
      </div>

      {/* Right panel Create Post */}
      <div className="right-panel">
        {token && (
          <div className="create-post-container">
            <CreatePost
              token={token}
              onPostCreated={newPost => setPosts(prev => [newPost, ...prev])}
              mode="feed"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
