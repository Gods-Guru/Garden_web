const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file']
    },
    url: String,
    filename: String,
    size: Number,
    mimeType: String
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  edited: {
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
    originalContent: String
  },
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: String,
    createdAt: { type: Date, default: Date.now }
  }],
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  pinned: {
    type: Boolean,
    default: false
  },
  pinnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pinnedAt: Date
}, {
  timestamps: true
});

const chatRoomSchema = new mongoose.Schema({
  garden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garden',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['general', 'announcements', 'events', 'tasks', 'marketplace', 'custom'],
    default: 'general'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { 
      type: String, 
      enum: ['member', 'moderator', 'admin'], 
      default: 'member' 
    },
    joinedAt: { type: Date, default: Date.now },
    lastRead: { type: Date, default: Date.now }
  }],
  messages: [messageSchema],
  settings: {
    allowFileUploads: { type: Boolean, default: true },
    allowImageUploads: { type: Boolean, default: true },
    maxFileSize: { type: Number, default: 10485760 }, // 10MB
    moderationEnabled: { type: Boolean, default: false },
    slowMode: { type: Number, default: 0 }, // seconds between messages
    pinnedMessages: { type: Number, default: 0 }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  messageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
chatRoomSchema.index({ garden: 1, type: 1 });
chatRoomSchema.index({ 'members.user': 1 });
chatRoomSchema.index({ lastActivity: -1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ sender: 1 });

// Methods
chatRoomSchema.methods.addMessage = function(messageData) {
  this.messages.push(messageData);
  this.messageCount += 1;
  this.lastActivity = new Date();
  return this.save();
};

chatRoomSchema.methods.addMember = function(userId, role = 'member') {
  const existingMember = this.members.find(m => m.user.toString() === userId.toString());
  if (!existingMember) {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
      lastRead: new Date()
    });
  }
  return this.save();
};

chatRoomSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(m => m.user.toString() !== userId.toString());
  return this.save();
};

chatRoomSchema.methods.updateLastRead = function(userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  if (member) {
    member.lastRead = new Date();
    return this.save();
  }
};

chatRoomSchema.methods.getUnreadCount = function(userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  if (!member) return 0;
  
  return this.messages.filter(msg => 
    msg.createdAt > member.lastRead && 
    msg.sender.toString() !== userId.toString()
  ).length;
};

// Static methods
chatRoomSchema.statics.createDefaultRooms = async function(gardenId, createdBy) {
  const defaultRooms = [
    {
      garden: gardenId,
      name: 'General Discussion',
      description: 'General chat for all garden members',
      type: 'general',
      createdBy: createdBy
    },
    {
      garden: gardenId,
      name: 'Announcements',
      description: 'Important announcements from garden administrators',
      type: 'announcements',
      createdBy: createdBy,
      settings: {
        moderationEnabled: true
      }
    },
    {
      garden: gardenId,
      name: 'Events & Activities',
      description: 'Discuss upcoming events and activities',
      type: 'events',
      createdBy: createdBy
    },
    {
      garden: gardenId,
      name: 'Tasks & Coordination',
      description: 'Coordinate garden tasks and maintenance',
      type: 'tasks',
      createdBy: createdBy
    }
  ];

  return await this.insertMany(defaultRooms);
};

// Pre-save middleware
chatRoomSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { ChatRoom, Message };
