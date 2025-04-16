const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    //Validation, add more complex later
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    try {
        //Check if user already exists
        const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Email or username already exists' });
        }

        //Hash Pass
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        //Insert New User
        const newUser = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, email, username',
            [username, email, passwordHash]
        );

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

    //Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        //Find by email
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {//not found
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //Compare Passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {//doesn't match
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //Generate JWT
        const payload = {
            user: {
                id: user.user_id,
                email: user.email,
                username: user.username
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
            (err, token) => {
                if (err) throw err;
                const { password_hash, ...userInfo } = user;
                res.status(200).json({
                    message: 'Login successful!',
                    token: token,
                    user: userInfo
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