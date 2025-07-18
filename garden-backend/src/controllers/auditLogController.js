const AuditLog = require('../models/AuditLog');

// Log an action
exports.logAction = async (userId, action, targetType, targetId, details) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      targetType,
      targetId,
      details
    });
  } catch (err) {
    // Optionally log error
  }
};

// Get all audit logs (admin)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('user').sort({ createdAt: -1 });
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
