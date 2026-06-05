const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    console.log(`[Auth Step] Generating JWT for user ID: ${id}`);
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    console.log('[Auth Step 1] Registration request received.');
    const { name, email, password } = req.body;

    console.log(`[Auth Step 2] Validating input for email: ${email}`);
    if (!name || !email || !password) {
        console.error('[Auth Error] Missing fields in registration request.');
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.error('[Auth Error] Invalid email format.');
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
        console.error('[Auth Error] Password too short.');
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        console.log('[Auth Step 3] Checking if user already exists in DB...');
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.error('[Auth Error] User already exists.');
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('[Auth Step 4] Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('[Auth Step 5] Creating new user in database...');
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        if (user) {
            console.log(`[Auth Success] User ${user.email} created successfully.`);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            console.error('[Auth Error] Invalid user data received during creation.');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('[Auth Exception] Error during registration:', error.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    console.log('[Auth Step 1] Login request received.');
    const { email, password } = req.body;

    try {
        console.log(`[Auth Step 2] Searching for user with email: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.error('[Auth Error] User not found.');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('[Auth Step 3] User found. Verifying password...');
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log(`[Auth Success] User ${user.email} logged in successfully.`);
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            console.error('[Auth Error] Password mismatch.');
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('[Auth Exception] Error during login:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { registerUser, loginUser };