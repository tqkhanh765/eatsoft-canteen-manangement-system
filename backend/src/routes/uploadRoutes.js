const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const upload = require('../middleware/upload');

// POST /api/upload - Upload image
router.post('/', upload.single('image'), uploadImage);

// DELETE /api/upload - Delete image
router.delete('/', deleteImage);

module.exports = router;
