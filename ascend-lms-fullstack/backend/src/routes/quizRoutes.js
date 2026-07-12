const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticate, authorize } = require('../middleware/auth');
const { quizValidator, attemptValidator } = require('../validators/quizValidator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz creation, attempts and results
 */

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Get all quizzes - filter by course, search, paginate
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of quizzes }
 *   post:
 *     summary: Create quiz with questions (Instructor - own course only)
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Quiz created }
 */
router.get('/', authenticate, quizController.getAllQuizzes);
router.post('/', authenticate, authorize('instructor', 'admin'), quizValidator, validate, quizController.createQuiz);

router.get('/my-results', authenticate, authorize('student'), quizController.getMyResults);

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get quiz by id (correct answers hidden from students)
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Quiz found }
 *   put:
 *     summary: Update quiz / edit questions (Instructor - own only)
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Quiz updated }
 *   delete:
 *     summary: Delete quiz (Instructor - own only)
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Quiz deleted }
 */
router
  .route('/:id')
  .get(authenticate, quizController.getQuizById)
  .put(authenticate, authorize('instructor', 'admin'), quizController.updateQuiz)
  .delete(authenticate, authorize('instructor', 'admin'), quizController.deleteQuiz);

/**
 * @swagger
 * /quizzes/{id}/attempt:
 *   post:
 *     summary: Attempt/submit a quiz (Student) - score calculated automatically
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Quiz submitted, score returned }
 */
router.post('/:id/attempt', authenticate, authorize('student'), attemptValidator, validate, quizController.attemptQuiz);

/**
 * @swagger
 * /quizzes/{id}/results:
 *   get:
 *     summary: Get all results for a quiz (Instructor/Admin)
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of results }
 */
router.get('/:id/results', authenticate, authorize('instructor', 'admin'), quizController.getQuizResults);

module.exports = router;
