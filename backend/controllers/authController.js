// backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // --- Basic Validation ---
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password' });
    }
    // Add more robust validation later (email format, password complexity)

    try {
        // --- Check if user already exists (by email or username) ---
        const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Email or username already exists' }); // 409 Conflict
        }

        // --- Hash Password ---
        const saltRounds = 10; // Standard practice
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // --- Insert New User ---
        const newUser = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, email, username',
            [username, email, passwordHash]
        );

        // --- Respond ---
        // Don't send password hash back!
        res.status(201).json({
            message: 'User registered successfully!',
            user: newUser.rows[0],
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // --- Basic Validation ---
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        // --- Find User by Email ---
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); // User not found
        }

        // --- Compare Passwords ---
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Password doesn't match
        }

        // --- Generate JWT ---
        const payload = {
            user: {
                id: user.user_id,
                email: user.email,
                username: user.username,
                // Add roles later if implemented: role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }, // Use env variable or default
            (err, token) => {
                if (err) throw err;
                // --- Respond with Token ---
                // Exclude password hash from any user info sent back
                const { password_hash, ...userInfo } = user;
                res.status(200).json({
                    message: 'Login successful!',
                    token: token,
                    user: userInfo // Send back user info (without password)
                });
            }
        );

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};


module.exports = {
    registerUser,
    loginUser,
};