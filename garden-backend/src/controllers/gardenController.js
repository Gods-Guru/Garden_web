import { Garden, User, Plot } from '../models/index.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all public gardens (with pagination and search)
export const getAllGardens = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Build search query
  let query = { 'settings.isPublic': true, status: 'active' };
  
  // Search by name or city
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { 'address.city': { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Filter by city
  if (req.query.city) {
    query['address.city'] = { $regex: req.query.city, $options: 'i' };
  }
  
  // Filter by state
  if (req.query.state) {
    query['address.state'] = req.query.state;
  }

  const gardens = await Garden.find(query)
    .populate('owner', 'name email')
    .select('-contact.email -contact.phone') // Hide private contact info
    .sort(req.query.sort || '-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Garden.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      gardens,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalGardens: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  });
});

// Get user's gardens
export const getMyGardens = catchAsync(async (req, res, next) => {
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
export const getGarden = catchAsync(async (req, res, next) => {
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
    garden.fees = undefined;
  }

  res.status(200).json({
    success: true,
    data: {
      garden,
      userRole: isMember ? req.user.getRoleInGarden(gardenId) : null
    }
  });
});

// Create new garden
export const createGarden = catchAsync(async (req, res, next) => {
  const gardenData = {
    ...req.body,
    owner: req.user._id
  };

  const garden = await Garden.create(gardenData);

  // Add user as owner of the garden
  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      gardens: {
        gardenId: garden._id,
        role: 'owner',
        status: 'active'
      }
    }
  });

  res.status(201).json({
    success: true,
    message: 'Garden created successfully',
    data: {
      garden
    }
  });
});

// Update garden
export const updateGarden = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  const garden = await Garden.findByIdAndUpdate(
    gardenId,
    req.body,
    { new: true, runValidators: true }
  );

  if (!garden) {
    return next(new AppError('Garden not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Garden updated successfully',
    data: {
      garden
    }
  });
});

// Delete garden
export const deleteGarden = catchAsync(async (req, res, next) => {
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
export const joinGarden = catchAsync(async (req, res, next) => {
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
export const leaveGarden = catchAsync(async (req, res, next) => {
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
export const getGardenMembers = catchAsync(async (req, res, next) => {
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
export const updateMemberRole = catchAsync(async (req, res, next) => {
  const { gardenId, userId } = req.params;
  const { role } = req.body;

  if (!['member', 'coordinator', 'admin'].includes(role)) {
    return next(new AppError('Invalid role', 400));
  }

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
export const manageMembership = catchAsync(async (req, res, next) => {
  const { gardenId, userId } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return next(new AppError('Invalid action', 400));
  }

  if (action === 'approve') {
    await User.findOneAndUpdate(
      { _id: userId, 'gardens.gardenId': gardenId },
      { $set: { 'gardens.$.status': 'active' } }
    );

    // Update garden stats
    const garden = await Garden.findById(gardenId);
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
export const getGardenStats = catchAsync(async (req, res, next) => {
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
export const getNearbyGardens = catchAsync(async (req, res, next) => {
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