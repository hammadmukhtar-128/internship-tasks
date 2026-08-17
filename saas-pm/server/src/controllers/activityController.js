const ActivityLog = require('../models/ActivityLog');

// @desc Get activity log for organization (optionally filtered by project)
// @route GET /api/activity?organization=&project=&limit=
const getActivity = async (req, res, next) => {
  try {
    const { organization, project, limit } = req.query;
    const orgId = organization || req.user.currentOrganization;
    if (!orgId) return res.status(400).json({ success: false, message: 'Organization is required' });

    const query = { organization: orgId };
    if (project) query.project = project;

    const logs = await ActivityLog.find(query)
      .populate('user', 'name email avatarColor')
      .sort('-createdAt')
      .limit(limit ? parseInt(limit, 10) : 50);

    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};

module.exports = { getActivity };
