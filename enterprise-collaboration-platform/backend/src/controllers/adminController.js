const User = require('../models/User');
const Team = require('../models/Team');
const Message = require('../models/Message');
const ActivityLog = require('../models/ActivityLog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { cache } = require('../config/redis');

exports.getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, q = '', role, status } = req.query;
  const filter = {};
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  if (role) filter.role = role;
  if (status) filter.isActive = status === 'active';

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
    User.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Users fetched', { users }, { total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
});

exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  if (!['admin', 'team_owner', 'member'].includes(role)) {
    return next(new AppError('Invalid role.', 400));
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return next(new AppError('User not found.', 404));

  await ActivityLog.create({
    user: req.user._id,
    action: 'role_changed',
    entityType: 'User',
    entityId: user._id,
    description: `Changed ${user.name}'s role to ${role}`,
    ipAddress: req.ip,
  });

  sendSuccess(res, 200, 'User role updated', { user: user.toSafeObject() });
});

exports.toggleUserActive = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  sendSuccess(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}`, {
    user: user.toSafeObject(),
  });
});

exports.getAllTeamsAdmin = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, q = '' } = req.query;
  const filter = q ? { name: new RegExp(q, 'i') } : {};

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [teams, total] = await Promise.all([
    Team.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('owner', 'name email'),
    Team.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Teams fetched', { teams }, { total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
});

exports.getPlatformAnalytics = catchAsync(async (req, res) => {
  const cacheKey = 'admin:analytics';
  const cached = await cache.get(cacheKey);
  if (cached) return sendSuccess(res, 200, 'Platform analytics', { ...cached, fromCache: true });

  const [totalUsers, totalTeams, totalMessages, activeToday] = await Promise.all([
    User.countDocuments(),
    Team.countDocuments({ isActive: true }),
    Message.countDocuments({ isDeleted: false }),
    User.countDocuments({ status: { $in: ['online', 'away'] } }),
  ]);

  const usersByRole = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const messageVolume = await Message.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, isDeleted: false } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const payload = {
    totals: { totalUsers, totalTeams, totalMessages, activeToday },
    usersByRole,
    userGrowth,
    messageVolume,
  };

  await cache.set(cacheKey, payload, 60);
  sendSuccess(res, 200, 'Platform analytics', payload);
});

exports.getActivityLogs = catchAsync(async (req, res) => {
  const { page = 1, limit = 30, action, userId, team } = req.query;
  const filter = {};
  if (action) filter.action = action;
  if (userId) filter.user = userId;
  if (team) filter.team = team;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('user', 'name email avatar')
      .populate('team', 'name'),
    ActivityLog.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Activity logs fetched', { logs }, { total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
});
