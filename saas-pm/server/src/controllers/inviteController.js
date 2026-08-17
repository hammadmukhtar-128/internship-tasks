const TeamInvite = require('../models/TeamInvite');
const Organization = require('../models/Organization');
const User = require('../models/User');
const logActivity = require('../utils/logActivity');

// @desc List invites for an organization
// @route GET /api/invites?organization=<id>
const getInvites = async (req, res, next) => {
  try {
    const orgId = req.query.organization || req.user.currentOrganization;
    const invites = await TeamInvite.find({ organization: orgId }).populate('invitedBy', 'name email').sort('-createdAt');
    res.json({ success: true, data: invites });
  } catch (err) {
    next(err);
  }
};

// @desc Send invite
// @route POST /api/invites
const createInvite = async (req, res, next) => {
  try {
    const { email, role, organization } = req.body;
    const orgId = organization || req.user.currentOrganization;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && org.members.some((m) => m.user.toString() === existingUser._id.toString())) {
      return res.status(409).json({ success: false, message: 'User is already a member of this organization' });
    }

    const existingInvite = await TeamInvite.findOne({ organization: orgId, email: email.toLowerCase(), status: 'Pending' });
    if (existingInvite) {
      return res.status(409).json({ success: false, message: 'An invitation is already pending for this email' });
    }

    const invite = await TeamInvite.create({
      organization: orgId,
      email: email.toLowerCase(),
      role: role || 'Member',
      invitedBy: req.user._id,
    });

    // Development-friendly flow: no external email provider required.
    // The invite token/link is returned directly in the API response so the
    // frontend can show a "copy invite link" action, and it also appears
    // in the invites list for the org admins.
    const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/accept-invite/${invite.token}`;

    await logActivity({
      organization: orgId,
      user: req.user._id,
      action: 'invited',
      entityType: 'Organization',
      entityId: org._id,
      description: `${req.user.name} invited ${email} to join as ${invite.role}`,
    });

    res.status(201).json({ success: true, data: invite, inviteLink });
  } catch (err) {
    next(err);
  }
};

// @desc Accept invite (by token)
// @route PATCH /api/invites/:token/accept
const acceptInvite = async (req, res, next) => {
  try {
    const invite = await TeamInvite.findOne({ token: req.params.token });
    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
    if (invite.status !== 'Pending') return res.status(400).json({ success: false, message: `Invite already ${invite.status.toLowerCase()}` });
    if (invite.expiresAt < new Date()) {
      invite.status = 'Expired';
      await invite.save();
      return res.status(400).json({ success: false, message: 'This invite has expired' });
    }
    if (invite.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'This invite was sent to a different email address' });
    }

    const org = await Organization.findById(invite.organization);
    if (!org.members.some((m) => m.user.toString() === req.user._id.toString())) {
      org.members.push({ user: req.user._id, role: invite.role });
      await org.save();
    }

    invite.status = 'Accepted';
    await invite.save();

    req.user.currentOrganization = org._id;
    await req.user.save();

    await logActivity({
      organization: org._id,
      user: req.user._id,
      action: 'joined',
      entityType: 'Organization',
      entityId: org._id,
      description: `${req.user.name} joined the organization`,
    });

    res.json({ success: true, data: { organization: org } });
  } catch (err) {
    next(err);
  }
};

// @desc Reject invite
// @route PATCH /api/invites/:token/reject
const rejectInvite = async (req, res, next) => {
  try {
    const invite = await TeamInvite.findOne({ token: req.params.token });
    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
    invite.status = 'Rejected';
    await invite.save();
    res.json({ success: true, data: invite });
  } catch (err) {
    next(err);
  }
};

// @desc Cancel invite
// @route DELETE /api/invites/:id
const cancelInvite = async (req, res, next) => {
  try {
    const invite = await TeamInvite.findById(req.params.id);
    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
    await invite.deleteOne();
    res.json({ success: true, message: 'Invite cancelled' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInvites, createInvite, acceptInvite, rejectInvite, cancelInvite };
