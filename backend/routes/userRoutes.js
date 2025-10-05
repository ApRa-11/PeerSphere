import express from 'express';
import { getUserById, searchUsers } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js'; // default import

const router = express.Router();

// GET user by ID (without password)
router.get('/:id', protect, getUserById);

// GET /api/users?search=keyword - search users by username or fullName
router.get('/', protect, searchUsers);

export default router;
