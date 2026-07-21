const { body, query } = require('express-validator');

const sendMessageValidator = [
  body('channel').isMongoId().withMessage('A valid channel id is required'),
  body('content')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Message content is too long'),
];

const searchMessageValidator = [
  query('q').optional().isString(),
  query('team').optional().isMongoId(),
  query('channel').optional().isMongoId(),
  query('user').optional().isMongoId(),
];

module.exports = { sendMessageValidator, searchMessageValidator };
