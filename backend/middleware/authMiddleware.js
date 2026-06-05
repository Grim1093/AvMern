const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    console.log('[Auth Middleware Step 1] Intercepting request to check for authorization...');
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            console.log('[Auth Middleware Step 2] Bearer token found. Extracting...');
            // Get token from header (Format is "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            console.log('[Auth Middleware Step 3] Verifying token signature...');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log(`[Auth Middleware Step 4] Token valid. Fetching user ID: ${decoded.id} from database...`);
            // Get user from the token, but do NOT return the password
            req.user = await User.findById(decoded.id).select('-password');

            console.log(`[Auth Middleware Success] User ${req.user.email} authenticated. Proceeding to route.`);
            next();
        } catch (error) {
            console.error('[Auth Middleware Error] Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.error('[Auth Middleware Error] No token found in authorization headers.');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };