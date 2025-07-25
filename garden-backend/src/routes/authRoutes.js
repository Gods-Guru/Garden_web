const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  verify2FA
} = require('../controllers/authController');

// Authentication routes
router.post('/register', register);
router.post('/login', login);

// Verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/verify-2fa', verify2FA);

module.exports = router;