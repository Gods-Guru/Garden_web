const mongoose = require('mongoose');

const gardenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    location: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    settings: {
      isPublic: { type: Boolean, default: true },
      requiresApproval: { type: Boolean, default: false }
    },
    stats: {
      totalMembers: { type: Number, default: 1 },
      activeMembers: { type: Number, default: 1 }
    },
    contact: {
      email: String,
      phone: String
    },
    address: {
      city: String,
      state: String,
      country: String
    },
    geo: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    area: { type: String },
    numberOfPlots: { type: Number },
    rules: { type: String },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

gardenSchema.methods.isAtCapacity = function () {
  // Example capacity check
  return this.stats.activeMembers >= 50;
};

gardenSchema.methods.getOccupancyRate = function () {
  return (this.stats.activeMembers / this.stats.totalMembers) * 100;
};

// Add 2dsphere index for geospatial queries
gardenSchema.index({ geo: '2dsphere' });

module.exports = mongoose.model('Garden', gardenSchema);