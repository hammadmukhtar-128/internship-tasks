const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const issueTokens = async (user, res) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  res.cookie('refreshToken', refreshToken, cookieOptions);
  return accessToken;
};

// @desc Register a new user
const register = catchAsync(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({ fullName, email, password, role: role || 'student' });
  const accessToken = await issueTokens(user, res);

  emailService.sendWelcomeEmail(user.email, user.fullName);

  res.status(201).json(new ApiResponse(201, 'Registration successful', { user, accessToken }));
});

// @desc Login
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  const accessToken = await issueTokens(user, res);
  res.status(200).json(new ApiResponse(200, 'Login successful', { user, accessToken }));
});

// @desc Logout
const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
  }
  res.clearCookie('refreshToken', cookieOptions);
  res.status(200).json(new ApiResponse(200, 'Logged out successfully'));
});

// @desc Refresh access token using refresh token cookie
const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, 'No refresh token provided');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const accessToken = generateAccessToken(user._id, user.role);
  res.status(200).json(new ApiResponse(200, 'Token refreshed', { accessToken }));
});

// @desc Forgot password - sends reset email
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // Avoid leaking which emails are registered
    return res.status(200).json(new ApiResponse(200, 'If that email exists, a reset link has been sent'));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await emailService.sendForgotPasswordEmail(user.email, resetUrl);

  res.status(200).json(new ApiResponse(200, 'If that email exists, a reset link has been sent'));
});

// @desc Reset password using token from email
const resetPassword = catchAsync(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) throw new ApiError(400, 'Token is invalid or has expired');

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, 'Password reset successful. Please log in.'));
});

// @desc Change password while logged in
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, 'Password changed successfully'));
});

// @desc Get logged-in user's profile
const getProfile = catchAsync(async (req, res) => {
  res.status(200).json(new ApiResponse(200, 'Profile fetched', { user: req.user }));
});

// @desc Update logged-in user's profile
const updateProfile = catchAsync(async (req, res) => {
  const allowedFields = ['fullName', 'phone', 'bio'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });
  if (req.file) {
    updates.profileImage = `/uploads/profiles/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json(new ApiResponse(200, 'Profile updated successfully', { user }));
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile
};
