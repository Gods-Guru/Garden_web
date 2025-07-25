const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/auth');

// Create payment (user)
router.post('/', requireAuth, paymentController.createPayment);

// Get all payments (admin)
router.get('/', requireAuth, paymentController.getAllPayments);

// Get user payment history
router.get('/my', requireAuth, paymentController.getUserPayments);

// Update payment status (admin/webhook)
router.patch('/:id/status', requireAuth, paymentController.updatePaymentStatus);

module.exports = router;
