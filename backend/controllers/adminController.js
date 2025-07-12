import User from '../models/User.js';
import Swap from '../models/Swap.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Ban or unban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
export const toggleBanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the isBanned status
        user.isBanned = !user.isBanned;
        await user.save();
        
        res.json({ message: `User has been ${user.isBanned ? 'banned' : 'unbanned'}.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all swaps
// @route   GET /api/admin/swaps
// @access  Private/Admin
export const getAllSwaps = async (req, res) => {
    try {
        const swaps = await Swap.find({})
            .populate('requester', 'name email')
            .populate('responder', 'name email')
            .sort({ createdAt: -1 });
        res.json(swaps);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
