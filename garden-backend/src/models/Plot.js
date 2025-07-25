const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  number: { type: String, required: true },

  // Enhanced size information
  size: {
    width: { type: Number }, // in feet
    height: { type: Number },
    area: { type: Number }, // calculated field
    description: { type: String } // e.g., "4x8 feet"
  },

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedAt: { type: Date },

  // Enhanced status
  status: {
    type: String,
    enum: ['available', 'assigned', 'reserved', 'maintenance', 'inactive'],
    default: 'available'
  },

  // Plot location within garden
  location: {
    section: String, // e.g., "North Section", "Section A"
    row: String,
    position: String
  },

  // Plot features
  features: {
    hasWater: { type: Boolean, default: false },
    hasShed: { type: Boolean, default: false },
    hasCompost: { type: Boolean, default: false },
    hasFencing: { type: Boolean, default: false },
    soilType: {
      type: String,
      enum: ['clay', 'sandy', 'loam', 'silt', 'mixed'],
      default: 'loam'
    },
    sunExposure: {
      type: String,
      enum: ['full-sun', 'partial-sun', 'partial-shade', 'full-shade'],
      default: 'full-sun'
    }
  },

  // Current crops
  currentCrops: [{
    name: String,
    variety: String,
    plantedDate: Date,
    expectedHarvestDate: Date,
    status: {
      type: String,
      enum: ['planted', 'growing', 'flowering', 'fruiting', 'harvested', 'failed'],
      default: 'planted'
    },
    notes: String
  }],

  plants: [{ type: String }], // Keep for backward compatibility
  waterLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WaterLog' }],
  notes: { type: String },
  cropType: { type: String },
  image: { type: String },
  // Enhanced history
  history: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: {
      type: String,
      enum: ['assigned', 'unassigned', 'planted', 'harvested', 'maintenance', 'note', 'watered', 'weeded']
    },
    description: String,
    date: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Enhanced media
  progressPhotos: [{
    url: String,
    caption: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
    tags: [String]
  }],

  requests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['change', 'release', 'maintenance', 'feature'] },
    description: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    createdAt: { type: Date, default: Date.now }
  }],

  // Maintenance tracking
  maintenance: {
    lastWatered: Date,
    lastWeeded: Date,
    lastFertilized: Date,
    nextMaintenance: Date,
    schedule: {
      watering: { frequency: String, days: [Number] }, // days of week
      weeding: { frequency: String, interval: Number }, // weeks
      fertilizing: { frequency: String, interval: Number } // months
    }
  },

  // Pricing (if applicable)
  pricing: {
    fee: { type: Number, default: 0 },
    period: { type: String, enum: ['monthly', 'yearly', 'one-time'], default: 'yearly' },
    paidUntil: Date,
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue', 'free'],
      default: 'free'
    }
  }
}, {
  timestamps: true
});

// Indexes
plotSchema.index({ garden: 1, number: 1 }, { unique: true });
plotSchema.index({ assignedTo: 1 });
plotSchema.index({ status: 1 });

// Methods
plotSchema.methods.isAssigned = function() {
  return this.status === 'assigned' && this.assignedTo;
};

plotSchema.methods.isAvailable = function() {
  return this.status === 'available' && !this.assignedTo;
};

plotSchema.methods.canUserAccess = function(userId) {
  return this.assignedTo && this.assignedTo.toString() === userId.toString();
};

plotSchema.methods.addHistory = function(action, description, userId, metadata = {}) {
  this.history.push({
    user: userId,
    action,
    description,
    metadata
  });
  return this.save();
};

module.exports = mongoose.model('Plot', plotSchema);
