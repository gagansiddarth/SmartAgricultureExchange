import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { 
  getPendingPosts, 
  approvePost, 
  rejectPost, 
  getAllDeals,
  getAnalytics,
  getUserStats
} from '../controllers/adminController';

const router = express.Router();

// Protect all admin routes and check for admin role
router.use(protect);
router.use(authorize('admin'));

// Post management
router.get('/posts/pending', getPendingPosts);
router.post('/posts/:id/approve', approvePost);
router.post('/posts/:id/reject', rejectPost);

// Analytics and stats
router.get('/analytics', getAnalytics);
router.get('/users/stats', getUserStats);
router.get('/deals', getAllDeals);

export default router;
