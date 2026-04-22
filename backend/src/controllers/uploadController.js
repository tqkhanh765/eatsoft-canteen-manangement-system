const cloudinary = require('../lib/cloudinary');

// Upload image to Cloudinary
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'eatsoft/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    });

    // Delete the temporary file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// Delete image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting from Cloudinary:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

module.exports = { uploadImage, deleteImage };
