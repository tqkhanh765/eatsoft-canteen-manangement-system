const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected route - requires valid JWT token
router.get('/me', protect, getMe);

module.exports = router;
