const mongoose = require('mongoose');

const gardenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  description: {
    type: String,
    required: true,
    maxlength: 1000
  },

  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: String,
    country: {
      type: String,
      default: 'United States'
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: '2dsphere'
      }
    }
  },

  // Garden details
  totalArea: {
    type: Number, // in square feet
    required: true
  },

  totalPlots: {
    type: Number,
    required: true,
    min: 1
  },

  plotSize: {
    width: { type: Number, required: true }, // in feet
    height: { type: Number, required: true }
  },

  // Management
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Enhanced settings
    settings: {
      isPublic: { type: Boolean, default: true },
      requiresApproval: { type: Boolean, default: false },
      allowVolunteers: { type: Boolean, default: true },
      plotFee: {
        amount: { type: Number, default: 0 },
        period: { type: String, enum: ['monthly', 'yearly', 'one-time'], default: 'yearly' }
      },
      maxPlotsPerUser: { type: Number, default: 2 }
    },

    // Enhanced stats
    stats: {
      totalMembers: { type: Number, default: 1 },
      activeMembers: { type: Number, default: 1 },
      activePlots: { type: Number, default: 0 },
      totalTasks: { type: Number, default: 0 },
      completedTasks: { type: Number, default: 0 },
      totalEvents: { type: Number, default: 0 }
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

    // Enhanced rules
    rules: [{
      title: String,
      description: String
    }],

    guidelines: {
      type: String,
      maxlength: 2000
    },

    // Enhanced managers with permissions
    managers: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      assignedAt: { type: Date, default: Date.now },
      permissions: {
        managePlots: { type: Boolean, default: true },
        manageUsers: { type: Boolean, default: true },
        manageTasks: { type: Boolean, default: true },
        manageEvents: { type: Boolean, default: true },
        moderateContent: { type: Boolean, default: true }
      }
    }],

    // Media gallery
    images: [{
      url: String,
      caption: String,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now }
    }],

    // Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'closed'],
      default: 'active'
    },

    // Operating hours
    operatingHours: {
      monday: { open: String, close: String, closed: { type: Boolean, default: false } },
      tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
      friday: { open: String, close: String, closed: { type: Boolean, default: false } },
      saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
      sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
    }
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