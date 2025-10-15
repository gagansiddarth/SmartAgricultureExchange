import express from 'express';
import { protect } from '../middleware/auth';
import { 
  searchCropPosts, 
  getCropPostDetails, 
  makeOffer, 
  getMyOffers,
  acceptOffer,
  rejectOffer
} from '../controllers/buyerController';

const router = express.Router();

// Protect all buyer routes
router.use(protect);

// Search and browse crops
router.get('/search', searchCropPosts);
router.get('/crop-posts/:id', getCropPostDetails);

// Deal management
router.post('/offers', makeOffer);
router.get('/offers', getMyOffers);
router.post('/offers/:id/accept', acceptOffer);
router.post('/offers/:id/reject', rejectOffer);

export default router;
