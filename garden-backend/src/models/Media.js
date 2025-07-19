const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden' },
  plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot' },
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video', 'document'], required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', mediaSchema);
