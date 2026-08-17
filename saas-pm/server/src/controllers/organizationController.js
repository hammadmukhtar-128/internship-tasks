const Organization = require('../models/Organization');
const User = require('../models/User');
const logActivity = require('../utils/logActivity');

// @desc Get organizations current user belongs to
// @route GET /api/organizations
const getOrganizations = async (req, res, next) => {
  try {
    const orgs = await Organization.find({ 'members.user': req.user._id }).populate('members.user', 'name email avatarColor');
    res.json({ success: true, data: orgs });
  } catch (err) {
    next(err);
  }
};

// @desc Create a new organization
// @route POST /api/organizations
const createOrganization = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Organization name is required' });

    const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const org = await Organization.create({
      name,
      description: description || '',
      owner: req.user._id,
      slug,
      members: [{ user: req.user._id, role: 'Owner' }],
    });

    await logActivity({
      organization: org._id,
      user: req.user._id,
      action: 'created',
      entityType: 'Organization',
      entityId: org._id,
      description: `${req.user.name} created organization "${org.name}"`,
    });

    res.status(201).json({ success: true, data: org });
  } catch (err) {
    next(err);
  }
};

// @desc Get single organization
// @route GET /api/organizations/:id
const getOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id).populate('members.user', 'name email avatarColor');
    if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
    res.json({ success: true, data: org });
  } catch (err) {
    next(err);
  }
};

// @desc Update organization
// @route PUT /api/organizations/:id
const updateOrganization = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (name) req.organization.name = name;
    if (description !== undefined) req.organization.description = description;
    await req.organization.save();
    res.json({ success: true, data: req.organization });
  } catch (err) {
    next(err);
  }
};

// @desc Delete organization
// @route DELETE /api/organizations/:id
const deleteOrganization = async (req, res, next) => {
  try {
    if (req.organization.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the owner can delete this organization' });
    }
    await req.organization.deleteOne();
    res.json({ success: true, message: 'Organization deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc Update a member's role
// @route PATCH /api/organizations/:id/members/:userId
const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['Admin', 'Member', 'Viewer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const member = req.organization.members.find((m) => m.user.toString() === req.params.userId);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    member.role = role;
    await req.organization.save();
    res.json({ success: true, data: req.organization });
  } catch (err) {
    next(err);
  }
};

// @desc Remove a member
// @route DELETE /api/organizations/:id/members/:userId
const removeMember = async (req, res, next) => {
  try {
    if (req.organization.owner.toString() === req.params.userId) {
      return res.status(400).json({ success: false, message: 'Cannot remove the organization owner' });
    }
    req.organization.members = req.organization.members.filter((m) => m.user.toString() !== req.params.userId);
    await req.organization.save();
    res.json({ success: true, data: req.organization });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrganizations,
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  updateMemberRole,
  removeMember,
};
