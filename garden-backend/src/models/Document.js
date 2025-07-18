const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['id', 'residence', 'other'], required: true },
  url: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
