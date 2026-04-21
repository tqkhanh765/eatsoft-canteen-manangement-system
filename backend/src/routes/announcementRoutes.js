const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/announcementController');

// Announcement routes
router.get('/', ctrl.getAllAnnouncements);
router.get('/vendors', ctrl.getVendors);
router.get('/:id', ctrl.getAnnouncementById);
router.post('/', ctrl.createAnnouncement);
router.patch('/:id', ctrl.updateAnnouncement);
router.delete('/:id', ctrl.deleteAnnouncement);

module.exports = router;
