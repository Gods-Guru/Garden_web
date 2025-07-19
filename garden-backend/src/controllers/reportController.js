const Report = require('../models/Report');

// Generate a report (admin/manager)
exports.generateReport = async (req, res) => {
  try {
    const { type, data } = req.body;
    const userId = req.user._id;
    const report = await Report.create({
      type,
      data,
      generatedBy: userId
    });
    res.status(201).json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all reports (admin/manager)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('generatedBy');
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
