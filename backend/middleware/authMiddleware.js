import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from the header (e.g., "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by the ID stored in the token's payload
            // We exclude the password field for security
            req.user = await User.findById(decoded.id).select('-password');
            
            // If no user is found with this ID (e.g., user was deleted), deny access
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            // If token is valid and user exists, proceed to the next middleware or route handler
            next();
        } catch (error) {
            // If the token is invalid or expired, jwt.verify will throw an error
            console.error(error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    // If no token is found in the header at all, deny access
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
