const express = require('express');
const channelController = require('../controllers/channelController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createChannelValidator, updateChannelValidator } = require('../validators/channelValidators');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Channels
 *   description: Channel management
 */

/**
 * @swagger
 * /channels:
 *   post:
 *     summary: Create a new channel
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, team]
 *             properties:
 *               name: { type: string }
 *               team: { type: string }
 *               type: { type: string, enum: [public, private] }
 *     responses:
 *       201: { description: Channel created }
 */
router.post('/', createChannelValidator, validate, channelController.createChannel);
router.get('/team/:teamId', channelController.getTeamChannels);
router.get('/:id', channelController.getChannel);
router.patch('/:id', updateChannelValidator, validate, channelController.updateChannel);
router.delete('/:id', channelController.deleteChannel);
router.post('/:id/join', channelController.joinChannel);
router.post('/:id/leave', channelController.leaveChannel);
router.post('/:id/members', channelController.addMembersToChannel);

module.exports = router;
