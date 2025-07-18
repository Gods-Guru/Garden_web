const express = require('express');
const router = express.Router();

// In-memory mock data for demonstration
let posts = [
  {
    id: '1',
    author: 'Admin',
    content: 'Welcome to the community garden!',
    createdAt: new Date().toISOString(),
    likes: 3,
    comments: 1
  }
];

// GET /api/posts - get all posts
router.get('/', (req, res) => {
  res.json({ posts });
});

// POST /api/posts - create a new post
router.post('/', (req, res) => {
  const { content } = req.body;
  const post = {
    id: String(posts.length + 1),
    author: 'Anonymous',
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: 0
  };
  posts.unshift(post);
  res.status(201).json({ post });
});

module.exports = router;
