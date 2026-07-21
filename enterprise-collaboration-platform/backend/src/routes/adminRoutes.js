const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(protect, restrictTo('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Platform administration (admin role only)
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all platform users
 *     tags: [Admin]
 *     responses:
 *       200: { description: Users list }
 */
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id/toggle-active', adminController.toggleUserActive);

router.get('/teams', adminController.getAllTeamsAdmin);
router.get('/analytics', adminController.getPlatformAnalytics);
router.get('/activity-logs', adminController.getActivityLogs);

module.exports = router;
