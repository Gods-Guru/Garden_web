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
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    gardenRoles: [gardenRoleSchema],
    gardens: [
    {
      gardenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden' },
      role: { type: String, enum: ['owner', 'coordinator', 'member'], default: 'member' },
      status: { type: String, enum: ['active', 'pending', 'rejected'], default: 'active' },
      joinedAt: { type: Date, default: Date.now }
    }
    ]
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