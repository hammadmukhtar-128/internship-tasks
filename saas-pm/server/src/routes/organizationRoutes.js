const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireOrgMember } = require('../middleware/authorize');
const {
  getOrganizations,
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  updateMemberRole,
  removeMember,
} = require('../controllers/organizationController');

router.use(protect);

router.get('/', getOrganizations);
router.post('/', createOrganization);
router.get('/:id', requireOrgMember(), getOrganization);
router.put('/:id', requireOrgMember(['Owner', 'Admin']), updateOrganization);
router.delete('/:id', requireOrgMember(['Owner']), deleteOrganization);
router.patch('/:id/members/:userId', requireOrgMember(['Owner', 'Admin']), updateMemberRole);
router.delete('/:id/members/:userId', requireOrgMember(['Owner', 'Admin']), removeMember);

module.exports = router;
