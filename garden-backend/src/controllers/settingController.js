const Setting = require('../models/Setting');

// Get all settings (admin)
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a setting (admin)
exports.updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    let setting = await Setting.findOne({ key });
    if (!setting) {
      setting = await Setting.create({ key, value });
    } else {
      setting.value = value;
      setting.updatedAt = new Date();
      await setting.save();
    }
    res.json({ success: true, setting });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
