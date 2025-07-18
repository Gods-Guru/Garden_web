const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot' },
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled', 'overdue'], default: 'pending' },
  dueDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  updates: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: String,
    note: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Task', taskSchema);
