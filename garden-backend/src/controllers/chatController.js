const { ChatRoom, Message } = require('../models/Chat');
const User = require('../models/User');
const Garden = require('../models/Garden');
const { catchAsync, AppError } = require('../middleware/errorHandler');

/**
 * Get all chat rooms for a garden
 */
const getGardenChatRooms = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;
  const userId = req.user.id;

  // Verify user has access to this garden
  const user = await User.findById(userId);
  const userGarden = user.gardens.find(g => g.gardenId.toString() === gardenId);
  
  if (!userGarden) {
    return next(new AppError('Access denied to this garden', 403));
  }

  const chatRooms = await ChatRoom.find({ 
    garden: gardenId,
    $or: [
      { isPrivate: false },
      { 'members.user': userId }
    ]
  })
  .populate('createdBy', 'name email profilePicture')
  .populate('members.user', 'name email profilePicture')
  .sort({ type: 1, name: 1 });

  // Add unread count for each room
  const roomsWithUnread = chatRooms.map(room => ({
    ...room.toObject(),
    unreadCount: room.getUnreadCount(userId)
  }));

  res.json({
    success: true,
    data: roomsWithUnread
  });
});

/**
 * Get messages from a specific chat room
 */
const getChatMessages = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user.id;

  const chatRoom = await ChatRoom.findById(roomId)
    .populate('messages.sender', 'name email profilePicture')
    .populate('messages.replyTo');

  if (!chatRoom) {
    return next(new AppError('Chat room not found', 404));
  }

  // Check if user is a member of this room
  const isMember = chatRoom.members.some(m => m.user.toString() === userId);
  if (chatRoom.isPrivate && !isMember) {
    return next(new AppError('Access denied to this chat room', 403));
  }

  // Get paginated messages
  const skip = (page - 1) * limit;
  const messages = chatRoom.messages
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(skip, skip + parseInt(limit))
    .reverse();

  // Update user's last read timestamp
  await chatRoom.updateLastRead(userId);

  res.json({
    success: true,
    data: {
      room: {
        id: chatRoom._id,
        name: chatRoom.name,
        description: chatRoom.description,
        type: chatRoom.type,
        memberCount: chatRoom.members.length
      },
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: chatRoom.messages.length,
        hasMore: skip + parseInt(limit) < chatRoom.messages.length
      }
    }
  });
});

/**
 * Send a message to a chat room
 */
const sendMessage = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;
  const { content, type = 'text', replyTo } = req.body;
  const userId = req.user.id;

  const chatRoom = await ChatRoom.findById(roomId);
  if (!chatRoom) {
    return next(new AppError('Chat room not found', 404));
  }

  // Check if user is a member
  const isMember = chatRoom.members.some(m => m.user.toString() === userId);
  if (!isMember) {
    return next(new AppError('You must be a member to send messages', 403));
  }

  // Create message
  const messageData = {
    sender: userId,
    content,
    type,
    replyTo: replyTo || undefined
  };

  // Add message to room
  await chatRoom.addMessage(messageData);

  // Get the newly added message with populated sender
  const updatedRoom = await ChatRoom.findById(roomId)
    .populate('messages.sender', 'name email profilePicture');
  
  const newMessage = updatedRoom.messages[updatedRoom.messages.length - 1];

  // Emit to all room members via Socket.IO (if available)
  if (req.io) {
    req.io.to(`garden-${chatRoom.garden}`).emit('new-message', {
      roomId,
      message: newMessage
    });
  }

  res.status(201).json({
    success: true,
    data: newMessage
  });
});

/**
 * Create a new chat room
 */
const createChatRoom = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;
  const { name, description, type = 'custom', isPrivate = false } = req.body;
  const userId = req.user.id;

  // Verify user has admin access to this garden
  const user = await User.findById(userId);
  const userGarden = user.gardens.find(g => g.gardenId.toString() === gardenId);
  
  if (!userGarden || (userGarden.role !== 'owner' && userGarden.role !== 'coordinator' && user.role !== 'admin')) {
    return next(new AppError('Insufficient permissions to create chat rooms', 403));
  }

  const chatRoom = new ChatRoom({
    garden: gardenId,
    name,
    description,
    type,
    isPrivate,
    createdBy: userId,
    members: [{
      user: userId,
      role: 'admin',
      joinedAt: new Date()
    }]
  });

  await chatRoom.save();

  // If not private, add all garden members
  if (!isPrivate) {
    const garden = await Garden.findById(gardenId);
    for (const member of garden.members) {
      if (member.user.toString() !== userId) {
        await chatRoom.addMember(member.user, 'member');
      }
    }
  }

  res.status(201).json({
    success: true,
    data: chatRoom
  });
});

/**
 * Join a chat room
 */
const joinChatRoom = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;
  const userId = req.user.id;

  const chatRoom = await ChatRoom.findById(roomId);
  if (!chatRoom) {
    return next(new AppError('Chat room not found', 404));
  }

  // Check if user has access to the garden
  const user = await User.findById(userId);
  const userGarden = user.gardens.find(g => g.gardenId.toString() === chatRoom.garden.toString());
  
  if (!userGarden) {
    return next(new AppError('Access denied to this garden', 403));
  }

  await chatRoom.addMember(userId);

  res.json({
    success: true,
    message: 'Successfully joined chat room'
  });
});

/**
 * Leave a chat room
 */
const leaveChatRoom = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;
  const userId = req.user.id;

  const chatRoom = await ChatRoom.findById(roomId);
  if (!chatRoom) {
    return next(new AppError('Chat room not found', 404));
  }

  await chatRoom.removeMember(userId);

  res.json({
    success: true,
    message: 'Successfully left chat room'
  });
});

/**
 * Add reaction to a message
 */
const addReaction = catchAsync(async (req, res, next) => {
  const { roomId, messageId } = req.params;
  const { emoji } = req.body;
  const userId = req.user.id;

  const chatRoom = await ChatRoom.findById(roomId);
  if (!chatRoom) {
    return next(new AppError('Chat room not found', 404));
  }

  const message = chatRoom.messages.id(messageId);
  if (!message) {
    return next(new AppError('Message not found', 404));
  }

  // Check if user already reacted with this emoji
  const existingReaction = message.reactions.find(r => 
    r.user.toString() === userId && r.emoji === emoji
  );

  if (existingReaction) {
    // Remove reaction
    message.reactions = message.reactions.filter(r => 
      !(r.user.toString() === userId && r.emoji === emoji)
    );
  } else {
    // Add reaction
    message.reactions.push({
      user: userId,
      emoji,
      createdAt: new Date()
    });
  }

  await chatRoom.save();

  res.json({
    success: true,
    data: message.reactions
  });
});

module.exports = {
  getGardenChatRooms,
  getChatMessages,
  sendMessage,
  createChatRoom,
  joinChatRoom,
  leaveChatRoom,
  addReaction
};
