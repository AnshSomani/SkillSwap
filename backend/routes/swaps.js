import express from 'express';
import { 
    createSwapRequest, 
    getUserSwaps, 
    updateSwapStatus, 
    deleteSwapRequest,
    rateSwap // Import the controller function
} from '../controllers/swapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all swaps for a user and create a new one
router.route('/')
    .post(protect, createSwapRequest)
    .get(protect, getUserSwaps);

// --- ADDED THIS ROUTE ---
// This new route handles submitting a rating for a specific swap
router.post('/:id/rate', protect, rateSwap);

// Route to update or delete a specific swap
router.route('/:id')
    .put(protect, updateSwapStatus)
    .delete(protect, deleteSwapRequest);

export default router;
