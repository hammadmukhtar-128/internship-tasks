const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getInvites, createInvite, acceptInvite, rejectInvite, cancelInvite } = require('../controllers/inviteController');

router.use(protect);

router.get('/', getInvites);
router.post('/', createInvite);
router.patch('/:token/accept', acceptInvite);
router.patch('/:token/reject', rejectInvite);
router.delete('/:id', cancelInvite);

module.exports = router;
