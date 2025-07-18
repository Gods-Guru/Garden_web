const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden' },
  plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot' },
  type: { type: String, enum: ['task', 'meeting', 'volunteer', 'event', 'watering'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  reminder: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
