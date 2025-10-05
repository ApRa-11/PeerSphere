import Peer from '../model/peerModel.js';

// Send peer request
export const sendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const requesterId = req.user._id;

  if (!receiverId) return res.status(400).json({ message: "No receiverId provided" });
  if (receiverId === requesterId.toString()) return res.status(400).json({ message: "Cannot send request to yourself" });

  try {
    const existing = await Peer.findOne({
      $or: [
        { requesterId, receiverId },
        { requesterId: receiverId, receiverId: requesterId }
      ]
    });

    if (existing) return res.status(400).json({ message: "Request already exists" });

    const peer = new Peer({ requesterId, receiverId });
    await peer.save();

    res.status(201).json({ message: "Peer request sent", peer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept/reject request
export const respondRequest = async (req, res) => {
  const { requesterId, action } = req.body;
  const receiverId = req.user._id;

  try {
    const peer = await Peer.findOne({ requesterId, receiverId, status: 'pending' });
    if (!peer) return res.status(404).json({ message: "Request not found" });

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    peer.status = action === 'accept' ? 'accepted' : 'rejected';
    await peer.save();

    res.json({ message: `Request ${peer.status}`, peer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get peers of a user
export const getPeers = async (req, res) => {
  const userId = req.params.userId;

  try {
    const peers = await Peer.find({
      $or: [
        { requesterId: userId, status: 'accepted' },
        { receiverId: userId, status: 'accepted' }
      ]
    });
    res.json({ peers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get peer status between logged-in user and target user
export const getStatus = async (req, res) => {
  const currentUserId = req.user._id;
  const targetUserId = req.params.userId;

  if (currentUserId.toString() === targetUserId) {
    return res.json({ status: 'self' });
  }

  try {
    const peer = await Peer.findOne({
      $or: [
        { requesterId: currentUserId, receiverId: targetUserId },
        { requesterId: targetUserId, receiverId: currentUserId }
      ]
    });

    if (!peer) return res.json({ status: 'none' });
    res.json({ status: peer.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get incoming peer requests for logged-in user
export const getIncomingRequests = async (req, res) => {
  const userId = req.user._id;
  try {
    const requests = await Peer.find({ receiverId: userId, status: 'pending' })
      .populate('requesterId', 'username fullName profilePic');
    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
