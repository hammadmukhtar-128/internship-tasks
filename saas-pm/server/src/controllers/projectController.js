const Project = require('../models/Project');
const Task = require('../models/Task');
const logActivity = require('../utils/logActivity');

// @desc Get all projects for current organization
// @route GET /api/projects?organization=<id>
const getProjects = async (req, res, next) => {
  try {
    const orgId = req.query.organization || req.user.currentOrganization;
    if (!orgId) return res.status(400).json({ success: false, message: 'Organization is required' });

    const projects = await Project.find({ organization: orgId })
      .populate('owner', 'name email avatarColor')
      .populate('members', 'name email avatarColor')
      .sort('-createdAt');

    const withStats = await Promise.all(
      projects.map(async (p) => {
        const totalTasks = await Task.countDocuments({ project: p._id });
        const doneTasks = await Task.countDocuments({ project: p._id, status: 'Done' });
        const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
        return { ...p.toObject(), taskCount: totalTasks, doneTaskCount: doneTasks, progress };
      })
    );

    res.json({ success: true, data: withStats });
  } catch (err) {
    next(err);
  }
};

// @desc Create project
// @route POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { name, key, description, status, priority, startDate, dueDate, members, color, organization } = req.body;
    const orgId = organization || req.user.currentOrganization;
    if (!name || !key) return res.status(400).json({ success: false, message: 'Name and key are required' });

    const project = await Project.create({
      name,
      key: key.toUpperCase(),
      description,
      status,
      priority,
      startDate,
      dueDate,
      members: members || [],
      color,
      organization: orgId,
      owner: req.user._id,
    });

    await logActivity({
      organization: orgId,
      project: project._id,
      user: req.user._id,
      action: 'created',
      entityType: 'Project',
      entityId: project._id,
      description: `${req.user.name} created project "${project.name}"`,
    });

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc Get single project
// @route GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatarColor')
      .populate('members', 'name email avatarColor');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const totalTasks = await Task.countDocuments({ project: project._id });
    const doneTasks = await Task.countDocuments({ project: project._id, status: 'Done' });
    const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    res.json({ success: true, data: { ...project.toObject(), taskCount: totalTasks, doneTaskCount: doneTasks, progress } });
  } catch (err) {
    next(err);
  }
};

// @desc Update project
// @route PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const fields = ['name', 'description', 'status', 'priority', 'startDate', 'dueDate', 'members', 'color'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    });
    await project.save();

    await logActivity({
      organization: project.organization,
      project: project._id,
      user: req.user._id,
      action: 'updated',
      entityType: 'Project',
      entityId: project._id,
      description: `${req.user.name} updated project "${project.name}"`,
    });

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc Delete project
// @route DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    await logActivity({
      organization: project.organization,
      user: req.user._id,
      action: 'deleted',
      entityType: 'Project',
      entityId: project._id,
      description: `${req.user.name} deleted project "${project.name}"`,
    });

    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjects, createProject, getProject, updateProject, deleteProject };
