const Joi = require('joi');

const createGardenSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  location: Joi.object({
    address: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
  size: Joi.number().min(1).required(),
  numPlots: Joi.number().min(1).required(),
  rules: Joi.string().allow(''),
  managers: Joi.array().items(Joi.string()),
  description: Joi.string().allow(''),
});

const updateGardenSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  location: Joi.object({
    address: Joi.string(),
    lat: Joi.number(),
    lng: Joi.number(),
  }),
  size: Joi.number().min(1),
  numPlots: Joi.number().min(1),
  rules: Joi.string().allow(''),
  managers: Joi.array().items(Joi.string()),
  description: Joi.string().allow(''),
});

module.exports = { createGardenSchema, updateGardenSchema };
