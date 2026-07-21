const crypto = require('crypto');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendEmail, passwordResetTemplate, welcomeTemplate } = require('../utils/email');
const env = require('../config/env');

const buildTokens = (user) => {
  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });
  return { accessToken, refreshToken };
};

const logActivity = (action, req, extra = {}) =>
  ActivityLog.create({
    user: req.user?._id || extra.user,
    action,
    entityType: 'User',
    entityId: req.user?._id || extra.user,
    ipAddress: req.ip,
    description: extra.description || '',
    metadata: extra.metadata || {},
  }).catch(() => {});

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  // First user on the platform becomes an admin automatically (bootstrap convenience)
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? 'admin' : 'member';

  const user = await User.create({ name, email, password, role });
  const { accessToken, refreshToken } = buildTokens(user);
  user.refreshTokens.push({ token: refreshToken });
  await user.save({ validateBeforeSave: false });

  await logActivity('user_register', { user, ip: req.ip });

  sendEmail({
    to: user.email,
    subject: 'Welcome to Enterprise Collab',
    html: welcomeTemplate(user.name),
    text: `Welcome to Enterprise Collab, ${user.name}!`,
  }).catch(() => {});

  sendSuccess(res, 201, 'Registration successful', {
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Contact an administrator.', 403));
  }

  const { accessToken, refreshToken } = buildTokens(user);
  user.refreshTokens.push({ token: refreshToken });
  user.status = 'online';
  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  await logActivity('user_login', { user, ip: req.ip });

  sendSuccess(res, 200, 'Login successful', {
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
  });
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new AppError('Refresh token is required.', 400));

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token.', 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError('User no longer exists.', 401));

  const hasToken = user.refreshTokens.some((t) => t.token === refreshToken);
  if (!hasToken) return next(new AppError('Refresh token has been revoked.', 401));

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  sendSuccess(res, 200, 'Token refreshed', { accessToken });
});

exports.logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    req.user.refreshTokens = req.user.refreshTokens.filter((t) => t.token !== refreshToken);
  }
  req.user.status = 'offline';
  req.user.lastSeen = new Date();
  await req.user.save({ validateBeforeSave: false });

  await logActivity('user_logout', req);
  sendSuccess(res, 200, 'Logged out successfully');
});

exports.getMe = catchAsync(async (req, res) => {
  sendSuccess(res, 200, 'Current user', { user: req.user.toSafeObject() });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way to avoid leaking which emails are registered
  const genericMessage = 'If an account with that email exists, a reset link has been sent.';

  if (!user) return sendSuccess(res, 200, genericMessage);

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Your password reset link (valid for 10 minutes)',
      html: passwordResetTemplate(user.name, resetUrl),
      text: `Reset your password: ${resetUrl}`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }

  sendSuccess(res, 200, genericMessage);
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired.', 400));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = []; // invalidate all sessions
  await user.save();

  await logActivity('password_reset', { user, ip: req.ip });

  const { accessToken, refreshToken } = buildTokens(user);
  user.refreshTokens.push({ token: refreshToken });
  await user.save({ validateBeforeSave: false });

  sendSuccess(res, 200, 'Password reset successful', { accessToken, refreshToken });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  user.refreshTokens = [];
  await user.save();

  const { accessToken, refreshToken } = buildTokens(user);
  user.refreshTokens.push({ token: refreshToken });
  await user.save({ validateBeforeSave: false });

  sendSuccess(res, 200, 'Password updated successfully', { accessToken, refreshToken });
});
