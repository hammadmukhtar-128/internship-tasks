const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Team = require('../models/Team');

/**
 * Loads the team from :teamId (or req.body.team) and verifies req.user is a member.
 * Attaches req.team and req.teamMembership ({ role }) for downstream handlers.
 */
const requireTeamMember = catchAsync(async (req, res, next) => {
  const teamId = req.params.teamId || req.body.team || req.params.id;
  const team = await Team.findById(teamId);

  if (!team || !team.isActive) {
    return next(new AppError('Team not found.', 404));
  }

  if (req.user.role === 'admin') {
    req.team = team;
    req.teamMembership = { role: 'owner' };
    return next();
  }

  const membership = team.members.find((m) => m.user.toString() === req.user._id.toString());
  if (!membership) {
    return next(new AppError('You are not a member of this team.', 403));
  }

  req.team = team;
  req.teamMembership = membership;
  next();
});

/**
 * Requires the user to be the team owner (or platform admin).
 */
const requireTeamOwner = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') return next();
  if (!req.teamMembership || req.teamMembership.role !== 'owner') {
    return next(new AppError('Only the team owner can perform this action.', 403));
  }
  next();
});

module.exports = { requireTeamMember, requireTeamOwner };
