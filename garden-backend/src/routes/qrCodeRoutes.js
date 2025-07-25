const express = require('express');
const router = express.Router();
const qrCodeController = require('../controllers/qrCodeController');
const { requireAuth } = require('../middleware/auth');

// Generate QR code for a plot
router.post('/generate', requireAuth, qrCodeController.generateQRCode);

// Get QR code for a plot
router.get('/:plotId', requireAuth, qrCodeController.getQRCode);

module.exports = router;
