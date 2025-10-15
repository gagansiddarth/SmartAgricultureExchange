import express from 'express';
import { protect } from '../middleware/auth';
import { 
  createCropPost, 
  getMyPosts, 
  updateCropPost, 
  deleteCropPost,
  getCropAdvice,
  submitCropAdvice
} from '../controllers/farmerController';

const router = express.Router();

// Protect all farmer routes
router.use(protect);

// Crop post management
router.post('/crop-posts', createCropPost);
router.get('/crop-posts', getMyPosts);
router.put('/crop-posts/:id', updateCropPost);
router.delete('/crop-posts/:id', deleteCropPost);

// Crop advice
router.get('/crop-advice', getCropAdvice);
router.post('/crop-advice', submitCropAdvice);

export default router;
