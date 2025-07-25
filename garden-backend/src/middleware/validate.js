const Joi = require('joi');

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        field: error.details[0].path.join('.')
      });
    }

    req.body = value; // Use the validated and transformed value
    next();
  };
}

module.exports = validate;