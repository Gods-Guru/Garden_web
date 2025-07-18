const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow(''),
  dueDate: Joi.date().iso().required(),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  assignedTo: Joi.string().optional(),
  garden: Joi.string().required(),
  plot: Joi.string().optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  description: Joi.string().allow(''),
  dueDate: Joi.date().iso(),
  priority: Joi.string().valid('low', 'medium', 'high'),
  assignedTo: Joi.string().optional(),
  plot: Joi.string().optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed', 'overdue'),
});

module.exports = { createTaskSchema, updateTaskSchema };
