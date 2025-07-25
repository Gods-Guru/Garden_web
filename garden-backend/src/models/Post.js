const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Basic information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  
  // Author
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Context
  garden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garden',
    required: true
  },
  
  // Post type and category
  type: {
    type: String,
    enum: ['discussion', 'question', 'announcement', 'tip', 'showcase', 'event', 'marketplace'],
    default: 'discussion'
  },
  
  category: {
    type: String,
    enum: [
      'general', 'planting', 'harvesting', 'pest-control', 'composting',
      'tools', 'weather', 'events', 'marketplace', 'help', 'success-stories'
    ],
    default: 'general'
  },
  
  // Content metadata
  tags: [String],
  
  // Media attachments
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'link']
    },
    url: String,
    filename: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Engagement
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  views: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    },
    ipAddress: String
  }],
  
  // Comments
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    attachments: [{
      type: String,
      url: String,
      filename: String
    }],
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      likedAt: {
        type: Date,
        default: Date.now
      }
    }],
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: 500
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      likes: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        likedAt: {
          type: Date,
          default: Date.now
        }
      }]
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    isEdited: {
      type: Boolean,
      default: false
    }
  }],
  
  // Status and moderation
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'flagged', 'removed'],
    default: 'published'
  },
  
  moderation: {
    flagged: {
      type: Boolean,
      default: false
    },
    flaggedBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: String,
      flaggedAt: {
        type: Date,
        default: Date.now
      }
    }],
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    moderationNotes: String
  },
  
  // Visibility and permissions
  visibility: {
    type: String,
    enum: ['public', 'members-only', 'private'],
    default: 'public'
  },
  
  allowComments: {
    type: Boolean,
    default: true
  },
  
  // Featured content
  featured: {
    isFeatured: {
      type: Boolean,
      default: false
    },
    featuredAt: Date,
    featuredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Analytics
  analytics: {
    totalViews: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 }
  },
  
  // SEO and metadata
  slug: {
    type: String,
    unique: true
  },
  
  metaDescription: String,
  
  // Scheduling
  publishedAt: {
    type: Date,
    default: Date.now
  },
  
  scheduledFor: Date,
  
  // Related content
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  
  // Edit history
  editHistory: [{
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: {
      type: Date,
      default: Date.now
    },
    changes: String,
    previousContent: String
  }]
}, {
  timestamps: true
});

// Indexes
postSchema.index({ garden: 1, status: 1, publishedAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ slug: 1 });
postSchema.index({ 'featured.isFeatured': 1, 'featured.featuredAt': -1 });
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for view count
postSchema.virtual('viewCount').get(function() {
  return this.views.length;
});

// Methods
postSchema.methods.isAuthor = function(userId) {
  return this.author.toString() === userId.toString();
};

postSchema.methods.canUserEdit = function(userId, userRole) {
  if (this.isAuthor(userId)) return true;
  if (['admin', 'garden_manager'].includes(userRole)) return true;
  return false;
};

postSchema.methods.canUserDelete = function(userId, userRole) {
  if (this.isAuthor(userId)) return true;
  if (['admin', 'garden_manager'].includes(userRole)) return true;
  return false;
};

postSchema.methods.hasUserLiked = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

postSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => 
    like.user.toString() === userId.toString()
  );
  
  if (existingLike) {
    this.likes.pull(existingLike._id);
    this.analytics.totalLikes -= 1;
  } else {
    this.likes.push({ user: userId });
    this.analytics.totalLikes += 1;
  }
  
  return this.save();
};

postSchema.methods.addView = function(userId, ipAddress) {
  // Don't count multiple views from same user within 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentView = this.views.find(view => 
    view.user && view.user.toString() === userId.toString() && 
    view.viewedAt > oneDayAgo
  );
  
  if (!recentView) {
    this.views.push({ user: userId, ipAddress });
    this.analytics.totalViews += 1;
    return this.save();
  }
  
  return Promise.resolve(this);
};

postSchema.methods.addComment = function(authorId, content, attachments = []) {
  const comment = {
    author: authorId,
    content,
    attachments
  };
  
  this.comments.push(comment);
  this.analytics.totalComments += 1;
  
  return this.save();
};

// Pre-save middleware to generate slug
postSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
    
    // Add timestamp to ensure uniqueness
    this.slug += '-' + Date.now();
  }
  
  // Update analytics
  this.analytics.engagementScore = 
    (this.analytics.totalLikes * 2) + 
    (this.analytics.totalComments * 3) + 
    (this.analytics.totalViews * 1) + 
    (this.analytics.totalShares * 4);
  
  next();
});

module.exports = mongoose.model('Post', postSchema);
