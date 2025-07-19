const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot', required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QRCode', qrCodeSchema);
