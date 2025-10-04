import Post from '../model/postModel.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
    });

    // Populate author for frontend
    await post.populate('author', 'displayName profilePic');

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all posts (global feed)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'displayName profilePic')          // populate author
      .populate('comments.author', 'displayName profilePic') // populate comment authors
      .sort({ createdAt: -1 });

    // Convert likes to string for frontend
    const safePosts = posts.map((p) => ({
      ...p.toObject(),
      likes: p.likes.map((id) => id.toString()),
    }));

    res.json(safePosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Like/Unlike a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // Populate author and comment authors
    await post.populate('author', 'displayName profilePic');
    await post.populate('comments.author', 'displayName profilePic');

    const response = post.toObject();
    response.likes = post.likes.map(id => id.toString());

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ author: req.user.id, text });
    await post.save();

    // Populate author and comment authors
    await post.populate('author', 'displayName profilePic');
    await post.populate('comments.author', 'displayName profilePic');

    const response = post.toObject();
    response.likes = post.likes.map(id => id.toString());

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
