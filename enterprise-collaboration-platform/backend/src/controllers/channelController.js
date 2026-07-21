const Channel = require('../models/Channel');
const Team = require('../models/Team');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { cache } = require('../config/redis');

const logActivity = (action, req, extra = {}) =>
  ActivityLog.create({
    user: req.user._id,
    action,
    entityType: 'Channel',
    entityId: extra.entityId,
    team: extra.team,
    description: extra.description || '',
    ipAddress: req.ip,
  }).catch(() => {});

exports.createChannel = catchAsync(async (req, res, next) => {
  const { name, team, type = 'public', description } = req.body;

  const teamDoc = await Team.findById(team);
  if (!teamDoc) return next(new AppError('Team not found.', 404));

  const isMember = teamDoc.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!isMember && req.user.role !== 'admin') {
    return next(new AppError('You must be a team member to create a channel.', 403));
  }

  const existing = await Channel.findOne({ team, name: name.toLowerCase() });
  if (existing) return next(new AppError('A channel with this name already exists in the team.', 409));

  const channel = await Channel.create({
    name: name.toLowerCase().replace(/\s+/g, '-'),
    team,
    type,
    description,
    createdBy: req.user._id,
    members: type === 'private' ? [req.user._id] : teamDoc.members.map((m) => m.user),
  });

  // Notify team members of new public channel
  if (type === 'public') {
    const recipients = teamDoc.members
      .map((m) => m.user)
      .filter((id) => id.toString() !== req.user._id.toString());
    if (recipients.length) {
      await Notification.insertMany(
        recipients.map((r) => ({
          recipient: r,
          sender: req.user._id,
          type: 'channel_created',
          title: `New channel #${channel.name}`,
          body: `${req.user.name} created #${channel.name} in ${teamDoc.name}`,
          team: teamDoc._id,
          channel: channel._id,
        }))
      );
    }
  }

  await logActivity('channel_created', req, { entityId: channel._id, team: teamDoc._id, description: `Created #${channel.name}` });
  await cache.del('channels:*');

  sendSuccess(res, 201, 'Channel created', { channel });
});

exports.getTeamChannels = catchAsync(async (req, res, next) => {
  const { teamId } = req.params;
  const isAdmin = req.user.role === 'admin';

  const filter = { team: teamId, isArchived: false };
  const channels = await Channel.find(
    isAdmin ? filter : { ...filter, $or: [{ type: 'public' }, { members: req.user._id }] }
  ).sort({ name: 1 });

  sendSuccess(res, 200, 'Channels fetched', { channels });
});

exports.getChannel = catchAsync(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id).populate('members', 'name avatar status');
  if (!channel) return next(new AppError('Channel not found.', 404));

  const isMember = channel.members.some((m) => m._id.toString() === req.user._id.toString());
  if (channel.type === 'private' && !isMember && req.user.role !== 'admin') {
    return next(new AppError('You do not have access to this private channel.', 403));
  }

  sendSuccess(res, 200, 'Channel fetched', { channel });
});

exports.updateChannel = catchAsync(async (req, res, next) => {
  const allowed = ['name', 'description', 'isArchived'];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const channel = await Channel.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!channel) return next(new AppError('Channel not found.', 404));

  await logActivity('channel_updated', req, { entityId: channel._id, team: channel.team, description: 'Channel updated' });
  await cache.del('channels:*');

  sendSuccess(res, 200, 'Channel updated', { channel });
});

exports.deleteChannel = catchAsync(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) return next(new AppError('Channel not found.', 404));

  if (channel.name === 'general') {
    return next(new AppError('The general channel cannot be deleted.', 400));
  }

  await channel.deleteOne();
  await logActivity('channel_deleted', req, { entityId: channel._id, team: channel.team, description: `Deleted #${channel.name}` });
  await cache.del('channels:*');

  sendSuccess(res, 200, 'Channel deleted');
});

exports.joinChannel = catchAsync(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) return next(new AppError('Channel not found.', 404));
  if (channel.type === 'private') return next(new AppError('Cannot join a private channel directly.', 403));

  if (!channel.members.includes(req.user._id)) {
    channel.members.push(req.user._id);
    await channel.save();
  }

  sendSuccess(res, 200, 'Joined channel', { channel });
});

exports.leaveChannel = catchAsync(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) return next(new AppError('Channel not found.', 404));

  channel.members = channel.members.filter((m) => m.toString() !== req.user._id.toString());
  await channel.save();

  sendSuccess(res, 200, 'Left channel');
});

exports.addMembersToChannel = catchAsync(async (req, res, next) => {
  const { userIds } = req.body;
  const channel = await Channel.findById(req.params.id);
  if (!channel) return next(new AppError('Channel not found.', 404));

  const newMembers = userIds.filter((id) => !channel.members.map(String).includes(id));
  channel.members.push(...newMembers);
  await channel.save();

  sendSuccess(res, 200, 'Members added to channel', { channel });
});
