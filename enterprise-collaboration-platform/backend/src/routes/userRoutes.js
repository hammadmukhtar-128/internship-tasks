const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and search
 */

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by name or email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200: { description: Users found }
 */
router.get('/search', userController.searchUsers);
router.patch('/me', userController.updateMe);
router.patch('/me/status', userController.updateStatus);
router.get('/:id', userController.getUser);

module.exports = router;
