import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { 
    getAllUsers,
    toggleBanUser,
    getAllSwaps,
    updateUserByAdmin,  // NEW
    deleteUserByAdmin   // NEW
} from '../controllers/adminController.js';

const router = express.Router();

// All routes in this file are protected and require admin access
router.use(protect, admin);

router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleBanUser);
router.put('/users/:id', updateUserByAdmin); // NEW ROUTE for editing
router.delete('/users/:id', deleteUserByAdmin); // NEW ROUTE for deleting

router.get('/swaps', getAllSwaps);

export default router;
