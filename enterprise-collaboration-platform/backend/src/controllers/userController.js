const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

exports.updateMe = catchAsync(async (req, res, next) => {
  const allowed = ['name', 'title', 'avatar'];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, 200, 'Profile updated', { user: user.toSafeObject() });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  if (!['online', 'away', 'offline'].includes(status)) {
    return next(new AppError('Invalid status value.', 400));
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { status, lastSeen: new Date() },
    { new: true }
  );
  sendSuccess(res, 200, 'Status updated', { user: user.toSafeObject() });
});

exports.searchUsers = catchAsync(async (req, res) => {
  const { q = '', limit = 20 } = req.query;
  const filter = q
    ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }] }
    : {};

  const users = await User.find({ ...filter, isActive: true })
    .select('name email avatar status title lastSeen role')
    .limit(parseInt(limit, 10));

  sendSuccess(res, 200, 'Users fetched', { users });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('name email avatar status title lastSeen role createdAt');
  if (!user) return next(new AppError('User not found.', 404));
  sendSuccess(res, 200, 'User fetched', { user });
});
