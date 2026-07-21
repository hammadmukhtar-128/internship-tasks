const express = require('express');
const teamController = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const { requireTeamMember, requireTeamOwner } = require('../middleware/teamAccess');
const validate = require('../middleware/validate');
const {
  createTeamValidator,
  updateTeamValidator,
  inviteMemberValidator,
} = require('../validators/teamValidators');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: Team management
 */

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get teams the current user belongs to
 *     tags: [Teams]
 *     responses:
 *       200: { description: List of teams }
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Team created }
 */
router.get('/', teamController.getMyTeams);
router.post('/', createTeamValidator, validate, teamController.createTeam);

router.get('/:id', requireTeamMember, teamController.getTeam);
router.patch('/:id', requireTeamMember, requireTeamOwner, updateTeamValidator, validate, teamController.updateTeam);
router.delete('/:id', requireTeamMember, requireTeamOwner, teamController.deleteTeam);

router.post(
  '/:teamId/invite',
  requireTeamMember,
  inviteMemberValidator,
  validate,
  teamController.inviteMember
);
router.post('/invite/:token/accept', teamController.acceptInvitation);

router.delete('/:teamId/members/:memberId', requireTeamMember, requireTeamOwner, teamController.removeMember);
router.patch('/:teamId/members/:memberId/role', requireTeamMember, requireTeamOwner, teamController.updateMemberRole);

module.exports = router;
