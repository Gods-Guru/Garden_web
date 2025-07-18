const Feedback = require('../models/Feedback');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { garden, rating, comment } = req.body;
    const userId = req.user._id;
    const feedback = await Feedback.create({
      user: userId,
      garden,
      rating,
      comment
    });
    res.status(201).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get feedback for a garden
exports.getGardenFeedback = async (req, res) => {
  try {
    const { gardenId } = req.params;
    const feedbacks = await Feedback.find({ garden: gardenId }).populate('user');
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all feedback (admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user garden');
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
