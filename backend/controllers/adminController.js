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

// --- NEW: Admin can update any user's profile info ---
// @desc    Update a user by ID
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields from request body
        user.name = req.body.name || user.name;
        user.skillsOffered = req.body.skillsOffered !== undefined ? req.body.skillsOffered : user.skillsOffered;
        user.skillsWanted = req.body.skillsWanted !== undefined ? req.body.skillsWanted : user.skillsWanted;
        
        const updatedUser = await user.save();
        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- NEW: Admin can delete a user ---
// @desc    Delete a user by ID
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Add logic here to handle related data (e.g., their swaps) if necessary
        
        await user.deleteOne();
        res.json({ message: 'User deleted successfully.' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
