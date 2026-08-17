const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  updateStatus,
  assignTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  addComment,
  uploadAttachment,
  deleteAttachment,
} = require('../controllers/taskController');

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

router.patch('/:id/status', updateStatus);
router.patch('/:id/assign', assignTask);

router.post('/:id/subtasks', addSubtask);
router.put('/:id/subtasks/:subtaskId', updateSubtask);
router.delete('/:id/subtasks/:subtaskId', deleteSubtask);

router.post('/:id/comments', addComment);

router.post('/:id/attachments', upload.single('file'), uploadAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

module.exports = router;
