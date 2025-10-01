import Post from '../model/postModel.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user.id // coming from protect middleware
    });

    // Populate author info before returning
    await post.populate('author', 'displayName profilePic');

    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'displayName profilePic') // ✅ important
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    await post.populate('author', 'displayName profilePic');

    res.json(post);
  } catch (err) {
    console.error('Like post error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      author: req.user.id,
      text
    };

    post.comments.push(comment);
    await post.save();

    await post.populate([
      { path: 'author', select: 'displayName profilePic' },
      { path: 'comments.author', select: 'displayName profilePic' }
    ]);

    res.status(201).json(post);
  } catch (err) {
    console.error('Add comment error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
