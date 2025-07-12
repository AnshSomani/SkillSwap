import Swap from '../models/Swap.js';
import User from '../models/User.js';

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
export const createSwapRequest = async (req, res) => {
    const { responderId, requesterSkill, responderSkill, message } = req.body;

    try {
        const swap = new Swap({
            requester: req.user.id,
            responder: responderId,
            requesterSkill,
            responderSkill,
            message,
        });

        const createdSwap = await swap.save();
        res.status(201).json(createdSwap);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all swaps for a user
// @route   GET /api/swaps
// @access  Private
export const getUserSwaps = async (req, res) => {
    try {
        const swaps = await Swap.find({
            $or: [{ requester: req.user.id }, { responder: req.user.id }],
        }).populate('requester', 'name profilePhoto').populate('responder', 'name profilePhoto');
        
        res.json(swaps);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update swap status
// @route   PUT /api/swaps/:id
// @access  Private
export const updateSwapStatus = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id);

        if (swap) {
            if (swap.responder.toString() !== req.user.id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            swap.status = req.body.status;
            const updatedSwap = await swap.save();
            res.json(updatedSwap);
        } else {
            res.status(404).json({ message: 'Swap not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a swap request
// @route   DELETE /api/swaps/:id
// @access  Private
export const deleteSwapRequest = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id);

        if (swap) {
            if (swap.requester.toString() !== req.user.id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }
            if (swap.status !== 'pending') {
                return res.status(400).json({ message: 'Cannot delete a non-pending request' });
            }

            await swap.deleteOne();
            res.json({ message: 'Swap request removed' });
        } else {
            res.status(404).json({ message: 'Swap not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Complete a swap and rate the other user
// @route   POST /api/swaps/:id/rate
// @access  Private
export const rateSwap = async (req, res) => {
    const { rating, feedback } = req.body;
    
    try {
        const swap = await Swap.findById(req.params.id);

        if (!swap) {
            return res.status(404).json({ message: 'Swap not found' });
        }

        if (swap.status !== 'accepted') {
            return res.status(400).json({ message: 'Can only rate accepted swaps.' });
        }

        // Determine who is being rated
        const raterId = req.user.id;
        let ratedUserId;

        if (swap.requester.toString() === raterId) {
            ratedUserId = swap.responder;
        } else if (swap.responder.toString() === raterId) {
            ratedUserId = swap.requester;
        } else {
            return res.status(401).json({ message: 'User not part of this swap' });
        }

        const ratedUser = await User.findById(ratedUserId);

        if (!ratedUser) {
            return res.status(404).json({ message: 'User to be rated not found.' });
        }

        // Add the new rating
        const newRating = {
            rater: raterId,
            value: rating,
            feedback: feedback,
        };
        ratedUser.ratings.push(newRating);

        // Recalculate average rating
        const totalRating = ratedUser.ratings.reduce((acc, item) => item.value + acc, 0);
        ratedUser.avgRating = totalRating / ratedUser.ratings.length;

        await ratedUser.save();

        // Update swap status to completed
        swap.status = 'completed';
        await swap.save();

        res.json({ message: 'Rating submitted and swap completed.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
