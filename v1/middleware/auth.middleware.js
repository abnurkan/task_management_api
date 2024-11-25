const jwt = require("jsonwebtoken");
const User = require('../models/User')

const authMiddleware = (req, res, next) => {
    
    try {
        // Extract token from header and remove "Bearer " prefix
        const token = req.header('Authorization')?.replace('Bearer ', '');
        // const token = req.header('Authorization');
        
        // Check if the token is present
        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing!' });
        }

        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        // Find user based on decoded token ID
        User.findById(decoded.id)
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'Authentication failed' });
                }

                // Attach user data to the request object
                req.user = user;
                next(); // Only call next() here after attaching req.user
            })
            .catch(error => {
                console.error("User lookup failed:", error);
                res.status(500).json({ message: 'Internal server error' });
            });

    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({
            message: 'Invalid or expired token!',              
        });
    }
};

module.exports = authMiddleware;

