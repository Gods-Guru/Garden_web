const Garden = require('../models/Garden');
const User = require('../models/User');
const Plot = require('../models/Plot');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const GardenDataService = require('../services/GardenDataService');

// Get all public gardens (with pagination and search) - now fetches from web
const getAllGardens = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50; // Increased default limit
  const skip = (page - 1) * limit;

  console.log('Loading community garden data...');

  try {
    // First try to get from database, but handle connection errors gracefully
    let gardens = [];
    let dbGardens = [];

    try {
      dbGardens = await Garden.find({ 'settings.isPublic': true, status: 'active' })
        .populate('owner', 'name email')
        .sort({ createdAt: -1 });
      console.log(`Found ${dbGardens.length} gardens in database`);
    } catch (dbError) {
      console.log('Database connection failed, using web sources:', dbError.message);
      dbGardens = []; // Treat as no gardens found
    }

    // If no gardens in database or DB connection failed, load from REAL internet sources
    if (dbGardens.length === 0) {
      console.log('🌍 No database gardens found - fetching REAL gardens from internet...');

      // Try to get user location from request for better results
      const userLocation = req.query.lat && req.query.lng ? {
        lat: parseFloat(req.query.lat),
        lng: parseFloat(req.query.lng)
      } : null;

      const radius = parseInt(req.query.radius) || 50;

      const webGardens = await GardenDataService.getGardensFromWeb(userLocation, radius);
      gardens = webGardens;
      console.log(`✅ Loaded ${webGardens.length} REAL gardens from internet sources`);

      // Log sources for debugging
      const sources = webGardens.reduce((acc, garden) => {
        acc[garden.source] = (acc[garden.source] || 0) + 1;
        return acc;
      }, {});
      console.log('📊 Garden sources:', sources);
    } else {
      gardens = dbGardens;
      console.log(`📁 Using ${dbGardens.length} gardens from database`);
    }

    // Apply search filter if provided
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      gardens = gardens.filter(garden =>
        garden.name?.toLowerCase().includes(searchTerm) ||
        garden.description?.toLowerCase().includes(searchTerm) ||
        garden.address?.city?.toLowerCase().includes(searchTerm) ||
        garden.address?.state?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by public/private
    if (req.query.isPublic !== undefined) {
      const isPublic = req.query.isPublic === 'true';
      gardens = gardens.filter(garden => garden.settings?.isPublic === isPublic);
    }

    // Apply pagination
    const total = gardens.length;
    const paginatedGardens = gardens.slice(skip, skip + limit);

    console.log(`Returning ${paginatedGardens.length} gardens (page ${page})`);

    res.status(200).json({
      success: true,
      data: {
        gardens: paginatedGardens,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalGardens: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllGardens:', error);
    // Return empty result instead of error to keep frontend working
    res.status(200).json({
      success: true,
      data: {
        gardens: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalGardens: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    });
  }
});

// Get user's gardens
const getMyGardens = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: 'gardens.gardenId',
    select: 'name description address status stats images'
  });

  const gardens = user.gardens.map(membership => ({
    garden: membership.gardenId,
    role: membership.role,
    joinedAt: membership.joinedAt,
    status: membership.status
  }));

  res.status(200).json({
    success: true,
    data: {
      gardens
    }
  });
});

// Get single garden details
const getGarden = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  const garden = await Garden.findById(gardenId).populate('owner', 'name email avatar');

  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  // Check if garden is public or user is a member
  const isPublic = garden.settings.isPublic;
  const isMember = req.user && req.user.gardens.some(
    g => g.gardenId.toString() === gardenId.toString()
  );

  if (!isPublic && !isMember) {
    return next(new AppError('Access denied. This is a private garden.', 403));
  }

  // Hide sensitive information for non-members
  if (!isMember) {
    garden.contact = undefined;
    garden.settings = undefined;
  }

  res.status(200).json({
    success: true,
    data: {
      garden
    }
  });
});

// Get garden plots
const getGardenPlots = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  const plots = await Plot.find({ garden: gardenId })
    .populate('assignedTo', 'name email avatar')
    .sort('number');

  res.status(200).json({
    success: true,
    data: {
      plots
    }
  });
});

// Create a new plot
const createPlot = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;
  const { number, size, location } = req.body;

  // Check if plot number already exists in garden
  const existingPlot = await Plot.findOne({ garden: gardenId, number });
  if (existingPlot) {
    return next(new AppError('Plot number already exists in this garden', 400));
  }

  const plot = await Plot.create({
    garden: gardenId,
    number,
    size,
    location,
    status: 'AVAILABLE'
  });

  res.status(201).json({
    success: true,
    data: {
      plot
    }
  });
});

// Update plot status
const updatePlotStatus = catchAsync(async (req, res, next) => {
  const { plotId } = req.params;
  const { status } = req.body;

  const plot = await Plot.findById(plotId);
  if (!plot) {
    return next(new AppError('Plot not found', 404));
  }

  // Validate status
  const validStatuses = ['AVAILABLE', 'ASSIGNED', 'MAINTENANCE'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid plot status', 400));
  }

  // If changing to AVAILABLE, remove assignedTo
  if (status === 'AVAILABLE') {
    plot.assignedTo = null;
  }

  plot.status = status;
  await plot.save();

  res.status(200).json({
    success: true,
    data: {
      plot
    }
  });
});

// Assign plot to user
const assignPlot = catchAsync(async (req, res, next) => {
  const { plotId } = req.params;
  const { userId } = req.body;

  const plot = await Plot.findById(plotId);
  if (!plot) {
    return next(new AppError('Plot not found', 404));
  }

  if (plot.status !== 'AVAILABLE') {
    return next(new AppError('Plot is not available for assignment', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  plot.assignedTo = userId;
  plot.status = 'ASSIGNED';
  await plot.save();

  // Add plot to user's assigned plots
  user.assignedPlots.push(plotId);
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      plot
    }
  });
});

// Create new garden
const createGarden = catchAsync(async (req, res, next) => {
  const gardenData = {
    ...req.body,
    creator: req.user._id,
    owner: req.user._id
  };

  const garden = await Garden.create(gardenData);

  // Add user as owner of the garden
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        gardens: {
          gardenId: garden._id,
          role: 'owner',
          status: 'active'
        }
      }
    },
    { new: true } // Return the updated document
  );

  res.status(201).json({
    success: true,
    message: 'Garden created successfully',
    data: {
      garden
    }
  });
});

// Update garden
const updateGarden = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  // Authorization is handled by middleware, garden is available in req.garden
  const updatedGarden = await Garden.findByIdAndUpdate(
    gardenId,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedGarden) {
    return next(new AppError('Garden not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Garden updated successfully',
    data: {
      garden: updatedGarden
    }
  });
});

// Delete garden
const deleteGarden = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  const garden = await Garden.findById(gardenId);

  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  // Check if user is the owner
  if (garden.owner.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the garden owner can delete the garden', 403));
  }

  // In a real app, you'd want to:
  // 1. Handle all plots, tasks, events, etc.
  // 2. Notify all members
  // 3. Maybe archive instead of delete

  await Garden.findByIdAndDelete(gardenId);

  // Remove garden from all users
  await User.updateMany(
    { 'gardens.gardenId': gardenId },
    { $pull: { gardens: { gardenId } } }
  );

  res.status(200).json({
    success: true,
    message: 'Garden deleted successfully'
  });
});

// Join garden (request membership)
const joinGarden = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  const garden = await Garden.findById(gardenId);

  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  // Check if garden is public
  if (!garden.settings.isPublic) {
    return next(new AppError('This garden is private and not accepting new members', 403));
  }

  // Check if user is already a member
  const isAlreadyMember = req.user.gardens.some(
    g => g.gardenId.toString() === gardenId.toString()
  );

  if (isAlreadyMember) {
    return next(new AppError('You are already a member of this garden', 400));
  }

  // Check if garden is at capacity
  if (garden.isAtCapacity()) {
    return next(new AppError('Garden is at full capacity', 400));
  }

  // Add user to garden
  const membershipStatus = garden.settings.requiresApproval ? 'pending' : 'active';

  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      gardens: {
        gardenId,
        role: 'member',
        status: membershipStatus
      }
    }
  });

  // Update garden stats if approved immediately
  if (membershipStatus === 'active') {
    garden.stats.totalMembers += 1;
    garden.stats.activeMembers += 1;
    await garden.save();
  }

  res.status(200).json({
    success: true,
    message: membershipStatus === 'pending' 
      ? 'Membership request sent. Waiting for approval.' 
      : 'Successfully joined the garden!',
    data: {
      status: membershipStatus
    }
  });
});

// Leave garden
const leaveGarden = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  const garden = await Garden.findById(gardenId);

  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  // Check if user is the owner
  if (garden.owner.toString() === req.user._id.toString()) {
    return next(new AppError('Garden owner cannot leave. Transfer ownership first.', 400));
  }

  // Remove user from garden
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { gardens: { gardenId } }
  });

  // Update garden stats
  garden.stats.totalMembers = Math.max(0, garden.stats.totalMembers - 1);
  garden.stats.activeMembers = Math.max(0, garden.stats.activeMembers - 1);
  await garden.save();

  res.status(200).json({
    success: true,
    message: 'Successfully left the garden'
  });
});

// Get garden members
const getGardenMembers = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  const members = await User.find({
    'gardens.gardenId': gardenId
  }).select('name email avatar gardens.$');

  const formattedMembers = members.map(member => ({
    _id: member._id,
    name: member.name,
    email: member.email,
    avatar: member.avatar,
    role: member.gardens[0].role,
    joinedAt: member.gardens[0].joinedAt,
    status: member.gardens[0].status
  }));

  res.status(200).json({
    success: true,
    data: {
      members: formattedMembers
    }
  });
});

// Update member role
const updateMemberRole = catchAsync(async (req, res, next) => {
  const { gardenId, userId } = req.params;
  const { role } = req.body;

  if (!['member', 'coordinator', 'admin'].includes(role)) {
    return next(new AppError('Invalid role', 400));
  }

  // Authorization is handled by middleware
  await User.findOneAndUpdate(
    { _id: userId, 'gardens.gardenId': gardenId },
    { $set: { 'gardens.$.role': role } }
  );

  res.status(200).json({
    success: true,
    message: 'Member role updated successfully'
  });
});

// Approve/reject membership
const manageMembership = catchAsync(async (req, res, next) => {
  const { gardenId, userId } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return next(new AppError('Invalid action', 400));
  }

  // Authorization is handled by middleware, garden is available in req.garden
  const garden = req.garden;

  if (action === 'approve') {
    await User.findOneAndUpdate(
      { _id: userId, 'gardens.gardenId': gardenId },
      { $set: { 'gardens.$.status': 'active' } }
    );

    // Update garden stats
    garden.stats.activeMembers += 1;
    await garden.save();

    res.status(200).json({
      success: true,
      message: 'Membership approved successfully'
    });
  } else {
    // Remove user from garden
    await User.findByIdAndUpdate(userId, {
      $pull: { gardens: { gardenId } }
    });

    res.status(200).json({
      success: true,
      message: 'Membership rejected'
    });
  }
});

// Get garden statistics
const getGardenStats = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  const garden = await Garden.findById(gardenId);
  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  // Get plot statistics
  const plotStats = await Plot.aggregate([
    { $match: { garden: garden._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const stats = {
    garden: garden.stats,
    plots: plotStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {}),
    occupancyRate: garden.getOccupancyRate()
  };

  res.status(200).json({
    success: true,
    data: {
      stats
    }
  });
});

// Find gardens near a location
const getNearbyGardens = catchAsync(async (req, res, next) => {
  const { lng, lat, radius = 5 } = req.query; // radius in km
  if (!lng || !lat) {
    return next(new AppError('Longitude and latitude are required', 400, 'GEO_REQUIRED'));
  }
  const gardens = await Garden.find({
    geo: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseFloat(radius) * 1000 // meters
      }
    },
    'settings.isPublic': true
  }).select('name description geo address stats');
  res.json({ success: true, data: gardens });
});

// Admin member management functions
const inviteMember = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;
  const { email, role = 'member' } = req.body;

  const garden = await Garden.findById(gardenId);
  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  // Check if user is garden owner or admin
  const userRole = req.user.gardens?.find(g => g.gardenId.toString() === gardenId)?.role;
  if (req.user.role !== 'admin' && userRole !== 'owner') {
    return next(new AppError('Only garden owners and admins can invite members', 403));
  }

  // Find user by email
  const invitedUser = await User.findOne({ email });
  if (!invitedUser) {
    return next(new AppError('User not found with this email', 404));
  }

  // Check if user is already a member
  const existingMember = invitedUser.gardens.find(g => g.gardenId.toString() === gardenId);
  if (existingMember) {
    return next(new AppError('User is already a member of this garden', 400));
  }

  // Add user to garden
  invitedUser.gardens.push({
    gardenId: gardenId,
    role: role,
    status: 'active',
    joinedAt: new Date()
  });
  await invitedUser.save();

  // Add member to garden
  garden.members.push({
    user: invitedUser._id,
    role: role,
    status: 'active',
    joinedAt: new Date()
  });
  await garden.save();

  res.status(200).json({
    success: true,
    message: 'Member invited successfully',
    data: {
      member: {
        id: invitedUser._id,
        name: invitedUser.name,
        email: invitedUser.email,
        role: role
      }
    }
  });
});

const promoteUser = catchAsync(async (req, res, next) => {
  const { gardenId, userId } = req.params;
  const { newRole } = req.body;

  const garden = await Garden.findById(gardenId);
  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  // Check permissions
  const userRole = req.user.gardens?.find(g => g.gardenId.toString() === gardenId)?.role;
  if (req.user.role !== 'admin' && userRole !== 'owner') {
    return next(new AppError('Only garden owners and admins can promote users', 403));
  }

  // Update user's role in garden
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const userGarden = user.gardens.find(g => g.gardenId.toString() === gardenId);
  if (!userGarden) {
    return next(new AppError('User is not a member of this garden', 400));
  }

  userGarden.role = newRole;
  await user.save();

  // Update garden member role
  const gardenMember = garden.members.find(m => m.user.toString() === userId);
  if (gardenMember) {
    gardenMember.role = newRole;
    await garden.save();
  }

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      userId,
      newRole
    }
  });
});

const blockUser = catchAsync(async (req, res, next) => {
  const { gardenId, userId } = req.params;
  const { reason } = req.body;

  const garden = await Garden.findById(gardenId);
  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  // Check permissions
  const userRole = req.user.gardens?.find(g => g.gardenId.toString() === gardenId)?.role;
  if (req.user.role !== 'admin' && userRole !== 'owner') {
    return next(new AppError('Only garden owners and admins can block users', 403));
  }

  // Update user status
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const userGarden = user.gardens.find(g => g.gardenId.toString() === gardenId);
  if (!userGarden) {
    return next(new AppError('User is not a member of this garden', 400));
  }

  userGarden.status = 'blocked';
  await user.save();

  // Update garden member status
  const gardenMember = garden.members.find(m => m.user.toString() === userId);
  if (gardenMember) {
    gardenMember.status = 'blocked';
    gardenMember.blockedAt = new Date();
    gardenMember.blockReason = reason;
    await garden.save();
  }

  res.status(200).json({
    success: true,
    message: 'User blocked successfully'
  });
});

const generateInviteLink = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;
  const { expiresIn = 7 } = req.body; // days

  const garden = await Garden.findById(gardenId);
  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  // Check permissions
  const userRole = req.user.gardens?.find(g => g.gardenId.toString() === gardenId)?.role;
  if (req.user.role !== 'admin' && userRole !== 'owner' && userRole !== 'coordinator') {
    return next(new AppError('Insufficient permissions to generate invite links', 403));
  }

  // Generate unique invite token
  const crypto = require('crypto');
  const inviteToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);

  // Store invite in garden
  if (!garden.invites) garden.invites = [];
  garden.invites.push({
    token: inviteToken,
    createdBy: req.user.id,
    expiresAt,
    used: false
  });
  await garden.save();

  const inviteLink = `${process.env.FRONTEND_URL}/join-garden/${inviteToken}`;

  res.status(200).json({
    success: true,
    data: {
      inviteLink,
      token: inviteToken,
      expiresAt
    }
  });
});

module.exports = {
  getAllGardens,
  getMyGardens,
  getGarden,
  createGarden,
  updateGarden,
  deleteGarden,
  joinGarden,
  leaveGarden,
  getGardenMembers,
  updateMemberRole,
  manageMembership,
  getGardenStats,
  getNearbyGardens,
  // New admin functions
  inviteMember,
  promoteUser,
  blockUser,
  generateInviteLink
};