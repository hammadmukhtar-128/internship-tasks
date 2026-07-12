const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadThumbnail } = require('../middleware/upload');
const { courseValidator } = require('../validators/courseValidator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses - filter by category/instructor/status/price, search, paginate
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of courses }
 *   post:
 *     summary: Create a course (Instructor/Admin)
 *     tags: [Courses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Course created }
 */
router.get('/', courseController.getAllCourses);
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin'),
  uploadThumbnail.single('thumbnail'),
  courseValidator,
  validate,
  courseController.createCourse
);

router.get('/my-courses', authenticate, authorize('instructor'), courseController.getMyCourses);
router.get('/enrolled', authenticate, authorize('student'), courseController.getEnrolledCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by id
 *     tags: [Courses]
 *     responses:
 *       200: { description: Course found }
 *   put:
 *     summary: Update course (Instructor - own course only, or Admin)
 *     tags: [Courses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Course updated }
 *   delete:
 *     summary: Delete course (Instructor - own course only, or Admin)
 *     tags: [Courses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Course deleted }
 */
router
  .route('/:id')
  .get(courseController.getCourseById)
  .put(authenticate, authorize('instructor', 'admin'), uploadThumbnail.single('thumbnail'), courseController.updateCourse)
  .delete(authenticate, authorize('instructor', 'admin'), courseController.deleteCourse);

/**
 * @swagger
 * /courses/{id}/enroll:
 *   post:
 *     summary: Enroll logged-in student in a course
 *     tags: [Courses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Enrolled successfully }
 */
router.post('/:id/enroll', authenticate, authorize('student'), courseController.enrollInCourse);

module.exports = router;
