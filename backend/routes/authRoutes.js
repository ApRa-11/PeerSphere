import express from 'express';
import { registerUser, loginUser } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;

import { protect } from '../middlewares/authMiddleware.js';

router.get('/me', protect, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});
