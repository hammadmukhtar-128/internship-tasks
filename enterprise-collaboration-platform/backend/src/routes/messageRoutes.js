const express = require('express');
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { searchMessageValidator } = require('../validators/messageValidators');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Chat messages, search, reactions
 */

/**
 * @swagger
 * /messages/search:
 *   get:
 *     summary: Search messages by keyword, user, or channel
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: channel
 *         schema: { type: string }
 *       - in: query
 *         name: user
 *         schema: { type: string }
 *     responses:
 *       200: { description: Search results }
 */
router.get('/search', searchMessageValidator, validate, messageController.searchMessages);
router.get('/channel/:channelId', messageController.getChannelMessages);
router.post('/channel/:channelId/read', messageController.markChannelRead);
router.patch('/:id', messageController.editMessage);
router.delete('/:id', messageController.deleteMessage);
router.post('/:id/reactions', messageController.toggleReaction);

module.exports = router;
