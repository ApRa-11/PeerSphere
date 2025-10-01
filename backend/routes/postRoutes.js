import express from 'express';
import {
  createPost,
  getPosts,
  likePost,
  addComment
} from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new post
router.post('/', protect, createPost);

// Get all posts
router.get('/', protect, getPosts);

// Like or unlike a post
router.put('/:id/like', protect, likePost);

// Add a comment to a post
router.post('/:id/comment', protect, addComment);

export default router;
