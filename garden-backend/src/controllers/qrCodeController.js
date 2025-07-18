const QRCode = require('../models/QRCode');
const qrcode = require('qrcode');

// Generate QR code for a plot
exports.generateQRCode = async (req, res) => {
  try {
    const { plotId } = req.body;
    if (!plotId) return res.status(400).json({ success: false, error: 'plotId required' });
    const codeData = `plot:${plotId}`;
    const code = await qrcode.toDataURL(codeData);
    const qr = await QRCode.create({ plot: plotId, code });
    res.status(201).json({ success: true, qr });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get QR code for a plot
exports.getQRCode = async (req, res) => {
  try {
    const { plotId } = req.params;
    const qr = await QRCode.findOne({ plot: plotId });
    if (!qr) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, qr });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
