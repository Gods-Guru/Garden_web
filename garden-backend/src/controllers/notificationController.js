const Notification = require('../models/Notification');

// Send a notification to a user
exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, message, data } = req.body;
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      data
    });
    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ success: false, error: 'Not found' });
    notification.read = true;
    await notification.save();
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
