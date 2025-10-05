import express from 'express';
import {
  sendRequest,
  respondRequest,
  getPeers,
  getStatus,
  getIncomingRequests
} from '../controllers/peerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Order matters — specific routes come first
router.post('/request', protect, sendRequest);
router.post('/respond', protect, respondRequest);
router.get('/status/:userId', protect, getStatus);
router.get('/incoming', protect, getIncomingRequests);
router.get('/:userId', protect, getPeers); // ✅ Keep this last

export default router;
