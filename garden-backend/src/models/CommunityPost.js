const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  garden: { type: mongoose.Schema.Types.ObjectId, ref: 'Garden', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  comments: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
