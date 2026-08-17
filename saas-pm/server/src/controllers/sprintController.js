const Sprint = require('../models/Sprint');
const Task = require('../models/Task');
const Project = require('../models/Project');
const logActivity = require('../utils/logActivity');

// @desc Get sprints for a project
// @route GET /api/sprints?project=<id>
const getSprints = async (req, res, next) => {
  try {
    const { project } = req.query;
    if (!project) return res.status(400).json({ success: false, message: 'Project is required' });
    const sprints = await Sprint.find({ project }).sort('-createdAt');

    const withCounts = await Promise.all(
      sprints.map(async (s) => {
        const total = await Task.countDocuments({ sprint: s._id });
        const done = await Task.countDocuments({ sprint: s._id, status: 'Done' });
        return { ...s.toObject(), taskCount: total, doneTaskCount: done };
      })
    );

    res.json({ success: true, data: withCounts });
  } catch (err) {
    next(err);
  }
};

// @desc Create sprint
// @route POST /api/sprints
const createSprint = async (req, res, next) => {
  try {
    const { name, goal, project, startDate, endDate } = req.body;
    if (!name || !project) return res.status(400).json({ success: false, message: 'Name and project are required' });

    const projectDoc = await Project.findById(project);
    if (!projectDoc) return res.status(404).json({ success: false, message: 'Project not found' });

    const sprint = await Sprint.create({
      name,
      goal,
      project,
      organization: projectDoc.organization,
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    await logActivity({
      organization: projectDoc.organization,
      project: projectDoc._id,
      user: req.user._id,
      action: 'created',
      entityType: 'Sprint',
      entityId: sprint._id,
      description: `${req.user.name} created sprint "${sprint.name}"`,
    });

    res.status(201).json({ success: true, data: sprint });
  } catch (err) {
    next(err);
  }
};

// @desc Update sprint (also handles start/complete)
// @route PUT /api/sprints/:id
const updateSprint = async (req, res, next) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) return res.status(404).json({ success: false, message: 'Sprint not found' });

    const fields = ['name', 'goal', 'startDate', 'endDate', 'status'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) sprint[f] = req.body[f];
    });
    await sprint.save();

    if (req.body.status) {
      await logActivity({
        organization: sprint.organization,
        project: sprint.project,
        user: req.user._id,
        action: 'status_changed',
        entityType: 'Sprint',
        entityId: sprint._id,
        description: `${req.user.name} set sprint "${sprint.name}" to ${sprint.status}`,
      });
    }

    res.json({ success: true, data: sprint });
  } catch (err) {
    next(err);
  }
};

// @desc Delete sprint
// @route DELETE /api/sprints/:id
const deleteSprint = async (req, res, next) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) return res.status(404).json({ success: false, message: 'Sprint not found' });

    await Task.updateMany({ sprint: sprint._id }, { $set: { sprint: null } });
    await sprint.deleteOne();

    res.json({ success: true, message: 'Sprint deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc Add task to sprint
// @route PATCH /api/sprints/:id/tasks/:taskId
const addTaskToSprint = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.sprint = req.params.id;
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc Remove task from sprint
// @route DELETE /api/sprints/:id/tasks/:taskId
const removeTaskFromSprint = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.sprint = null;
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc Burndown chart data for a sprint
// @route GET /api/sprints/:id/burndown
const getBurndown = async (req, res, next) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) return res.status(404).json({ success: false, message: 'Sprint not found' });

    const tasks = await Task.find({ sprint: sprint._id });
    const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 1), 0);

    const start = sprint.startDate ? new Date(sprint.startDate) : new Date(sprint.createdAt);
    const end = sprint.endDate ? new Date(sprint.endDate) : new Date();
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    // Ideal burndown: linear from totalPoints to 0
    const idealData = [];
    for (let i = 0; i <= days; i++) {
      idealData.push({
        day: i,
        date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        ideal: Math.max(0, Math.round(totalPoints - (totalPoints / days) * i)),
      });
    }

    // Actual remaining: based on tasks completed (using updatedAt as completion proxy)
    const doneTasks = tasks.filter((t) => t.status === 'Done');
    const actualData = idealData.map((point) => {
      const pointDate = new Date(point.date);
      const completedByThen = doneTasks
        .filter((t) => new Date(t.updatedAt) <= pointDate)
        .reduce((sum, t) => sum + (t.storyPoints || 1), 0);
      return {
        ...point,
        actual: pointDate > new Date() ? null : Math.max(0, totalPoints - completedByThen),
      };
    });

    res.json({
      success: true,
      data: {
        totalPoints,
        completedPoints: doneTasks.reduce((sum, t) => sum + (t.storyPoints || 1), 0),
        remainingPoints: totalPoints - doneTasks.reduce((sum, t) => sum + (t.storyPoints || 1), 0),
        chart: actualData,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSprints,
  createSprint,
  updateSprint,
  deleteSprint,
  addTaskToSprint,
  removeTaskFromSprint,
  getBurndown,
};
