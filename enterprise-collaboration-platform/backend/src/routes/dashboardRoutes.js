const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Analytics overview, charts, recent activity
 */

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Get dashboard analytics overview
 *     tags: [Dashboard]
 *     responses:
 *       200: { description: Dashboard data }
 */
router.get('/overview', dashboardController.getOverview);
router.get('/recent-activity', dashboardController.getRecentActivity);

module.exports = router;
