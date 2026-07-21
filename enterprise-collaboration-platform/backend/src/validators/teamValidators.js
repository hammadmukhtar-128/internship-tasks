const { body } = require('express-validator');

const createTeamValidator = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Team name must be 2-80 characters'),
  body('description').optional().isLength({ max: 300 }).withMessage('Description too long'),
];

const updateTeamValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Team name must be 2-80 characters'),
  body('description').optional().isLength({ max: 300 }).withMessage('Description too long'),
  body('settings.allowMemberInvites').optional().isBoolean(),
  body('settings.isPublicJoin').optional().isBoolean(),
];

const inviteMemberValidator = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('role').optional().isIn(['owner', 'member']).withMessage('Invalid role'),
];

module.exports = { createTeamValidator, updateTeamValidator, inviteMemberValidator };
