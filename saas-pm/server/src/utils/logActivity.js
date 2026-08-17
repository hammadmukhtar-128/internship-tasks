const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ organization, project, user, action, entityType, entityId, description }) => {
  try {
    await ActivityLog.create({ organization, project, user, action, entityType, entityId, description });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

module.exports = logActivity;
