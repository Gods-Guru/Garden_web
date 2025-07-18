const express = require('express');
const router = express.Router();

// Import your models (adjusted to actual filenames)
const User = require('../models/User');
const CommunityPost = require('../models/CommunityPost');
const Event = require('../models/Event');

// GET /api/community/stats
router.get('/stats', async (req, res) => {
  try {
    // Count active members (e.g., users who logged in within last 30 days)
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const activeMembers = await User.countDocuments({ lastLogin: { $gte: since } });

    // Count posts today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const postsToday = await CommunityPost.countDocuments({ createdAt: { $gte: today } });

    // Count upcoming events (events with date >= today)
    const upcomingEvents = await Event.countDocuments({ date: { $gte: today } });

    // Calculate questions answered (example: posts with isQuestion: true and answered: true)
    const totalQuestions = await CommunityPost.countDocuments({ isQuestion: true });
    const answeredQuestions = await CommunityPost.countDocuments({ isQuestion: true, answered: true });
    const questionsAnswered = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) + '%' : '0%';

    res.json({
      stats: {
        activeMembers,
        postsToday,
        upcomingEvents,
        questionsAnswered
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch community stats', error: err.message });
  }
});

module.exports = router;
