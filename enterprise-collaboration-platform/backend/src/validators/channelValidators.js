const { body } = require('express-validator');

const createChannelValidator = [
  body('name').trim().isLength({ min: 1, max: 60 }).withMessage('Channel name must be 1-60 characters'),
  body('team').isMongoId().withMessage('A valid team id is required'),
  body('type').optional().isIn(['public', 'private']).withMessage('Invalid channel type'),
  body('description').optional().isLength({ max: 300 }),
];

const updateChannelValidator = [
  body('name').optional().trim().isLength({ min: 1, max: 60 }),
  body('description').optional().isLength({ max: 300 }),
  body('isArchived').optional().isBoolean(),
];

module.exports = { createChannelValidator, updateChannelValidator };
