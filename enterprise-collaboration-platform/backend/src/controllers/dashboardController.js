const Team = require('../models/Team');
const Channel = require('../models/Channel');
const Message = require('../models/Message');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const { cache } = require('../config/redis');

exports.getOverview = catchAsync(async (req, res) => {
  const cacheKey = `dashboard:overview:${req.user._id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return sendSuccess(res, 200, 'Dashboard overview', { ...cached, fromCache: true });

  const isAdmin = req.user.role === 'admin';
  const teamFilter = isAdmin ? {} : { 'members.user': req.user._id };

  const teams = await Team.find({ ...teamFilter, isActive: true }).select('_id');
  const teamIds = teams.map((t) => t._id);

  const [teamCount, channelCount, messageCount, memberCount] = await Promise.all([
    Team.countDocuments(isAdmin ? { isActive: true } : { _id: { $in: teamIds } }),
    Channel.countDocuments({ team: { $in: teamIds } }),
    Message.countDocuments({ team: { $in: teamIds }, isDeleted: false }),
    isAdmin
      ? User.countDocuments({ isActive: true })
      : Team.aggregate([
          { $match: { _id: { $in: teamIds } } },
          { $unwind: '$members' },
          { $group: { _id: '$members.user' } },
          { $count: 'total' },
        ]).then((r) => r[0]?.total || 0),
  ]);

  // Messages per day for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const messageTrend = await Message.aggregate([
    { $match: { team: { $in: teamIds }, createdAt: { $gte: sevenDaysAgo }, isDeleted: false } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const activeMembersPerTeam = await Team.aggregate([
    { $match: { _id: { $in: teamIds } } },
    { $project: { name: 1, memberCount: { $size: '$members' } } },
    { $sort: { memberCount: -1 } },
    { $limit: 6 },
  ]);

  const payload = {
    stats: {
      teams: teamCount,
      channels: channelCount,
      messages: messageCount,
      members: memberCount,
    },
    messageTrend,
    teamDistribution: activeMembersPerTeam,
  };

  await cache.set(cacheKey, payload, 30);
  sendSuccess(res, 200, 'Dashboard overview', payload);
});

exports.getRecentActivity = catchAsync(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const filter = isAdmin ? {} : { user: req.user._id };

  const activity = await ActivityLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('user', 'name avatar')
    .populate('team', 'name');

  sendSuccess(res, 200, 'Recent activity fetched', { activity });
});
