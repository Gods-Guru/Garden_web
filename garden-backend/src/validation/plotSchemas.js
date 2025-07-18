const Joi = require('joi');

const createPlotSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  garden: Joi.string().required(),
  size: Joi.number().min(1).required(),
  status: Joi.string().valid('available', 'reserved', 'occupied', 'inactive').default('available'),
  description: Joi.string().allow(''),
  cropType: Joi.string().allow(''),
  location: Joi.object({
    section: Joi.string().allow(''),
    row: Joi.string().allow(''),
    number: Joi.string().allow('')
  }).optional(),
});

const updatePlotSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  size: Joi.number().min(1),
  status: Joi.string().valid('available', 'reserved', 'occupied', 'inactive'),
  description: Joi.string().allow(''),
  cropType: Joi.string().allow(''),
  location: Joi.object({
    section: Joi.string().allow(''),
    row: Joi.string().allow(''),
    number: Joi.string().allow('')
  }).optional(),
});

module.exports = { createPlotSchema, updatePlotSchema };
