import api from './axios';

export const channelsApi = {
  getTeamChannels: (teamId) => api.get(`/channels/team/${teamId}`),
  getChannel: (id) => api.get(`/channels/${id}`),
  createChannel: (payload) => api.post('/channels', payload),
  updateChannel: (id, payload) => api.patch(`/channels/${id}`, payload),
  deleteChannel: (id) => api.delete(`/channels/${id}`),
  joinChannel: (id) => api.post(`/channels/${id}/join`),
  leaveChannel: (id) => api.post(`/channels/${id}/leave`),
  addMembers: (id, userIds) => api.post(`/channels/${id}/members`, { userIds }),
};
