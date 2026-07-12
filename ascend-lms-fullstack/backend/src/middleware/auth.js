const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// Verifies JWT access token and attaches the user to req.user
const authenticate = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'You are not logged in. Please log in to get access.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token. Please log in again.');
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new ApiError(401, 'The user belonging to this token no longer exists.');
  }
  if (!currentUser.isActive) {
    throw new ApiError(403, 'This account has been deactivated.');
  }

  req.user = currentUser;
  next();
});

// Role based access control middleware factory
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, `Access denied. Requires role: ${roles.join(' or ')}`);
    }
    next();
  };
};

module.exports = { authenticate, authorize };
