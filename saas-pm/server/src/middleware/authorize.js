const Organization = require('../models/Organization');

/**
 * Loads the organization referenced by :orgId (or req.body.organization / req.user.currentOrganization)
 * and attaches req.organization + req.membership (the member sub-doc for req.user).
 * Then optionally restricts access to a set of allowed roles.
 */
const requireOrgMember = (allowedRoles = null) => {
  return async (req, res, next) => {
    try {
      const orgId = req.params.orgId || req.params.id || req.body.organization || req.user.currentOrganization;
      if (!orgId) {
        return res.status(400).json({ success: false, message: 'Organization context is required' });
      }
      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ success: false, message: 'Organization not found' });
      }
      const membership = organization.members.find((m) => m.user.toString() === req.user._id.toString());
      if (!membership) {
        return res.status(403).json({ success: false, message: 'You are not a member of this organization' });
      }
      if (allowedRoles && !allowedRoles.includes(membership.role)) {
        return res.status(403).json({ success: false, message: 'Insufficient permissions for this action' });
      }
      req.organization = organization;
      req.membership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { requireOrgMember };
