import api from './axios';

export const usersApi = {
  search: (q) => api.get('/users/search', { params: { q } }),
  updateMe: (payload) => api.patch('/users/me', payload),
  updateStatus: (status) => api.patch('/users/me/status', { status }),
  getUser: (id) => api.get(`/users/${id}`),
};
