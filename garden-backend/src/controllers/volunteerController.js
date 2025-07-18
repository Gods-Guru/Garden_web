const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

// Register as a volunteer
exports.registerVolunteer = async (req, res) => {
  try {
    const userId = req.user._id;
    let volunteer = await Volunteer.findOne({ user: userId });
    if (volunteer) return res.status(400).json({ success: false, error: 'Already a volunteer' });
    volunteer = await Volunteer.create({ user: userId });
    res.status(201).json({ success: true, volunteer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all volunteers (admin/manager)
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate('user gardens');
    res.json({ success: true, volunteers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Assign badge to volunteer
exports.assignBadge = async (req, res) => {
  try {
    const { badge } = req.body;
    const { id } = req.params;
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) return res.status(404).json({ success: false, error: 'Not found' });
    volunteer.badges.push(badge);
    await volunteer.save();
    res.json({ success: true, volunteer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Track volunteer hours
exports.addHours = async (req, res) => {
  try {
    const { hours } = req.body;
    const { id } = req.params;
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) return res.status(404).json({ success: false, error: 'Not found' });
    volunteer.hours += Number(hours);
    await volunteer.save();
    res.json({ success: true, volunteer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
