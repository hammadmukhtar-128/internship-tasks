const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const Team = require('../models/Team');
const Channel = require('../models/Channel');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { sendEmail } = require('../utils/email');
const { cache } = require('../config/redis');
const env = require('../config/env');

const logActivity = (action, req, extra = {}) =>
  ActivityLog.create({
    user: req.user._id,
    action,
    entityType: 'Team',
    entityId: extra.entityId,
    team: extra.team,
    description: extra.description || '',
    ipAddress: req.ip,
  }).catch(() => {});

exports.createTeam = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Team.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const team = await Team.create({
    name,
    slug,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  });

  // Create a default "general" channel
  await Channel.create({
    name: 'general',
    team: team._id,
    type: 'public',
    createdBy: req.user._id,
    members: [req.user._id],
    description: 'General discussion for the whole team',
  });

  if (req.user.role === 'member') {
    req.user.role = 'team_owner';
    await req.user.save({ validateBeforeSave: false });
  }

  await logActivity('team_created', req, { entityId: team._id, team: team._id, description: `Created team "${name}"` });
  await cache.del('dashboard:*');

  sendSuccess(res, 201, 'Team created successfully', { team });
});

exports.getMyTeams = catchAsync(async (req, res) => {
  const cacheKey = `teams:user:${req.user._id}`;
  const cached = await cache.get(cacheKey);
  if (cached) return sendSuccess(res, 200, 'Teams fetched', { teams: cached, fromCache: true });

  const teams =
    req.user.role === 'admin'
      ? await Team.find({ isActive: true }).populate('owner', 'name email avatar')
      : await Team.find({ 'members.user': req.user._id, isActive: true }).populate(
          'owner',
          'name email avatar'
        );

  await cache.set(cacheKey, teams, 30);
  sendSuccess(res, 200, 'Teams fetched', { teams });
});

exports.getTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id)
    .populate('owner', 'name email avatar status')
    .populate('members.user', 'name email avatar status title lastSeen');

  if (!team) return next(new AppError('Team not found.', 404));
  sendSuccess(res, 200, 'Team fetched', { team });
});

exports.updateTeam = catchAsync(async (req, res, next) => {
  const allowed = ['name', 'description', 'avatar', 'settings'];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const team = await Team.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  await logActivity('team_updated', req, { entityId: team._id, team: team._id, description: 'Team settings updated' });
  await cache.del(`teams:*`);

  sendSuccess(res, 200, 'Team updated', { team });
});

exports.deleteTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id);
  if (!team) return next(new AppError('Team not found.', 404));

  team.isActive = false;
  await team.save();

  await logActivity('team_deleted', req, { entityId: team._id, team: team._id, description: `Deleted team "${team.name}"` });
  await cache.del('teams:*');

  sendSuccess(res, 200, 'Team deleted');
});

exports.inviteMember = catchAsync(async (req, res, next) => {
  const { email, role = 'member' } = req.body;
  const team = req.team;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const alreadyMember = team.members.some((m) => m.user.toString() === existingUser._id.toString());
    if (alreadyMember) return next(new AppError('User is already a member of this team.', 409));
  }

  let invitation = await Invitation.findOne({ team: team._id, email, status: 'pending' });
  if (!invitation) {
    invitation = await Invitation.create({
      team: team._id,
      email,
      invitedBy: req.user._id,
      role,
      token: Invitation.generateToken(),
    });
  }

  const inviteUrl = `${env.CLIENT_URL}/invite/${invitation.token}`;
  sendEmail({
    to: email,
    subject: `You've been invited to join ${team.name}`,
    html: `<p>${req.user.name} invited you to join <strong>${team.name}</strong> on Enterprise Collab.</p>
           <a href="${inviteUrl}">Accept Invitation</a>`,
    text: `You've been invited to join ${team.name}. Accept: ${inviteUrl}`,
  }).catch(() => {});

  if (existingUser) {
    await Notification.create({
      recipient: existingUser._id,
      sender: req.user._id,
      type: 'team_invite',
      title: `Invitation to join ${team.name}`,
      body: `${req.user.name} invited you to join ${team.name}`,
      team: team._id,
    });
  }

  sendSuccess(res, 201, 'Invitation sent', { invitation });
});

exports.acceptInvitation = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const invitation = await Invitation.findOne({ token, status: 'pending' });

  if (!invitation) return next(new AppError('Invitation not found or already used.', 404));
  if (invitation.expiresAt < Date.now()) {
    invitation.status = 'expired';
    await invitation.save();
    return next(new AppError('This invitation has expired.', 410));
  }

  if (req.user.email !== invitation.email) {
    return next(new AppError('This invitation was sent to a different email address.', 403));
  }

  const team = await Team.findById(invitation.team);
  if (!team) return next(new AppError('Team no longer exists.', 404));

  const alreadyMember = team.members.some((m) => m.user.toString() === req.user._id.toString());
  if (!alreadyMember) {
    team.members.push({ user: req.user._id, role: invitation.role });
    await team.save();

    const generalChannel = await Channel.findOne({ team: team._id, name: 'general' });
    if (generalChannel && !generalChannel.members.includes(req.user._id)) {
      generalChannel.members.push(req.user._id);
      await generalChannel.save();
    }
  }

  invitation.status = 'accepted';
  await invitation.save();

  await logActivity('member_added', req, { entityId: req.user._id, team: team._id, description: `${req.user.name} joined ${team.name}` });
  await cache.del('teams:*');

  sendSuccess(res, 200, 'Invitation accepted. Welcome to the team!', { team });
});

exports.removeMember = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;
  const team = req.team;

  if (memberId === team.owner.toString()) {
    return next(new AppError('Cannot remove the team owner.', 400));
  }

  team.members = team.members.filter((m) => m.user.toString() !== memberId);
  await team.save();

  await Channel.updateMany({ team: team._id }, { $pull: { members: memberId } });

  await Notification.create({
    recipient: memberId,
    sender: req.user._id,
    type: 'removed_from_team',
    title: `Removed from ${team.name}`,
    body: `You have been removed from ${team.name}.`,
    team: team._id,
  });

  await logActivity('member_removed', req, { entityId: memberId, team: team._id, description: 'Member removed from team' });
  await cache.del('teams:*');

  sendSuccess(res, 200, 'Member removed');
});

exports.updateMemberRole = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;
  const { role } = req.body;
  const team = req.team;

  if (!['owner', 'member'].includes(role)) {
    return next(new AppError('Invalid role.', 400));
  }

  const membership = team.members.find((m) => m.user.toString() === memberId);
  if (!membership) return next(new AppError('User is not a member of this team.', 404));

  membership.role = role;
  await team.save();

  await logActivity('role_changed', req, { entityId: memberId, team: team._id, description: `Role changed to ${role}` });

  sendSuccess(res, 200, 'Member role updated', { team });
});
