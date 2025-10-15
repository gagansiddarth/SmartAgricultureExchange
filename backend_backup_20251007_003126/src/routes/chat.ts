import express from 'express';
import { protect } from '../middleware/auth';
import { 
  getChatMessages, 
  sendMessage, 
  markMessagesAsRead,
  getChatRooms
} from '../controllers/chatController';

const router = express.Router();

// Protect all chat routes
router.use(protect);

// Chat management
router.get('/rooms', getChatRooms);
router.get('/messages/:dealId', getChatMessages);
router.post('/messages', sendMessage);
router.put('/messages/read/:dealId', markMessagesAsRead);

export default router;
