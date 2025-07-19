const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Create payment (user)
router.post('/', auth, paymentController.createPayment);

// Get all payments (admin)
router.get('/', auth, paymentController.getAllPayments);

// Get user payment history
router.get('/my', auth, paymentController.getUserPayments);

// Update payment status (admin/webhook)
router.patch('/:id/status', auth, paymentController.updatePaymentStatus);

module.exports = router;
