const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../config/db'); // Kullanıcıyı db'den çekmek gerekirse

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (veya db'den user_id ile çek)
            // req.user = await db.query('SELECT user_id, username, email FROM users WHERE user_id = $1', [decoded.user.id]);
            // if (req.user.rows.length > 0) {
            //    req.user = req.user.rows[0];
            // } else {
            //    throw new Error('User not found from token');
            // }
            req.user = decoded.user; // JWT payload'ındaki user objesini direkt kullanabiliriz

            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };