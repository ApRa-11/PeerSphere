import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { registerUser, loginUser } from '../controllers/authControllers.js';
import protect from '../middlewares/authMiddleware.js'; // default import

const router = express.Router();

// Register with profile picture upload
router.post('/register', upload.single('profilePic'), registerUser);

// Login
router.post('/login', loginUser);

// Protected route to get logged-in user info
router.get('/me', protect, (req, res) => {
  const { username, displayName, email, profilePic, bio } = req.user;
  res.json({
    user: { username, name: displayName, email, profilePic, bio }
  });
});

export default router;
