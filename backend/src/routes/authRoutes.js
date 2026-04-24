const express = require('express');
const router = express.Router();
const { login, register, getMe, updateMe, forgotPassword, verifyOTP, resetPassword, admin2faVerify } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/admin-2fa', admin2faVerify); // Admin 2FA second step

// Protected routes - requires valid JWT token
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);

module.exports = router;
