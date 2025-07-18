const mongoose = require('mongoose');

const waterLogSchema = new mongoose.Schema({
  plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true }, // e.g., liters or gallons
  method: { type: String }, // e.g., hand, drip, sprinkler
  notes: { type: String }
});

module.exports = mongoose.model('WaterLog', waterLogSchema);
