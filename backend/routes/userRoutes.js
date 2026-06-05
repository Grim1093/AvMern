console.log('[Router Setup] Initializing User routes...');
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Map endpoints to controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

console.log('[Router Success] User routes configured.');
module.exports = router;