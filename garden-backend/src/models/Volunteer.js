const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gardens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Garden' }],
  hours: { type: Number, default: 0 },
  badges: [{ type: String }],
  joinedAt: { type: Date, default: Date.now },
  performance: { type: String },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
