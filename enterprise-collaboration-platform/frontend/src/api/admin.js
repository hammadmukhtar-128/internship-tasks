import api from './axios';

export const adminApi = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  toggleUserActive: (id) => api.patch(`/admin/users/${id}/toggle-active`),
  getTeams: (params) => api.get('/admin/teams', { params }),
  getAnalytics: () => api.get('/admin/analytics'),
  getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),
};
