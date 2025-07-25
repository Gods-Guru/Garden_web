const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Sender (optional - system notifications won't have a sender)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Notification type
  type: {
    type: String,
    enum: [
      'task_assigned', 'task_completed', 'task_overdue', 'task_reminder',
      'application_approved', 'application_rejected', 'application_received',
      'plot_assigned', 'plot_available', 'plot_maintenance',
      'event_created', 'event_reminder', 'event_cancelled', 'event_updated',
      'post_liked', 'post_commented', 'post_mentioned',
      'payment_due', 'payment_received', 'payment_overdue',
      'garden_announcement', 'garden_invitation', 'garden_role_changed',
      'system_maintenance', 'system_update', 'welcome',
      'weather_alert', 'harvest_reminder', 'watering_reminder'
    ],
    required: true
  },

  // Content
  title: {
    type: String,
    required: true,
    maxlength: 200
  },

  message: {
    type: String,
    required: true,
    maxlength: 1000
  },

  // Rich content
  data: {
    // Related entities
    garden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Garden'
    },
    plot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plot'
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },

    // Action data
    actionUrl: String, // URL to navigate to when clicked
    actionText: String, // Text for action button

    // Additional metadata
    metadata: mongoose.Schema.Types.Mixed
  },

  // Status
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },

  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Delivery channels
  channels: {
    inApp: {
      enabled: { type: Boolean, default: true },
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      readAt: Date
    },
    email: {
      enabled: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      opened: { type: Boolean, default: false },
      openedAt: Date,
      emailId: String
    },
    sms: {
      enabled: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      smsId: String
    }
  },

  // Scheduling
  scheduledFor: {
    type: Date,
    default: Date.now
  },

  expiresAt: {
    type: Date
  },

  // Legacy fields for backward compatibility
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ 'data.garden': 1 });

// Virtual for is read
notificationSchema.virtual('isRead').get(function() {
  return this.status === 'read' || this.read; // Support legacy field
});

// Methods
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.read = true; // Support legacy field
  if (this.channels.inApp.enabled && !this.channels.inApp.readAt) {
    this.channels.inApp.readAt = new Date();
  }
  return this.save();
};

notificationSchema.methods.markAsArchived = function() {
  this.status = 'archived';
  return this.save();
};

// Static methods
notificationSchema.statics.createNotification = function(data) {
  const notification = new this({
    recipient: data.recipient || data.user, // Support legacy field
    user: data.recipient || data.user, // Support legacy field
    sender: data.sender,
    type: data.type,
    title: data.title,
    message: data.message,
    data: data.data || {},
    priority: data.priority || 'normal',
    channels: data.channels || { inApp: { enabled: true } },
    scheduledFor: data.scheduledFor || new Date()
  });

  return notification.save();
};

notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    $or: [
      { recipient: userId, status: 'unread' },
      { user: userId, read: false } // Support legacy field
    ]
  });
};

module.exports = mongoose.model('Notification', notificationSchema);
