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

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
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
    res.json(post);
  } catch (err) {
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
      user: req.user.id,
      text
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get comments of a post
// @route   GET /api/posts/:id/comments
// @access  Private
export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('comments.user', 'name email');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
