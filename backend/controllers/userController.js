import User from '../models/User.js';

// @desc    Get all public users
// @route   GET /api/users
// @access  Public
export const getAllPublicUsers = async (req, res) => {
    try {
        // Find all users where the isPublic flag is true
        const users = await User.find({ isPublic: true });
        res.json(users);
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires token)
export const getUserProfile = async (req, res) => {
    try {
        // The user's ID is attached to the request object by the 'protect' middleware
        const user = await User.findById(req.user.id);

        if (user) {
            // If user is found, send back their profile data
            res.json(user);
        } else {
            // If no user is found with that ID
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (requires token)
export const updateUserProfile = async (req, res) => {
    try {
        // Find the user by their ID from the auth token
        const user = await User.findById(req.user.id);

        if (user) {
            // Update user fields with data from the request body, or keep the existing data if not provided
            user.name = req.body.name || user.name;
            user.location = req.body.location || user.location;
            user.skillsOffered = req.body.skillsOffered || user.skillsOffered;
            user.skillsWanted = req.body.skillsWanted || user.skillsWanted;
            user.availability = req.body.availability || user.availability;
            
            // Handle boolean value for isPublic carefully
            if (req.body.isPublic !== undefined) {
                user.isPublic = req.body.isPublic;
            }
            
            // Note: Profile photo and password updates would require separate, more complex logic

            // Save the updated user to the database
            const updatedUser = await user.save();
            // Send back the updated user data
            res.json(updatedUser);
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ success: false, message: error.message });
    }
};
