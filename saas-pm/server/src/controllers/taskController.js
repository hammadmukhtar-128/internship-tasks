const Task = require('../models/Task');
const SubTask = require('../models/SubTask');
const Project = require('../models/Project');
const logActivity = require('../utils/logActivity');
const fs = require('fs');
const path = require('path');

const nextTaskId = async (project) => {
  project.taskCounter = (project.taskCounter || 0) + 1;
  await project.save();
  return `${project.key}-${project.taskCounter}`;
};

// @desc Get tasks with filters
// @route GET /api/tasks?project=&sprint=&status=&priority=&assignee=&search=&sort=
const getTasks = async (req, res, next) => {
  try {
    const { project, sprint, status, priority, assignee, label, search, sort, organization } = req.query;
    const query = {};
    if (project) query.project = project;
    if (organization) query.organization = organization;
    if (sprint) query.sprint = sprint === 'none' ? null : sprint;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = assignee === 'unassigned' ? null : assignee;
    if (label) query.labels = label;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { taskId: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = '-createdAt';
    if (sort === 'oldest') sortOption = 'createdAt';
    if (sort === 'priority') sortOption = '-priority';
    if (sort === 'dueDate') sortOption = 'dueDate';

    const tasks = await Task.find(query)
      .populate('assignee', 'name email avatarColor')
      .populate('reporter', 'name email avatarColor')
      .populate('project', 'name key color')
      .sort(sortOption);

    // attach subtask progress
    const taskIds = tasks.map((t) => t._id);
    const subtasks = await SubTask.find({ task: { $in: taskIds } });
    const subtaskMap = {};
    subtasks.forEach((s) => {
      const key = s.task.toString();
      if (!subtaskMap[key]) subtaskMap[key] = { total: 0, completed: 0 };
      subtaskMap[key].total += 1;
      if (s.completed) subtaskMap[key].completed += 1;
    });

    const data = tasks.map((t) => ({
      ...t.toObject(),
      subtaskProgress: subtaskMap[t._id.toString()] || { total: 0, completed: 0 },
    }));

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// @desc Create task
// @route POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, sprint, assignee, status, priority, startDate, dueDate, labels, estimatedHours, storyPoints } =
      req.body;
    if (!title || !project) return res.status(400).json({ success: false, message: 'Title and project are required' });

    const projectDoc = await Project.findById(project);
    if (!projectDoc) return res.status(404).json({ success: false, message: 'Project not found' });

    const taskId = await nextTaskId(projectDoc);

    const task = await Task.create({
      taskId,
      title,
      description,
      project,
      organization: projectDoc.organization,
      sprint: sprint || null,
      assignee: assignee || null,
      reporter: req.user._id,
      status,
      priority,
      startDate,
      dueDate,
      labels: labels || [],
      estimatedHours,
      storyPoints,
    });

    await logActivity({
      organization: projectDoc.organization,
      project: projectDoc._id,
      user: req.user._id,
      action: 'created',
      entityType: 'Task',
      entityId: task._id,
      description: `${req.user.name} created task "${task.taskId}: ${task.title}"`,
    });

    const populated = await task.populate([
      { path: 'assignee', select: 'name email avatarColor' },
      { path: 'reporter', select: 'name email avatarColor' },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// @desc Get single task with subtasks
// @route GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatarColor')
      .populate('reporter', 'name email avatarColor')
      .populate('project', 'name key color')
      .populate('comments.author', 'name email avatarColor')
      .populate('attachments.uploadedBy', 'name email avatarColor');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const subtasks = await SubTask.find({ task: task._id }).sort('createdAt');

    res.json({ success: true, data: { ...task.toObject(), subtasks } });
  } catch (err) {
    next(err);
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const fields = [
      'title',
      'description',
      'status',
      'priority',
      'assignee',
      'sprint',
      'startDate',
      'dueDate',
      'labels',
      'estimatedHours',
      'actualHours',
      'storyPoints',
    ];
    const prevStatus = task.status;
    fields.forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });
    await task.save();

    if (req.body.status && req.body.status !== prevStatus) {
      await logActivity({
        organization: task.organization,
        project: task.project,
        user: req.user._id,
        action: 'status_changed',
        entityType: 'Task',
        entityId: task._id,
        description: `${req.user.name} changed task ${task.taskId} status from ${prevStatus} to ${task.status}`,
      });
    } else {
      await logActivity({
        organization: task.organization,
        project: task.project,
        user: req.user._id,
        action: 'updated',
        entityType: 'Task',
        entityId: task._id,
        description: `${req.user.name} updated task ${task.taskId}`,
      });
    }

    const populated = await Task.findById(task._id)
      .populate('assignee', 'name email avatarColor')
      .populate('reporter', 'name email avatarColor');

    res.json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.attachments.forEach((a) => {
      const filePath = path.join(__dirname, '..', '..', 'uploads', 'attachments', a.filename);
      fs.existsSync(filePath) && fs.unlinkSync(filePath);
    });

    await SubTask.deleteMany({ task: task._id });
    await task.deleteOne();

    await logActivity({
      organization: task.organization,
      project: task.project,
      user: req.user._id,
      action: 'deleted',
      entityType: 'Task',
      entityId: task._id,
      description: `${req.user.name} deleted task ${task.taskId}`,
    });

    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc Update status (kanban drag & drop)
// @route PATCH /api/tasks/:id/status
const updateStatus = async (req, res, next) => {
  try {
    const { status, order } = req.body;
    if (!['To Do', 'In Progress', 'In Review', 'Done'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const prevStatus = task.status;
    task.status = status;
    if (order !== undefined) task.order = order;
    await task.save();

    if (prevStatus !== status) {
      await logActivity({
        organization: task.organization,
        project: task.project,
        user: req.user._id,
        action: 'status_changed',
        entityType: 'Task',
        entityId: task._id,
        description: `${req.user.name} moved task ${task.taskId} from ${prevStatus} to ${status}`,
      });
    }

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc Assign task
// @route PATCH /api/tasks/:id/assign
const assignTask = async (req, res, next) => {
  try {
    const { assignee } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.assignee = assignee || null;
    await task.save();

    await logActivity({
      organization: task.organization,
      project: task.project,
      user: req.user._id,
      action: 'assigned',
      entityType: 'Task',
      entityId: task._id,
      description: `${req.user.name} updated assignee on task ${task.taskId}`,
    });

    const populated = await Task.findById(task._id).populate('assignee', 'name email avatarColor');
    res.json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// ---- Subtasks ----

// @desc Add subtask
// @route POST /api/tasks/:id/subtasks
const addSubtask = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Subtask title is required' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const subtask = await SubTask.create({ task: task._id, title, createdBy: req.user._id });

    await logActivity({
      organization: task.organization,
      project: task.project,
      user: req.user._id,
      action: 'created',
      entityType: 'SubTask',
      entityId: subtask._id,
      description: `${req.user.name} added subtask "${title}" to ${task.taskId}`,
    });

    res.status(201).json({ success: true, data: subtask });
  } catch (err) {
    next(err);
  }
};

// @desc Update subtask (title / completed)
// @route PUT /api/tasks/:id/subtasks/:subtaskId
const updateSubtask = async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    const subtask = await SubTask.findById(req.params.subtaskId);
    if (!subtask) return res.status(404).json({ success: false, message: 'Subtask not found' });

    if (title !== undefined) subtask.title = title;
    if (completed !== undefined) subtask.completed = completed;
    await subtask.save();

    const task = await Task.findById(req.params.id);
    if (completed !== undefined && task) {
      await logActivity({
        organization: task.organization,
        project: task.project,
        user: req.user._id,
        action: completed ? 'completed' : 'updated',
        entityType: 'SubTask',
        entityId: subtask._id,
        description: `${req.user.name} ${completed ? 'completed' : 'reopened'} subtask "${subtask.title}"`,
      });
    }

    res.json({ success: true, data: subtask });
  } catch (err) {
    next(err);
  }
};

// @desc Delete subtask
// @route DELETE /api/tasks/:id/subtasks/:subtaskId
const deleteSubtask = async (req, res, next) => {
  try {
    const subtask = await SubTask.findById(req.params.subtaskId);
    if (!subtask) return res.status(404).json({ success: false, message: 'Subtask not found' });
    await subtask.deleteOne();
    res.json({ success: true, message: 'Subtask deleted' });
  } catch (err) {
    next(err);
  }
};

// ---- Comments ----

// @desc Add comment
// @route POST /api/tasks/:id/comments
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Comment text is required' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.comments.push({ author: req.user._id, text });
    await task.save();

    await logActivity({
      organization: task.organization,
      project: task.project,
      user: req.user._id,
      action: 'commented',
      entityType: 'Task',
      entityId: task._id,
      description: `${req.user.name} commented on task ${task.taskId}`,
    });

    const populated = await Task.findById(task._id).populate('comments.author', 'name email avatarColor');
    res.status(201).json({ success: true, data: populated.comments });
  } catch (err) {
    next(err);
  }
};

// ---- Attachments ----

// @desc Upload attachment
// @route POST /api/tasks/:id/attachments
const uploadAttachment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/attachments/${req.file.filename}`,
      uploadedBy: req.user._id,
    };
    task.attachments.push(attachment);
    await task.save();

    await logActivity({
      organization: task.organization,
      project: task.project,
      user: req.user._id,
      action: 'uploaded',
      entityType: 'Task',
      entityId: task._id,
      description: `${req.user.name} uploaded "${req.file.originalname}" to task ${task.taskId}`,
    });

    res.status(201).json({ success: true, data: task.attachments[task.attachments.length - 1] });
  } catch (err) {
    next(err);
  }
};

// @desc Delete attachment
// @route DELETE /api/tasks/:id/attachments/:attachmentId
const deleteAttachment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const attachment = task.attachments.id(req.params.attachmentId);
    if (!attachment) return res.status(404).json({ success: false, message: 'Attachment not found' });

    const filePath = path.join(__dirname, '..', '..', 'uploads', 'attachments', attachment.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    attachment.deleteOne();
    await task.save();

    res.json({ success: true, message: 'Attachment deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
