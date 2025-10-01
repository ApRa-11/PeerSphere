import express from 'express';
import { createPost, getPosts, likePost, addComment, getComments } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.put('/:id/like', protect, likePost);

// NEW comment routes
router.post('/:id/comment', protect, addComment);
router.get('/:id/comments', protect, getComments);

export default router;
