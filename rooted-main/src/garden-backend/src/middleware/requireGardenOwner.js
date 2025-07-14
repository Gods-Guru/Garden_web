const Garden = require('../models/Garden');
const AppError = require('../middleware/errorHandler').AppError;

exports.requireGardenOwner = async (req, res, next) => {
  const garden = await Garden.findById(req.params.gardenId);
  if (!garden) return next(new AppError('Garden not found', 404));
  if (garden.owner.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the owner can perform this action', 403));
  }
  next();
};