const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Notification = require('../models/Notification');

// @desc Get logged-in user's notifications, paginated
const getMyNotifications = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 15;

  const filter = { recipient: req.user._id };
  if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';

  const total = await Notification.countDocuments(filter);
  const notifications = await Notification.find(filter)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

  res.status(200).json(
    new ApiResponse(200, 'Notifications fetched successfully', notifications, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount
    })
  );
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json(new ApiResponse(200, 'Notification marked as read', { notification }));
});

const markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json(new ApiResponse(200, 'All notifications marked as read'));
});

const deleteNotification = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json(new ApiResponse(200, 'Notification deleted successfully'));
});

// @desc Create a general notification (admin only, e.g. announcements)
const createNotification = catchAsync(async (req, res) => {
  const { recipient, type, title, message, relatedId } = req.body;
  const notification = await Notification.create({ recipient, type, title, message, relatedId });
  res.status(201).json(new ApiResponse(201, 'Notification created successfully', { notification }));
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, createNotification };
