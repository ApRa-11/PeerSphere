import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    let { username, displayName, email, password, confirmPassword, bio, dob } = req.body;

    if (!username || !displayName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    username = username.toLowerCase(); // normalize username
    email = email.toLowerCase(); // normalize email

    // Check for existing username/email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) return res.status(400).json({ message: 'Username already taken' });
      if (existingUser.email === email) return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : '';

    const newUser = await User.create({
      username,
      displayName,
      email,
      password: hashedPassword,
      bio: bio || '',
      dob: dob || null,
      profilePic: profilePicUrl
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        displayName: newUser.displayName,
        email: newUser.email,
        bio: newUser.bio,
        dob: newUser.dob,
        profilePic: newUser.profilePic
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login user (case-insensitive username)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    username = username.toLowerCase(); // normalize for login

    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        dob: user.dob
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
