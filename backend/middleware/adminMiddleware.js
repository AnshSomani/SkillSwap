// This middleware checks if the logged-in user is an admin

export const admin = (req, res, next) => {
    // We assume this middleware runs *after* the 'protect' middleware,
    // so req.user will be available.
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the next middleware/controller
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};
