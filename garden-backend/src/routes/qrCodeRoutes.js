const express = require('express');
const router = express.Router();
const qrCodeController = require('../controllers/qrCodeController');
const auth = require('../middleware/auth');

// Generate QR code for a plot
router.post('/generate', auth, qrCodeController.generateQRCode);

// Get QR code for a plot
router.get('/:plotId', auth, qrCodeController.getQRCode);

module.exports = router;
