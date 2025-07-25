const Joi = require('joi');

const createGardenSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).required(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().allow(''),
    country: Joi.string().default('United States'),
    coordinates: Joi.object({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required()
  }).required(),
  geo: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  }).required(),
  totalArea: Joi.number().min(1).required(),
  totalPlots: Joi.number().min(1).required(),
  plotSize: Joi.object({
    width: Joi.number().min(1).required(),
    height: Joi.number().min(1).required()
  }).required(),
  rules: Joi.array().items(
    Joi.object({
      title: Joi.string().allow(''),
      description: Joi.string().allow('')
    })
  ).default([]),
  managers: Joi.array().items(Joi.string()).default([])
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
