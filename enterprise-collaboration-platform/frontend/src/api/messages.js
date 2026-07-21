import api from './axios';

export const messagesApi = {
  getChannelMessages: (channelId, before) =>
    api.get(`/messages/channel/${channelId}`, { params: before ? { before } : {} }),
  search: (params) => api.get('/messages/search', { params }),
  editMessage: (id, content) => api.patch(`/messages/${id}`, { content }),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
  markChannelRead: (channelId) => api.post(`/messages/channel/${channelId}/read`),
  toggleReaction: (id, emoji) => api.post(`/messages/${id}/reactions`, { emoji }),
};
