import api from './api';

// ---- Auth ----
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  switchOrganization: (orgId) => api.put(`/auth/switch-organization/${orgId}`),
};

// ---- Organizations ----
export const orgService = {
  list: () => api.get('/organizations'),
  create: (data) => api.post('/organizations', data),
  get: (id) => api.get(`/organizations/${id}`),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  remove: (id) => api.delete(`/organizations/${id}`),
  updateMemberRole: (id, userId, role) => api.patch(`/organizations/${id}/members/${userId}`, { role }),
  removeMember: (id, userId) => api.delete(`/organizations/${id}/members/${userId}`),
};

// ---- Projects ----
export const projectService = {
  list: (organization) => api.get('/projects', { params: { organization } }),
  create: (data) => api.post('/projects', data),
  get: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  remove: (id) => api.delete(`/projects/${id}`),
};

// ---- Tasks ----
export const taskService = {
  list: (params) => api.get('/tasks', { params }),
  create: (data) => api.post('/tasks', data),
  get: (id) => api.get(`/tasks/${id}`),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status, order) => api.patch(`/tasks/${id}/status`, { status, order }),
  assign: (id, assignee) => api.patch(`/tasks/${id}/assign`, { assignee }),
  addSubtask: (id, title) => api.post(`/tasks/${id}/subtasks`, { title }),
  updateSubtask: (id, subtaskId, data) => api.put(`/tasks/${id}/subtasks/${subtaskId}`, data),
  deleteSubtask: (id, subtaskId) => api.delete(`/tasks/${id}/subtasks/${subtaskId}`),
  addComment: (id, text) => api.post(`/tasks/${id}/comments`, { text }),
  uploadAttachment: (id, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/tasks/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    });
  },
  deleteAttachment: (id, attachmentId) => api.delete(`/tasks/${id}/attachments/${attachmentId}`),
};

// ---- Sprints ----
export const sprintService = {
  list: (project) => api.get('/sprints', { params: { project } }),
  create: (data) => api.post('/sprints', data),
  update: (id, data) => api.put(`/sprints/${id}`, data),
  remove: (id) => api.delete(`/sprints/${id}`),
  burndown: (id) => api.get(`/sprints/${id}/burndown`),
  addTask: (sprintId, taskId) => api.patch(`/sprints/${sprintId}/tasks/${taskId}`),
  removeTask: (sprintId, taskId) => api.delete(`/sprints/${sprintId}/tasks/${taskId}`),
};

// ---- Activity ----
export const activityService = {
  list: (params) => api.get('/activity', { params }),
};

// ---- Invites ----
export const inviteService = {
  list: (organization) => api.get('/invites', { params: { organization } }),
  create: (data) => api.post('/invites', data),
  accept: (token) => api.patch(`/invites/${token}/accept`),
  reject: (token) => api.patch(`/invites/${token}/reject`),
  cancel: (id) => api.delete(`/invites/${id}`),
};

// ---- Dashboard ----
export const dashboardService = {
  get: (organization) => api.get('/dashboard', { params: { organization } }),
};
