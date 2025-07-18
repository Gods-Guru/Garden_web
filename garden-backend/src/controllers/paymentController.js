const Payment = require('../models/Payment');

// Create a new payment (fee or donation)
exports.createPayment = async (req, res) => {
  try {
    const { amount, type, gateway, reference } = req.body;
    const userId = req.user._id;
    const payment = await Payment.create({
      user: userId,
      amount,
      type,
      gateway,
      reference,
      status: 'pending'
    });
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all payments (admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user');
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user payment history
exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await Payment.find({ user: userId });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update payment status (webhook/admin)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, receiptUrl } = req.body;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ success: false, error: 'Not found' });
    payment.status = status;
    if (receiptUrl) payment.receiptUrl = receiptUrl;
    await payment.save();
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
