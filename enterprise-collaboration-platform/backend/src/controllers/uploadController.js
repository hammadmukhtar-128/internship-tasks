const ActivityLog = require('../models/ActivityLog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

exports.uploadFile = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded.', 400));

  const fileData = {
    url: `/uploads/${req.file.filename}`,
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
  };

  await ActivityLog.create({
    user: req.user._id,
    action: 'file_uploaded',
    entityType: 'Message',
    description: `Uploaded ${req.file.originalname}`,
    ipAddress: req.ip,
  });

  sendSuccess(res, 201, 'File uploaded successfully', { file: fileData });
});

exports.uploadMultiple = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next(new AppError('No files uploaded.', 400));

  const files = req.files.map((file) => ({
    url: `/uploads/${file.filename}`,
    filename: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  }));

  sendSuccess(res, 201, 'Files uploaded successfully', { files });
});
