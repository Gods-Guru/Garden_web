const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['fee', 'donation'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  reference: { type: String },
  gateway: { type: String },
  createdAt: { type: Date, default: Date.now },
  receiptUrl: { type: String }
});

module.exports = mongoose.model('Payment', paymentSchema);
