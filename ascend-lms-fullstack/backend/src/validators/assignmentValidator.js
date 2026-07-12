const { body } = require('express-validator');

const assignmentValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('dueDate').notEmpty().withMessage('Due date is required').isISO8601().withMessage('Due date must be a valid date'),
  body('course').notEmpty().withMessage('Course id is required').isMongoId().withMessage('Invalid course id')
];

const gradeValidator = [
  body('marks').isFloat({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100'),
  body('feedback').optional().isString()
];

module.exports = { assignmentValidator, gradeValidator };
