import User from '../models/User.js';

// @desc    Get all public users
// @route   GET /api/users
// @access  Public
export const getAllPublicUsers = async (req, res) => {
    try {
        const users = await User.find({ isPublic: true });
        res.json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.location = req.body.location || user.location;
            user.skillsOffered = req.body.skillsOffered || user.skillsOffered;
            user.skillsWanted = req.body.skillsWanted || user.skillsWanted;
            user.availability = req.body.availability || user.availability;
            if (req.body.isPublic !== undefined) {
                user.isPublic = req.body.isPublic;
            }
            // --- NEW: Handle profile photo update in a separate controller ---
            if (req.body.profilePhoto) {
                user.profilePhoto = req.body.profilePhoto;
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
