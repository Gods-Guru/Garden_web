const Schedule = require('../models/Schedule');

// Create a schedule/reminder
exports.createSchedule = async (req, res) => {
  try {
    const { garden, plot, type, title, description, date, reminder } = req.body;
    const userId = req.user._id;
    const schedule = await Schedule.create({
      user: userId,
      garden,
      plot,
      type,
      title,
      description,
      date,
      reminder
    });
    res.status(201).json({ success: true, schedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get schedules for a user
exports.getUserSchedules = async (req, res) => {
  try {
    const userId = req.user._id;
    const schedules = await Schedule.find({ user: userId }).sort({ date: 1 });
    res.json({ success: true, schedules });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all schedules (admin/manager)
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('user garden plot');
    res.json({ success: true, schedules });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
