import User from '../model/userModel.js';

// Get user by ID (without password)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Search users by username or fullName
export const searchUsers = async (req, res) => {
  const { search } = req.query;

  if (!search || search.trim() === '') {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const regex = new RegExp(search, 'i'); // case-insensitive search
    const users = await User.find({
      $or: [{ username: regex }, { fullName: regex }]
    }).select('_id username fullName profilePic'); // minimal info

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
