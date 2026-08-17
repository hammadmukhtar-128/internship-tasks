const Project = require('../models/Project');
const Task = require('../models/Task');
const Sprint = require('../models/Sprint');
const Organization = require('../models/Organization');
const ActivityLog = require('../models/ActivityLog');

// @desc Dashboard stats for current organization
// @route GET /api/dashboard?organization=<id>
const getDashboard = async (req, res, next) => {
  try {
    const orgId = req.query.organization || req.user.currentOrganization;
    if (!orgId) return res.status(400).json({ success: false, message: 'Organization is required' });

    const [totalProjects, totalTasks, completedTasks, activeSprints, org] = await Promise.all([
      Project.countDocuments({ organization: orgId }),
      Task.countDocuments({ organization: orgId }),
      Task.countDocuments({ organization: orgId, status: 'Done' }),
      Sprint.countDocuments({ organization: orgId, status: 'Active' }),
      Organization.findById(orgId),
    ]);

    const pendingTasks = totalTasks - completedTasks;
    const overdueTasks = await Task.countDocuments({
      organization: orgId,
      status: { $ne: 'Done' },
      dueDate: { $lt: new Date() },
    });

    const tasksByStatus = await Task.aggregate([
      { $match: { organization: org._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const tasksByPriority = await Task.aggregate([
      { $match: { organization: org._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const myTasks = await Task.find({ organization: orgId, assignee: req.user._id, status: { $ne: 'Done' } })
      .populate('project', 'name key color')
      .sort('dueDate')
      .limit(10);

    const upcomingDeadlines = await Task.find({
      organization: orgId,
      status: { $ne: 'Done' },
      dueDate: { $gte: new Date() },
    })
      .populate('project', 'name key color')
      .populate('assignee', 'name avatarColor')
      .sort('dueDate')
      .limit(8);

    const recentActivity = await ActivityLog.find({ organization: orgId })
      .populate('user', 'name avatarColor')
      .sort('-createdAt')
      .limit(10);

    const projects = await Project.find({ organization: orgId });
    const projectProgress = await Promise.all(
      projects.map(async (p) => {
        const total = await Task.countDocuments({ project: p._id });
        const done = await Task.countDocuments({ project: p._id, status: 'Done' });
        return {
          id: p._id,
          name: p.name,
          key: p.key,
          color: p.color,
          progress: total === 0 ? 0 : Math.round((done / total) * 100),
        };
      })
    );

    res.json({
      success: true,
      data: {
        totals: {
          totalProjects,
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks,
          activeSprints,
          teamMembers: org ? org.members.length : 0,
        },
        tasksByStatus,
        tasksByPriority,
        myTasks,
        upcomingDeadlines,
        recentActivity,
        projectProgress,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
