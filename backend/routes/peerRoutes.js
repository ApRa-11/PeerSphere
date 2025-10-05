import express from 'express';
import peerController from '../controllers/peerController.js';
import protect from '../middlewares/authMiddleware.js'; // default import

const router = express.Router();

// Send peer request
router.post('/request', protect, peerController.sendRequest);

// Accept/reject peer request
router.post('/respond', protect, peerController.respondRequest);

// Get peers of a user
router.get('/user/:userId', protect, peerController.getPeers);

// Get peer status for frontend
router.get('/status/:userId', protect, peerController.getStatus);

export default router;
