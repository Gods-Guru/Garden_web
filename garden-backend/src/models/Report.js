const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  data: { type: Object },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
