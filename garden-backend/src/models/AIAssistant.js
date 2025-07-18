const mongoose = require('mongoose');

const aiAssistantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: { type: String, required: true },
  answer: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIAssistant', aiAssistantSchema);
