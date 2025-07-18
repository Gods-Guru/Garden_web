const Plot = require('../models/Plot');
const Garden = require('../models/Garden');
const User = require('../models/User');
const Task = require('../models/Task');
const { catchAsync } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');

// Get all plots in a garden (role-based filtering)
const getPlots = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;
  const userRole = req.user.getRoleInGarden(gardenId);
  
  if (!userRole) {
    return next(new AppError('You are not a member of this garden', 403));
  }

  let query = { garden: gardenId };
  let populateOptions = 'assignedTo';
  
  // Regular members only see their own plots + available plots
  if (userRole === 'member') {
    query.$or = [
      { assignedTo: req.user._id },
      { status: 'available' }
    ];
    populateOptions = 'assignedTo'; // Limited user info
  }

  // Build sort and pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || 'plotNumber';

  // Filter by status if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by section if provided
  if (req.query.section) {
    query['location.section'] = req.query.section;
  }

  const plots = await Plot.find(query)
    .populate('assignedTo', 'name email avatar')
    .populate('currentPlants.plantId', 'name category')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Plot.countDocuments(query);

  // Filter sensitive data for regular members
  let responseData = plots;
  if (userRole === 'member') {
    responseData = plots.map(plot => {
      const plotObj = plot.toObject();
      
      // If plot is not assigned to this user, hide sensitive info
      if (plot.assignedTo && plot.assignedTo._id.toString() !== req.user._id.toString()) {
        delete plotObj.soil;
        delete plotObj.history;
        delete plotObj.customPricing;
        delete plotObj.lastWatered;
      }
      
      return plotObj;
    });
  }

  res.status(200).json({
    success: true,
    data: {
      plots: responseData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPlots: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      userRole
    }
  });
});

// Get single plot details (role-based data)
const getPlot = catchAsync(async (req, res, next) => {
  const { gardenId, plotId } = req.params;
  const userRole = req.user.getRoleInGarden(gardenId);

  if (!userRole) {
    return next(new AppError('You are not a member of this garden', 403));
  }

  const plot = await Plot.findOne({ _id: plotId, garden: gardenId })
    .populate('assignedTo', 'name email avatar phone')
    .populate('currentPlants.plantId', 'name scientificName category growingInfo')
    .populate('history.performedBy', 'name');

  if (!plot) {
    return next(new AppError('Plot not found', 404));
  }

  // Check permissions for detailed view
  const isPlotOwner = plot.assignedTo && plot.assignedTo._id.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'owner', 'coordinator'].includes(userRole);

  if (!isPlotOwner && !isAdmin) {
    return next(new AppError('Access denied. You can only view your own plots.', 403));
  }

  // Filter data based on role
  let responseData = plot.toObject();
  
  if (userRole === 'member' && !isPlotOwner) {
    // Very limited data for non-owners
    responseData = {
      _id: plot._id,
      plotNumber: plot.plotNumber,
      status: plot.status,
      dimensions: plot.dimensions,
      assignedTo: plot.assignedTo
    };
  }

  res.status(200).json({
    success: true,
    data: {
      plot: responseData,
      userRole,
      isPlotOwner
    }
  });
});

// Create new plot (admin only)
const createPlot = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  // Check if plot number already exists in this garden
  const existingPlot = await Plot.findOne({
    garden: gardenId,
    plotNumber: req.body.plotNumber
  });

  if (existingPlot) {
    return next(new AppError('Plot number already exists in this garden', 400));
  }

  const plotData = {
    ...req.body,
    garden: gardenId
  };

  const plot = await Plot.create(plotData);

  // Update garden stats
  await Garden.findByIdAndUpdate(gardenId, {
    $inc: { 'stats.totalPlots': 1 }
  });

  // Add history entry
  plot.addHistoryEntry('created', 'Plot created', req.user._id, 'Initial plot setup');
  await plot.save();

  res.status(201).json({
    success: true,
    message: 'Plot created successfully',
    data: {
      plot
    }
  });
});

// Update plot (admin or plot owner)
const updatePlot = catchAsync(async (req, res, next) => {
  const { gardenId, plotId } = req.params;
  const userRole = req.user.getRoleInGarden(gardenId);

  const plot = await Plot.findOne({ _id: plotId, garden: gardenId });

  if (!plot) {
    return next(new AppError('Plot not found', 404));
  }

  // Check permissions
  const isPlotOwner = plot.assignedTo && plot.assignedTo.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'owner', 'coordinator'].includes(userRole);

  if (!isPlotOwner && !isAdmin) {
    return next(new AppError('Access denied. Only plot owners or admins can update plots.', 403));
  }

  // Restrict what regular members can update
  let updateData = req.body;
  if (userRole === 'member' && isPlotOwner) {
    // Members can only update certain fields
    const allowedFields = ['name', 'currentPlants', 'seasonalNotes', 'images'];
    updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
  }

  const updatedPlot = await Plot.findByIdAndUpdate(
    plotId,
    updateData,
    { new: true, runValidators: true }
  );

  // Add history entry
  updatedPlot.addHistoryEntry(
    'maintenance',
    'Plot information updated',
    req.user._id,
    `Updated by ${userRole}: ${req.user.name}`
  );
  await updatedPlot.save();

  res.status(200).json({
    success: true,
    message: 'Plot updated successfully',
    data: {
      plot: updatedPlot
    }
  });
});

// Assign plot to user (admin only)
const assignPlot = catchAsync(async (req, res, next) => {
  const { gardenId, plotId } = req.params;
  const { userId } = req.body;

  const plot = await Plot.findOne({ _id: plotId, garden: gardenId });

  if (!plot) {
    return next(new AppError('Plot not found', 404));
  }

  if (plot.status !== 'available') {
    return next(new AppError('Plot is not available for assignment', 400));
  }

  // Check if user is a member of this garden
  const user = await User.findById(userId);
  const isMember = user.gardens.some(g => 
    g.gardenId.toString() === gardenId.toString() && g.status === 'active'
  );

  if (!isMember) {
    return next(new AppError('User is not an active member of this garden', 400));
  }

  // Assign plot
  plot.assignedTo = userId;
  plot.assignedAt = new Date();
  plot.status = 'occupied';
  
  // Add history entry
  plot.addHistoryEntry(
    'assigned',
    `Plot assigned to ${user.name}`,
    req.user._id,
    `Assigned by admin: ${req.user.name}`
  );

  await plot.save();

  // Update garden stats
  await Garden.findByIdAndUpdate(gardenId, {
    $inc: { 'stats.occupiedPlots': 1 }
  });

  res.status(200).json({
    success: true,
    message: 'Plot assigned successfully',
    data: {
      plot
    }
  });
});

// Unassign plot (admin only or plot owner can release)
const unassignPlot = catchAsync(async (req, res, next) => {
  const { gardenId, plotId } = req.params;
  const userRole = req.user.getRoleInGarden(gardenId);

  const plot = await Plot.findOne({ _id: plotId, garden: gardenId })
    .populate('assignedTo', 'name');

  if (!plot) {
    return next(new AppError('Plot not found', 404));
  }

  if (!plot.assignedTo) {
    return next(new AppError('Plot is not currently assigned', 400));
  }

  // Check permissions
  const isPlotOwner = plot.assignedTo._id.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'owner', 'coordinator'].includes(userRole);

  if (!isPlotOwner && !isAdmin) {
    return next(new AppError('Access denied. Only plot owners or admins can unassign plots.', 403));
  }

  const previousOwner = plot.assignedTo.name;

  // Unassign plot
  plot.assignedTo = null;
  plot.assignedAt = null;
  plot.status = 'available';
  
  // Add history entry
  plot.addHistoryEntry(
    'unassigned',
    `Plot released by ${previousOwner}`,
    req.user._id,
    isAdmin ? `Unassigned by admin: ${req.user.name}` : 'Released by plot owner'
  );

  await plot.save();

  // Update garden stats
  await Garden.findByIdAndUpdate(gardenId, {
    $inc: { 'stats.occupiedPlots': -1 }
  });

  res.status(200).json({
    success: true,
    message: 'Plot unassigned successfully',
    data: {
      plot
    }
  });
});

// Delete plot (owner only)
const deletePlot = catchAsync(async (req, res, next) => {
  const { gardenId, plotId } = req.params;

  const plot = await Plot.findOne({ _id: plotId, garden: gardenId });

  if (!plot) {
    return next(new AppError('Plot not found', 404));
  }

  // Check if plot is assigned
  if (plot.assignedTo) {
    return next(new AppError('Cannot delete assigned plot. Unassign first.', 400));
  }

  await Plot.findByIdAndDelete(plotId);

  // Update garden stats
  await Garden.findByIdAndUpdate(gardenId, {
    $inc: { 'stats.totalPlots': -1 }
  });

  res.status(200).json({
    success: true,
    message: 'Plot deleted successfully'
  });
});

// Get my plots (user's own plots across all gardens)
const getMyPlots = catchAsync(async (req, res, next) => {
  const plots = await Plot.find({ assignedTo: req.user._id })
    .populate('garden', 'name address')
    .populate('currentPlants.plantId', 'name category')
    .sort('-assignedAt');

  res.status(200).json({
    success: true,
    data: {
      plots
    }
  });
});

// Add plant to plot (plot owner or admin)
const addPlantToPlot = catchAsync(async (req, res, next) => {
  const { gardenId, plotId } = req.params;
  const { plantId, plantName, variety, quantity, notes } = req.body;
  const userRole = req.user.getRoleInGarden(gardenId);

  const plot = await Plot.findOne({ _id: plotId, garden: gardenId });

  if (!plot) {
    return next(new AppError('Plot not found', 404));
  }

  // Check permissions
  const isPlotOwner = plot.assignedTo && plot.assignedTo.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'owner', 'coordinator'].includes(userRole);

  if (!isPlotOwner && !isAdmin) {
    return next(new AppError('Access denied. Only plot owners or admins can add plants.', 403));
  }

  const newPlant = {
    plantId,
    plantName,
    variety,
    plantedDate: new Date(),
    quantity: quantity || 1,
    notes,
    status: 'planted'
  };

  plot.currentPlants.push(newPlant);
  
  // Add history entry
  plot.addHistoryEntry(
    'planted',
    `Planted ${quantity || 1} ${plantName}${variety ? ` (${variety})` : ''}`,
    req.user._id,
    notes || ''
  );

  await plot.save();

  res.status(200).json({
    success: true,
    message: 'Plant added to plot successfully',
    data: {
      plot
    }
  });
});

// Update plant status (plot owner or admin)
const updatePlantStatus = catchAsync(async (req, res, next) => {
  const { gardenId, plotId, plantIndex } = req.params;
  const { status, notes } = req.body;
  const userRole = req.user.getRoleInGarden(gardenId);

  const plot = await Plot.findOne({ _id: plotId, garden: gardenId });

  if (!plot) {
    return next(new AppError('Plot not found', 404));
  }

  // Check permissions
  const isPlotOwner = plot.assignedTo && plot.assignedTo.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'owner', 'coordinator'].includes(userRole);

  if (!isPlotOwner && !isAdmin) {
    return next(new AppError('Access denied. Only plot owners or admins can update plants.', 403));
  }

  if (!plot.currentPlants[plantIndex]) {
    return next(new AppError('Plant not found in plot', 404));
  }

  const plant = plot.currentPlants[plantIndex];
  const oldStatus = plant.status;
  plant.status = status;

  // Add history entry
  plot.addHistoryEntry(
    status,
    `${plant.plantName} status changed from ${oldStatus} to ${status}`,
    req.user._id,
    notes || ''
  );

  await plot.save();

  res.status(200).json({
    success: true,
    message: 'Plant status updated successfully',
    data: {
      plant
    }
  });
});

// Get plot statistics (admin only)
const getPlotStats = catchAsync(async (req, res, next) => {
  const { gardenId } = req.params;

  // Aggregate plot statistics
  const stats = await Plot.aggregate([
    { $match: { garden: gardenId } },
    {
      $group: {
        _id: null,
        totalPlots: { $sum: 1 },
        availablePlots: {
          $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
        },
        occupiedPlots: {
          $sum: { $cond: [{ $eq: ['$status', 'occupied'] }, 1, 0] }
        },
        maintenancePlots: {
          $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
        },
        averageArea: { $avg: '$dimensions.area' },
        totalArea: { $sum: '$dimensions.area' }
      }
    }
  ]);

  const plotStats = stats[0] || {
    totalPlots: 0,
    availablePlots: 0,
    occupiedPlots: 0,
    maintenancePlots: 0,
    averageArea: 0,
    totalArea: 0
  };

  // Calculate occupancy rate
  plotStats.occupancyRate = plotStats.totalPlots > 0 
    ? Math.round((plotStats.occupiedPlots / plotStats.totalPlots) * 100)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      stats: plotStats
    }
  });
});

module.exports = {
  getPlots,
  getPlot,
  createPlot,
  updatePlot,
  assignPlot,
  unassignPlot,
  deletePlot,
  getMyPlots,
  addPlantToPlot,
  updatePlantStatus,
  getPlotStats
};