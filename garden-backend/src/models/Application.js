const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
});

module.exports = mongoose.model('Application', applicationSchema);
