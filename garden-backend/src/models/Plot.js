const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  number: { type: String, required: true },
  size: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'vacant', 'maintenance', 'reserved'], default: 'vacant' },
  plants: [{ type: String }],
  waterLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WaterLog' }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  cropType: { type: String },
  image: { type: String },
  history: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    date: { type: Date, default: Date.now }
  }],
  progressPhotos: [{ url: String, uploadedAt: { type: Date, default: Date.now } }],
  requests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['change', 'release'] },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Plot', plotSchema);
