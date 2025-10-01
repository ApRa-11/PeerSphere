import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test protected route
router.get('/me', protect, (req, res) => {
  res.json({
    message: 'You are authenticated!',
    user: req.user  // decoded payload from JWT
  });
});

export default router;
