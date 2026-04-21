const express = require('express');
const router = express.Router();
const { login, register, getMe, updateMe, forgotPassword, verifyOTP, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected routes - requires valid JWT token
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);

module.exports = router;
