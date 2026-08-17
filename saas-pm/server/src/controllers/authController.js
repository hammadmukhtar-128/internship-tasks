const User = require('../models/User');
const Organization = require('../models/Organization');
const generateToken = require('../utils/generateToken');

// @desc Register user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, organizationName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password });

    // Every new user gets their own default organization/workspace as Owner
    const orgName = organizationName || `${name}'s Workspace`;
    const slugBase = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const organization = await Organization.create({
      name: orgName,
      description: '',
      owner: user._id,
      slug,
      members: [{ user: user._id, role: 'Owner' }],
    });

    user.currentOrganization = organization._id;
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatarColor: user.avatarColor,
          currentOrganization: organization._id,
        },
        organization,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatarColor: user.avatarColor,
          currentOrganization: user.currentOrganization,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get current user
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('currentOrganization');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatarColor } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (avatarColor) user.avatarColor = avatarColor;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc Change password
// @route PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc Switch active organization
// @route PUT /api/auth/switch-organization/:orgId
const switchOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.orgId);
    if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
    const isMember = org.members.some((m) => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ success: false, message: 'Not a member of this organization' });

    req.user.currentOrganization = org._id;
    await req.user.save();
    res.json({ success: true, data: { currentOrganization: org } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, switchOrganization };
