import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { 
    getAllUsers,
    toggleBanUser,
    getAllSwaps 
} from '../controllers/adminController.js';

const router = express.Router();

// All routes in this file are protected and require admin access
router.use(protect, admin);

router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleBanUser);
router.get('/swaps', getAllSwaps);

export default router;
