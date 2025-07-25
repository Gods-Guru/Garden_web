const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  description: {
    type: String,
    maxlength: 2000
  },

  // Event details
  type: {
    type: String,
    enum: [
      'workshop', 'volunteer-day', 'harvest-festival', 'planting-day',
      'maintenance', 'meeting', 'social', 'educational', 'fundraiser', 'other'
    ],
    required: true
  },

  // Timing
  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  isAllDay: {
    type: Boolean,
    default: false
  },

  // Location
  garden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garden',
    required: true
  },

  location: {
    specific: String, // e.g., "North Section", "Community Center"
    address: String, // if different from garden address
    isVirtual: { type: Boolean, default: false },
    virtualLink: String
  },

  // Organization
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Capacity and registration
  capacity: {
    maxAttendees: Number,
    currentAttendees: { type: Number, default: 0 },
    waitlistEnabled: { type: Boolean, default: false }
  },

  registration: {
    required: { type: Boolean, default: false },
    deadline: Date,
    fee: { type: Number, default: 0 },
    instructions: String
  },

  // Attendees
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'no-show', 'cancelled'],
      default: 'registered'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],

  waitlist: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    position: Number
  }],

  // Event content
  agenda: [{
    time: String, // e.g., "10:00 AM"
    activity: String,
    duration: Number, // in minutes
    presenter: String
  }],

  requirements: {
    tools: [String],
    materials: [String],
    skills: [String],
    whatToBring: [String]
  },

  // Media
  images: [{
    url: String,
    caption: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Status and visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },

  visibility: {
    type: String,
    enum: ['public', 'members-only', 'private'],
    default: 'public'
  },

  // Weather considerations
  weatherDependent: {
    type: Boolean,
    default: true
  },

  rainPlan: {
    type: String,
    maxlength: 500
  },

  // Feedback and follow-up
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Tags for organization
  tags: [String],

  // Contact information
  contact: {
    email: String,
    phone: String,
    website: String
  }
}, {
  timestamps: true
});

// Indexes
eventSchema.index({ garden: 1, startDate: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1, visibility: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.capacity.maxAttendees) return null;
  return this.capacity.maxAttendees - this.capacity.currentAttendees;
});

eventSchema.virtual('isFull').get(function() {
  if (!this.capacity.maxAttendees) return false;
  return this.capacity.currentAttendees >= this.capacity.maxAttendees;
});

// Methods
eventSchema.methods.isOrganizer = function(userId) {
  return this.organizer.toString() === userId.toString() ||
         this.coOrganizers.some(coOrg => coOrg.toString() === userId.toString());
};

eventSchema.methods.isUserRegistered = function(userId) {
  return this.attendees.some(attendee =>
    attendee.user.toString() === userId.toString()
  );
};

eventSchema.methods.canUserRegister = function(userId) {
  if (this.isUserRegistered(userId)) return false;
  if (this.registration.deadline && new Date() > this.registration.deadline) return false;
  return !this.isFull || this.capacity.waitlistEnabled;
};

eventSchema.methods.registerUser = function(userId) {
  if (!this.canUserRegister(userId)) {
    throw new Error('User cannot register for this event');
  }

  if (this.isFull && this.capacity.waitlistEnabled) {
    const position = this.waitlist.length + 1;
    this.waitlist.push({ user: userId, position });
  } else {
    this.attendees.push({ user: userId });
    this.capacity.currentAttendees += 1;
  }

  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
