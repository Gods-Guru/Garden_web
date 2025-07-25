const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Basic information
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot' },

  // Application type
  type: {
    type: String,
    enum: ['plot', 'volunteer', 'membership', 'event'],
    default: 'plot'
  },

  // Enhanced status
  status: {
    type: String,
    enum: ['pending', 'under-review', 'approved', 'rejected', 'waitlisted', 'withdrawn'],
    default: 'pending'
  },

  // Application details
  motivation: {
    type: String,
    maxlength: 1000
  },

  experience: {
    gardeningExperience: {
      type: String,
      enum: ['none', 'beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    previousGardens: String,
    specialSkills: [String],
    yearsOfExperience: Number
  },

  // Plot preferences
  plotPreferences: {
    preferredSize: String,
    preferredLocation: String,
    numberOfPlots: { type: Number, default: 1 },
    specificPlots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plot' }]
  },

  // Volunteer preferences
  volunteerPreferences: {
    availability: {
      weekdays: [String],
      weekends: Boolean,
      timeSlots: [String]
    },
    skills: [String],
    interests: [String],
    hoursPerWeek: Number
  },

  // Commitment
  commitment: {
    duration: {
      type: String,
      enum: ['3-months', '6-months', '1-year', '2-years', 'long-term'],
      default: '1-year'
    },
    timeCommitment: {
      hoursPerWeek: Number,
      flexibleSchedule: Boolean
    },
    agreesToRules: { type: Boolean, default: false },
    agreesToFees: { type: Boolean, default: true }
  },

  // Review process
  review: {
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    score: { type: Number, min: 1, max: 10 },
    notes: String,
    recommendation: {
      type: String,
      enum: ['approve', 'reject', 'waitlist', 'needs-more-info']
    }
  },

  // Assignment (if approved)
  assignment: {
    assignedPlots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plot' }],
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    startDate: Date,
    orientation: {
      completed: Boolean,
      completedDate: Date,
      completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  },

  // Waitlist information
  waitlist: {
    position: Number,
    addedToWaitlistAt: Date,
    estimatedWaitTime: String,
    notifyWhenAvailable: { type: Boolean, default: true }
  },

  // Communication
  communications: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: String,
    message: String,
    sentAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],

  // Payment information
  payment: {
    feeRequired: { type: Boolean, default: false },
    amount: Number,
    paid: { type: Boolean, default: false },
    paidAt: Date,
    paymentMethod: String,
    transactionId: String
  },

  // Metadata
  source: {
    type: String,
    enum: ['website', 'referral', 'event', 'social-media', 'other'],
    default: 'website'
  },

  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],

  // Legacy field for backward compatibility
  message: { type: String }
}, {
  timestamps: true
});

// Indexes
applicationSchema.index({ applicant: 1, garden: 1, type: 1 });
applicationSchema.index({ garden: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: 1 });

// Methods
applicationSchema.methods.canUserEdit = function(userId) {
  return this.applicant.toString() === userId.toString() &&
         ['pending', 'under-review'].includes(this.status);
};

applicationSchema.methods.approve = function(reviewerId, assignmentData = {}) {
  this.status = 'approved';
  this.review.reviewedBy = reviewerId;
  this.review.reviewedAt = new Date();
  this.review.recommendation = 'approve';

  if (assignmentData.plots) {
    this.assignment.assignedPlots = assignmentData.plots;
  }
  if (assignmentData.startDate) {
    this.assignment.startDate = assignmentData.startDate;
  }

  return this.save();
};

applicationSchema.methods.reject = function(reviewerId, reason) {
  this.status = 'rejected';
  this.review.reviewedBy = reviewerId;
  this.review.reviewedAt = new Date();
  this.review.recommendation = 'reject';
  this.review.notes = reason;

  return this.save();
};

module.exports = mongoose.model('Application', applicationSchema);
