import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Prevent registration with admin email
        if (email === process.env.ADMIN_EMAIL) {
            return res.status(400).json({ success: false, message: 'This email is reserved.' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        const firstLetter = name.charAt(0).toUpperCase();
        const profilePhotoUrl = `https://placehold.co/100x100/8b5cf6/ffffff?text=${firstLetter}`;

        const user = await User.create({
            name,
            email,
            password,
            profilePhoto: profilePhotoUrl,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    const { email, password } = req.body;

    // --- NEW: Check for special admin credentials first ---
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        try {
            let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });

            if (!adminUser) {
                // If admin user doesn't exist, create it on first login
                const firstLetter = "A";
                const profilePhotoUrl = `https://placehold.co/100x100/10b981/ffffff?text=${firstLetter}`;

                adminUser = await User.create({
                    name: 'Admin',
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASSWORD,
                    role: 'admin',
                    profilePhoto: profilePhotoUrl,
                });
            }

            // Return admin user data with token
            return res.json({
                _id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                token: generateToken(adminUser._id),
            });

        } catch (error) {
            return res.status(500).json({ success: false, message: 'Admin setup error' });
        }
    }

    // --- Regular user login flow ---
    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // --- NEW: Check if the user is banned ---
            if (user.isBanned) {
                return res.status(403).json({ success: false, message: 'Your account has been banned.' });
            }
            
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
