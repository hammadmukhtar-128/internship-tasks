const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/courses', require('./courseRoutes'));
router.use('/assignments', require('./assignmentRoutes'));
router.use('/quizzes', require('./quizRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/certificates', require('./certificateRoutes'));

module.exports = router;
