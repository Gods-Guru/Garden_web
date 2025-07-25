const mongoose = require('mongoose');

const gardenRoleSchema = new mongoose.Schema({
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden' },
  role: {
    type: String,
    enum: [
      'garden_coordinator',
      'plot_coordinator',
      'supply_crew',
      'events_coordinator',
      'treasurer'
    ]
  }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    // Email verification
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerifiedAt: {
      type: Date
    },

    // Phone number for 2FA
    phone: {
      type: String,
      trim: true
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    phoneVerifiedAt: {
      type: Date
    },

    password: {
      type: String,
      required: true
    },

    // Two-factor authentication
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorMethod: {
      type: String,
      enum: ['email', 'sms'],
      default: 'email'
    },

    // Profile information
    profilePicture: {
      type: String // URL to profile image
    },
    bio: {
      type: String,
      maxlength: 500
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: '2dsphere'
        }
      }
    },

    // Preferences
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true }
      },
      privacy: {
        showProfile: { type: Boolean, default: true },
        showLocation: { type: Boolean, default: false },
        showPlots: { type: Boolean, default: true }
      }
    },

    // Activity tracking
    lastActive: {
      type: Date,
      default: Date.now
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['guest', 'user', 'garden_manager', 'admin'],
      default: 'user'
    },

    // Garden-specific roles
    gardenRoles: [{
      garden: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garden'
      },
      role: {
        type: String,
        enum: ['member', 'plot_owner', 'volunteer', 'manager', 'admin'],
        default: 'member'
      },
      assignedAt: {
        type: Date,
        default: Date.now
      }
    }],
    gardenRoles: [gardenRoleSchema],
    gardens: [
    {
      gardenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden' },
      role: { type: String, enum: ['owner', 'coordinator', 'member'], default: 'member' },
      status: { type: String, enum: ['active', 'pending', 'rejected'], default: 'active' },
      joinedAt: { type: Date, default: Date.now }
    }
    ],
    phone: { type: String },
    profilePicture: { type: String },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
    oauthProvider: { type: String },
    oauthId: { type: String }
    },
  {
    timestamps: true
  }
);

userSchema.methods.getRoleInGarden = function (gardenId) {
  const garden = this.gardens.find(g => g.gardenId.toString() === gardenId.toString());
  return garden ? garden.role : null;
};

module.exports = mongoose.model('User', userSchema);