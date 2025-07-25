
const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload media (user must be authenticated)
router.post('/upload', requireAuth, upload.single('image'), mediaController.uploadMedia);

// Get media for a garden or plot
router.get('/', requireAuth, mediaController.getMedia);

module.exports = router;
