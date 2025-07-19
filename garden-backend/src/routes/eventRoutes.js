const express = require('express');
const router = express.Router();

// In-memory mock data for demonstration
let events = [
  {
    id: '1',
    title: 'Spring Planting Day',
    date: '2025-08-01',
    time: '10:00 AM',
    description: 'Join us for a community planting event!'
  }
];

// GET /api/events - get all events
router.get('/', (req, res) => {
  res.json({ events });
});

// POST /api/events - create a new event (optional, for admin use)
router.post('/', (req, res) => {
  const { title, date, time, description } = req.body;
  const event = {
    id: String(events.length + 1),
    title,
    date,
    time,
    description
  };
  events.unshift(event);
  res.status(201).json({ event });
});

module.exports = router;
