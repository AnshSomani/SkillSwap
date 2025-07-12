import express from 'express';
import { getAllPublicUsers, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPublicUsers);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;
