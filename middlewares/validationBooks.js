const Joi = require('joi');
const { httpCode } = require('../helpers/constants');

const schemaUpdateResume = Joi.object({
  rating: Joi.number().integer().max(5).optional(),
  resume: Joi.string().min(1).max(300).optional(),
});

const validate = (schema, body, next) => {
  const { error } = schema.validate(body);
  if (error) {
    const [{ message }] = error.details;

    return next({
      status: httpCode.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.validateUpdateResume = (req, _res, next) => {
  return validate(schemaUpdateResume, req.body, next);
};
