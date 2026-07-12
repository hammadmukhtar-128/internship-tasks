const { body } = require('express-validator');

const quizValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('course').notEmpty().withMessage('Course id is required').isMongoId().withMessage('Invalid course id'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.questionText').notEmpty().withMessage('Question text is required'),
  body('questions.*.type').isIn(['multiple_choice', 'true_false']).withMessage('Invalid question type'),
  body('questions.*.correctAnswer').notEmpty().withMessage('Correct answer is required')
];

const attemptValidator = [
  body('answers').isArray({ min: 1 }).withMessage('Answers are required'),
  body('answers.*.question').isMongoId().withMessage('Invalid question id'),
  body('answers.*.selectedAnswer').notEmpty().withMessage('Selected answer is required')
];

module.exports = { quizValidator, attemptValidator };
