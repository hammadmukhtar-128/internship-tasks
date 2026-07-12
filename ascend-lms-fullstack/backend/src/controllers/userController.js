const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const ApiFeatures = require('../utils/apiFeatures');

// @desc Get all users (admin only) - supports search, filter, pagination
const getAllUsers = catchAsync(async (req, res) => {
  const total = await new ApiFeatures(User.find(), req.query).filter().search(['fullName', 'email']).query.clone().countDocuments();

  const features = new ApiFeatures(User.find(), req.query).filter().search(['fullName', 'email']).sort().limitFields().paginate();
  const users = await features.query;

  res.status(200).json(
    new ApiResponse(200, 'Users fetched successfully', users, {
      total,
      page: features.pagination.page,
      limit: features.pagination.limit,
      totalPages: Math.ceil(total / features.pagination.limit)
    })
  );
});

// @desc Get single user by id
const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse(200, 'User fetched successfully', { user }));
});

// @desc Create a new user (admin only)
const createUser = catchAsync(async (req, res) => {
  const { fullName, email, password, role, phone, bio } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'A user with this email already exists');

  const user = await User.create({ fullName, email, password, role, phone, bio });
  res.status(201).json(new ApiResponse(201, 'User created successfully', { user }));
});

// @desc Update a user (admin only)
const updateUser = catchAsync(async (req, res) => {
  const allowedFields = ['fullName', 'role', 'phone', 'bio', 'isActive'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });
  if (!user) throw new ApiError(404, 'User not found');

  res.status(200).json(new ApiResponse(200, 'User updated successfully', { user }));
});

// @desc Delete a user (admin only)
const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse(200, 'User deleted successfully'));
});

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
