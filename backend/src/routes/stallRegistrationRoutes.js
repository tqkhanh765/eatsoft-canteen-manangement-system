const express = require('express');
const router = express.Router();
const {
  submitRegistration,
  getAllRegistrations,
  getRegistrationById,
  managerReview,
  createVendorAndStore,
  adminReject,
} = require('../controllers/stallRegistrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route - anyone can submit registration
router.post('/', submitRegistration);

// Protected routes - require authentication
router.get('/', protect, authorize('Manager', 'Admin'), getAllRegistrations);
router.get('/:id', protect, authorize('Manager', 'Admin'), getRegistrationById);

// Manager routes
router.patch('/:id/manager-review', protect, authorize('Manager'), managerReview);

// Admin routes
router.post('/:id/create-vendor', protect, authorize('Admin'), createVendorAndStore);
router.patch('/:id/admin-reject', protect, authorize('Admin'), adminReject);

module.exports = router;
