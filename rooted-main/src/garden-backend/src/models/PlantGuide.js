const mongoose = require('mongoose');

const plantGuideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, // e.g., vegetable, herb, fruit
  careInstructions: { type: String },
  season: { type: String },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlantGuide', plantGuideSchema);
