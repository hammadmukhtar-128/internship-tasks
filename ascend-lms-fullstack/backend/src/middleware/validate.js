const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after express-validator chains; collects errors and forwards a single ApiError
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => `${e.path}: ${e.msg}`);
    return next(new ApiError(422, 'Validation failed', formatted));
  }
  next();
};

module.exports = validate;
