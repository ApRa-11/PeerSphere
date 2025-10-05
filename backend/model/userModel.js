import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
  bio: { type: String, default: '' },
  dob: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
