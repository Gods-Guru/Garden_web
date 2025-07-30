const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to user

    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

module.exports = router;
