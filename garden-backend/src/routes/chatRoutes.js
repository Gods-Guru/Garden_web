const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  getGardenChatRooms,
  getChatMessages,
  sendMessage,
  createChatRoom,
  joinChatRoom,
  leaveChatRoom,
  addReaction
} = require('../controllers/chatController');

// Get all chat rooms for a garden
router.get('/garden/:gardenId/rooms', requireAuth, getGardenChatRooms);

// Create a new chat room
router.post('/garden/:gardenId/rooms', requireAuth, createChatRoom);

// Get messages from a specific chat room
router.get('/rooms/:roomId/messages', requireAuth, getChatMessages);

// Send a message to a chat room
router.post('/rooms/:roomId/messages', requireAuth, sendMessage);

// Join a chat room
router.post('/rooms/:roomId/join', requireAuth, joinChatRoom);

// Leave a chat room
router.post('/rooms/:roomId/leave', requireAuth, leaveChatRoom);

// Add/remove reaction to a message
router.post('/rooms/:roomId/messages/:messageId/reactions', requireAuth, addReaction);

module.exports = router;
