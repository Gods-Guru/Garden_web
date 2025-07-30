const Plot = require('../models/Plot');
const User = require('../models/User');

/**
 * Get all crops (admin/manager only)
 */
const getCrops = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, plotId } = req.query;
    
    // Build query
    let query = {};
    if (status) query['currentPlants.status'] = status;
    if (plotId) query._id = plotId;

    const plots = await Plot.find(query)
      .populate('garden', 'name')
      .populate('assignedTo', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ updatedAt: -1 });

    // Extract crops from plots
    const crops = [];
    plots.forEach(plot => {
      plot.currentPlants.forEach(plant => {
        crops.push({
          id: plant._id,
          plotId: plot._id,
          plotNumber: plot.plotNumber,
          garden: plot.garden,
          assignedTo: plot.assignedTo,
          ...plant.toObject()
        });
      });
    });

    const total = crops.length;

    res.json({
      success: true,
      crops,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crops',
      error: error.message
    });
  }
};

/**
 * Get user's crops
 */
const getMyCrops = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const plots = await Plot.find({ assignedTo: userId })
      .populate('garden', 'name')
      .sort({ updatedAt: -1 });

    // Extract crops from user's plots
    const crops = [];
    plots.forEach(plot => {
      plot.currentPlants.forEach(plant => {
        crops.push({
          id: plant._id,
          plotId: plot._id,
          plotNumber: plot.plotNumber,
          garden: plot.garden,
          ...plant.toObject()
        });
      });
    });

    res.json({
      success: true,
      crops
    });

  } catch (error) {
    console.error('Get my crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your crops',
      error: error.message
    });
  }
};

/**
 * Get crop types
 */
const getCropTypes = async (req, res) => {
  try {
    // Static crop types - could be moved to database later
    const cropTypes = [
      { id: 'tomato', name: 'Tomato', category: 'Fruit', season: 'Summer', daysToHarvest: 75 },
      { id: 'lettuce', name: 'Lettuce', category: 'Leafy Green', season: 'Spring/Fall', daysToHarvest: 45 },
      { id: 'carrot', name: 'Carrot', category: 'Root Vegetable', season: 'Spring/Fall', daysToHarvest: 70 },
      { id: 'pepper', name: 'Pepper', category: 'Fruit', season: 'Summer', daysToHarvest: 80 },
      { id: 'spinach', name: 'Spinach', category: 'Leafy Green', season: 'Spring/Fall', daysToHarvest: 40 },
      { id: 'radish', name: 'Radish', category: 'Root Vegetable', season: 'Spring/Fall', daysToHarvest: 30 },
      { id: 'cucumber', name: 'Cucumber', category: 'Fruit', season: 'Summer', daysToHarvest: 60 },
      { id: 'herbs', name: 'Herbs', category: 'Herbs', season: 'All', daysToHarvest: 30 },
      { id: 'beans', name: 'Beans', category: 'Legume', season: 'Summer', daysToHarvest: 55 },
      { id: 'corn', name: 'Corn', category: 'Grain', season: 'Summer', daysToHarvest: 90 }
    ];

    res.json({
      success: true,
      cropTypes
    });

  } catch (error) {
    console.error('Get crop types error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop types',
      error: error.message
    });
  }
};

/**
 * Get crop by ID
 */
const getCropById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const plot = await Plot.findOne({
      'currentPlants._id': id,
      $or: [
        { assignedTo: userId },
        { 'garden.members.user': userId }
      ]
    })
    .populate('garden', 'name')
    .populate('assignedTo', 'name email');

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    const crop = plot.currentPlants.id(id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      crop: {
        id: crop._id,
        plotId: plot._id,
        plotNumber: plot.plotNumber,
        garden: plot.garden,
        assignedTo: plot.assignedTo,
        ...crop.toObject()
      }
    });

  } catch (error) {
    console.error('Get crop by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop',
      error: error.message
    });
  }
};

/**
 * Create new crop
 */
const createCrop = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plotId, cropType, variety, plantingDate, expectedHarvestDate, quantity, notes } = req.body;

    // Verify user owns the plot
    const plot = await Plot.findOne({ _id: plotId, assignedTo: userId });
    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found or access denied'
      });
    }

    // Create new plant entry
    const newPlant = {
      plantId: cropType, // Using crop type as plant ID for now
      name: cropType,
      variety: variety || '',
      plantedDate: plantingDate || new Date(),
      expectedHarvestDate: expectedHarvestDate || null,
      status: 'planted',
      quantity: quantity || 1,
      notes: notes || ''
    };

    plot.currentPlants.push(newPlant);
    await plot.save();

    res.status(201).json({
      success: true,
      message: 'Crop added successfully',
      crop: newPlant
    });

  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create crop',
      error: error.message
    });
  }
};

/**
 * Update crop
 */
const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const plot = await Plot.findOne({
      'currentPlants._id': id,
      assignedTo: userId
    });

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found or access denied'
      });
    }

    const crop = plot.currentPlants.id(id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Update crop fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        crop[key] = updates[key];
      }
    });

    await plot.save();

    res.json({
      success: true,
      message: 'Crop updated successfully',
      crop
    });

  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update crop',
      error: error.message
    });
  }
};

/**
 * Update crop status
 */
const updateCropStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const plot = await Plot.findOne({
      'currentPlants._id': id,
      assignedTo: userId
    });

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found or access denied'
      });
    }

    const crop = plot.currentPlants.id(id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop.status = status;
    if (status === 'harvested') {
      crop.harvestedDate = new Date();
    }

    await plot.save();

    res.json({
      success: true,
      message: 'Crop status updated successfully',
      crop
    });

  } catch (error) {
    console.error('Update crop status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update crop status',
      error: error.message
    });
  }
};

/**
 * Harvest crop
 */
const harvestCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, notes } = req.body;
    const userId = req.user.id;

    const plot = await Plot.findOne({
      'currentPlants._id': id,
      assignedTo: userId
    });

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found or access denied'
      });
    }

    const crop = plot.currentPlants.id(id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop.status = 'harvested';
    crop.harvestedDate = new Date();
    if (quantity) crop.harvestedQuantity = quantity;
    if (notes) crop.harvestNotes = notes;

    await plot.save();

    res.json({
      success: true,
      message: 'Crop harvested successfully',
      crop
    });

  } catch (error) {
    console.error('Harvest crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to harvest crop',
      error: error.message
    });
  }
};

/**
 * Delete crop
 */
const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const plot = await Plot.findOne({
      'currentPlants._id': id,
      assignedTo: userId
    });

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found or access denied'
      });
    }

    plot.currentPlants.id(id).remove();
    await plot.save();

    res.json({
      success: true,
      message: 'Crop deleted successfully'
    });

  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete crop',
      error: error.message
    });
  }
};

module.exports = {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getMyCrops,
  getCropTypes,
  updateCropStatus,
  harvestCrop
};
