const Peer = require('../models/Peer');

// Send peer request
exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const requesterId = req.user?._id;

    if (!requesterId) return res.status(401).json({ message: 'Unauthorized' });
    if (!receiverId) return res.status(400).json({ message: 'Receiver ID is required' });
    if (receiverId === requesterId.toString()) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

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
    console.error('Error in sendRequest:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept/reject request
exports.respondRequest = async (req, res) => {
  try {
    const { requesterId, action } = req.body;
    const receiverId = req.user._id;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const peer = await Peer.findOne({ requesterId, receiverId, status: 'pending' });
    if (!peer) return res.status(404).json({ message: "Request not found" });

    peer.status = action === 'accept' ? 'accepted' : 'rejected';
    await peer.save();

    res.json({ message: `Request ${peer.status}`, peer });
  } catch (err) {
    console.error('Error in respondRequest:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get peers of a user
exports.getPeers = async (req, res) => {
  try {
    const userId = req.params.userId;

    const peers = await Peer.find({
      $or: [
        { requesterId: userId, status: 'accepted' },
        { receiverId: userId, status: 'accepted' }
      ]
    });

    res.json({ peers });
  } catch (err) {
    console.error('Error in getPeers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get peer status between logged-in user and target user
exports.getStatus = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.json({ status: 'self' });
    }

    const peer = await Peer.findOne({
      $or: [
        { requesterId: currentUserId, receiverId: targetUserId },
        { requesterId: targetUserId, receiverId: currentUserId }
      ]
    });

    if (!peer) return res.json({ status: 'add' });
    if (peer.status === 'accepted') return res.json({ status: 'peer' });
    if (peer.status === 'pending') {
      return res.json({
        status: peer.requesterId.toString() === currentUserId ? 'sent' : 'add'
      });
    }

    res.json({ status: 'add' });
  } catch (err) {
    console.error('Error in getStatus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
