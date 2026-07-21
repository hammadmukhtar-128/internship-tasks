const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const { cache } = require('../config/redis');

exports.getMyNotifications = catchAsync(async (req, res) => {
  const { limit = 30, unreadOnly } = req.query;
  const cacheKey = `notifications:${req.user._id}:${unreadOnly || 'all'}`;

  const cached = await cache.get(cacheKey);
  if (cached) return sendSuccess(res, 200, 'Notifications fetched', { notifications: cached, fromCache: true });

  const filter = { recipient: req.user._id };
  if (unreadOnly === 'true') filter.isRead = false;

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10))
    .populate('sender', 'name avatar')
    .populate('team', 'name')
    .populate('channel', 'name');

  await cache.set(cacheKey, notifications, 20);
  sendSuccess(res, 200, 'Notifications fetched', { notifications });
});

exports.getUnreadCount = catchAsync(async (req, res) => {
  const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
  sendSuccess(res, 200, 'Unread count fetched', { count });
});

exports.markAsRead = catchAsync(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true }
  );
  await cache.del(`notifications:${req.user._id}:*`);
  sendSuccess(res, 200, 'Notification marked as read');
});

exports.markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  await cache.del(`notifications:${req.user._id}:*`);
  sendSuccess(res, 200, 'All notifications marked as read');
});

exports.deleteNotification = catchAsync(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
  await cache.del(`notifications:${req.user._id}:*`);
  sendSuccess(res, 200, 'Notification deleted');
});
