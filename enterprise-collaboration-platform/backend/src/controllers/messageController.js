const Message = require('../models/Message');
const Channel = require('../models/Channel');
const ActivityLog = require('../models/ActivityLog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

exports.getChannelMessages = catchAsync(async (req, res, next) => {
  const { channelId } = req.params;
  const { before, limit = 30 } = req.query;

  const channel = await Channel.findById(channelId);
  if (!channel) return next(new AppError('Channel not found.', 404));

  const filter = { channel: channelId, isDeleted: false };
  if (before) filter.createdAt = { $lt: new Date(before) };

  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10))
    .populate('sender', 'name avatar status')
    .populate('mentions', 'name')
    .populate({ path: 'replyTo', populate: { path: 'sender', select: 'name' } });

  sendSuccess(res, 200, 'Messages fetched', { messages: messages.reverse() });
});

exports.searchMessages = catchAsync(async (req, res) => {
  const { q, team, channel, user, limit = 50 } = req.query;
  const filter = { isDeleted: false };

  if (q) filter.$text = { $search: q };
  if (team) filter.team = team;
  if (channel) filter.channel = channel;
  if (user) filter.sender = user;

  const messages = await Message.find(filter)
    .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
    .limit(parseInt(limit, 10))
    .populate('sender', 'name avatar')
    .populate('channel', 'name team');

  sendSuccess(res, 200, 'Search results', { messages, count: messages.length });
});

exports.editMessage = catchAsync(async (req, res, next) => {
  const { content } = req.body;
  const message = await Message.findById(req.params.id);

  if (!message) return next(new AppError('Message not found.', 404));
  if (message.sender.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only edit your own messages.', 403));
  }

  message.content = content;
  message.isEdited = true;
  await message.save();

  await ActivityLog.create({
    user: req.user._id,
    action: 'message_edited',
    entityType: 'Message',
    entityId: message._id,
    team: message.team,
    ipAddress: req.ip,
  });

  sendSuccess(res, 200, 'Message updated', { message });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findById(req.params.id);
  if (!message) return next(new AppError('Message not found.', 404));

  const isOwner = message.sender.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin' || req.user.role === 'team_owner';
  if (!isOwner && !isAdmin) {
    return next(new AppError('You do not have permission to delete this message.', 403));
  }

  message.isDeleted = true;
  message.deletedAt = new Date();
  message.content = '';
  await message.save();

  await ActivityLog.create({
    user: req.user._id,
    action: 'message_deleted',
    entityType: 'Message',
    entityId: message._id,
    team: message.team,
    ipAddress: req.ip,
  });

  sendSuccess(res, 200, 'Message deleted');
});

exports.markChannelRead = catchAsync(async (req, res) => {
  const { channelId } = req.params;

  await Message.updateMany(
    { channel: channelId, 'readBy.user': { $ne: req.user._id } },
    { $push: { readBy: { user: req.user._id, readAt: new Date() } } }
  );

  sendSuccess(res, 200, 'Channel marked as read');
});

exports.toggleReaction = catchAsync(async (req, res, next) => {
  const { emoji } = req.body;
  const message = await Message.findById(req.params.id);
  if (!message) return next(new AppError('Message not found.', 404));

  let reaction = message.reactions.find((r) => r.emoji === emoji);
  if (!reaction) {
    reaction = { emoji, users: [req.user._id] };
    message.reactions.push(reaction);
  } else {
    const idx = reaction.users.findIndex((u) => u.toString() === req.user._id.toString());
    if (idx >= 0) {
      reaction.users.splice(idx, 1);
      if (reaction.users.length === 0) {
        message.reactions = message.reactions.filter((r) => r.emoji !== emoji);
      }
    } else {
      reaction.users.push(req.user._id);
    }
  }

  await message.save();
  sendSuccess(res, 200, 'Reaction updated', { message });
});
