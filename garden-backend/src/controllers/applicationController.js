const Application = require('../models/Application');
const Plot = require('../models/Plot');
const Garden = require('../models/Garden');
const User = require('../models/User');

// Submit a new plot application
exports.applyForPlot = async (req, res) => {
  try {
    const { gardenId, plotId, message } = req.body;
    const userId = req.user._id;
    const application = await Application.create({
      user: userId,
      garden: gardenId,
      plot: plotId,
      message
    });
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all applications (admin/manager)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('user garden plot reviewedBy');
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Review (approve/reject) an application
exports.reviewApplication = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ success: false, error: 'Not found' });
    application.status = status;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get applications for a user
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await Application.find({ user: userId }).populate('garden plot');
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
