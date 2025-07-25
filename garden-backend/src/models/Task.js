const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot' },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },

  // Enhanced assignment - support multiple assignees
  assignedTo: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['assignee', 'reviewer', 'observer'], default: 'assignee' }
  }],

  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled', 'overdue'], default: 'pending' },
  dueDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },

  // Enhanced task details
  category: {
    type: String,
    enum: [
      'planting', 'watering', 'weeding', 'harvesting', 'maintenance',
      'composting', 'pest-control', 'fertilizing', 'pruning', 'cleanup',
      'event-setup', 'education', 'administration', 'other'
    ],
    default: 'other'
  },

  // Timing
  estimatedDuration: { type: Number }, // in minutes
  actualDuration: { type: Number },
  startedAt: { type: Date },
  completedAt: { type: Date },

  // Requirements
  requirements: {
    tools: [String],
    materials: [String],
    minVolunteers: { type: Number, default: 1 },
    maxVolunteers: { type: Number, default: 5 }
  },

  // Progress tracking
  progress: {
    percentage: { type: Number, min: 0, max: 100, default: 0 },
    checkpoints: [{
      name: String,
      completed: { type: Boolean, default: false },
      completedAt: Date,
      completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
  },
  // Enhanced comments
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false } // for admin/manager only comments
  }],

  updates: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: String,
    note: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Media attachments
  attachments: [{
    type: { type: String, enum: ['image', 'document', 'video', 'link'] },
    url: String,
    filename: String,
    description: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Completion details
  completion: {
    summary: String,
    issues: String,
    recommendations: String,
    rating: { type: Number, min: 1, max: 5 },
    photos: [{
      url: String,
      caption: String,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },

  // Tags and metadata
  tags: [String],
  weatherDependent: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },

  // Recurring tasks
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    interval: { type: Number, default: 1 },
    nextOccurrence: Date
  }
}, {
  timestamps: true
});

// Indexes
taskSchema.index({ garden: 1, status: 1 });
taskSchema.index({ 'assignedTo.user': 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ priority: 1 });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'completed';
});

// Methods
taskSchema.methods.isAssignedTo = function(userId) {
  return this.assignedTo.some(assignment =>
    assignment.user.toString() === userId.toString()
  );
};

taskSchema.methods.markCompleted = function(userId, completionData = {}) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.progress.percentage = 100;

  if (completionData.summary) this.completion.summary = completionData.summary;
  if (completionData.issues) this.completion.issues = completionData.issues;
  if (completionData.rating) this.completion.rating = completionData.rating;

  return this.save();
};

module.exports = mongoose.model('Task', taskSchema);
