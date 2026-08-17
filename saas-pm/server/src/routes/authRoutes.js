const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { register, login, getMe, updateProfile, changePassword, switchOrganization } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/switch-organization/:orgId', protect, switchOrganization);

module.exports = router;
