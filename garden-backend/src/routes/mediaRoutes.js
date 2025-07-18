
const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload media (user must be authenticated)
router.post('/upload', auth, upload.single('image'), mediaController.uploadMedia);

// Get media for a garden or plot
router.get('/', auth, mediaController.getMedia);

module.exports = router;
