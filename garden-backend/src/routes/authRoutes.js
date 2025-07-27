const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  verify2FA,
  getCurrentUser
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Authentication routes
router.post('/register', register);
router.post('/login', login);

// Get current user (protected route)
router.get('/me', requireAuth, getCurrentUser);

// Verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/verify-2fa', verify2FA);

module.exports = router;