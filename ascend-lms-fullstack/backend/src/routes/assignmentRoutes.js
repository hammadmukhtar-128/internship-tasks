const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadAssignmentFile } = require('../middleware/upload');
const { assignmentValidator, gradeValidator } = require('../validators/assignmentValidator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment and submission management
 */

/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Get all assignments - filter by course, search, paginate
 *     tags: [Assignments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of assignments }
 *   post:
 *     summary: Create assignment (Instructor - own course only)
 *     tags: [Assignments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Assignment created }
 */
router.get('/', authenticate, assignmentController.getAllAssignments);
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin'),
  uploadAssignmentFile.single('attachment'),
  assignmentValidator,
  validate,
  assignmentController.createAssignment
);

router.get('/my-submissions', authenticate, authorize('student'), assignmentController.getMySubmissions);

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Get assignment by id
 *     tags: [Assignments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Assignment found }
 *   put:
 *     summary: Update assignment (Instructor - own only)
 *     tags: [Assignments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Assignment updated }
 *   delete:
 *     summary: Delete assignment (Instructor - own only)
 *     tags: [Assignments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Assignment deleted }
 */
router
  .route('/:id')
  .get(authenticate, assignmentController.getAssignmentById)
  .put(authenticate, authorize('instructor', 'admin'), uploadAssignmentFile.single('attachment'), assignmentController.updateAssignment)
  .delete(authenticate, authorize('instructor', 'admin'), assignmentController.deleteAssignment);

/**
 * @swagger
 * /assignments/{id}/submit:
 *   post:
 *     summary: Submit assignment file (Student)
 *     tags: [Assignments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Submitted successfully }
 */
router.post('/:id/submit', authenticate, authorize('student'), uploadAssignmentFile.single('file'), assignmentController.submitAssignment);

/**
 * @swagger
 * /assignments/{id}/submissions:
 *   get:
 *     summary: Get all submissions for an assignment (Instructor/Admin)
 *     tags: [Assignments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of submissions }
 */
router.get('/:id/submissions', authenticate, authorize('instructor', 'admin'), assignmentController.getSubmissions);

/**
 * @swagger
 * /assignments/submissions/{submissionId}/grade:
 *   put:
 *     summary: Grade a submission (Instructor/Admin)
 *     tags: [Assignments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Submission graded }
 */
router.put(
  '/submissions/:submissionId/grade',
  authenticate,
  authorize('instructor', 'admin'),
  gradeValidator,
  validate,
  assignmentController.gradeSubmission
);

module.exports = router;
