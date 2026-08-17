const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSprints,
  createSprint,
  updateSprint,
  deleteSprint,
  addTaskToSprint,
  removeTaskFromSprint,
  getBurndown,
} = require('../controllers/sprintController');

router.use(protect);

router.get('/', getSprints);
router.post('/', createSprint);
router.put('/:id', updateSprint);
router.delete('/:id', deleteSprint);
router.get('/:id/burndown', getBurndown);
router.patch('/:id/tasks/:taskId', addTaskToSprint);
router.delete('/:id/tasks/:taskId', removeTaskFromSprint);

module.exports = router;
