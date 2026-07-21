import api from './axios';

export const teamsApi = {
  getMyTeams: () => api.get('/teams'),
  getTeam: (id) => api.get(`/teams/${id}`),
  createTeam: (payload) => api.post('/teams', payload),
  updateTeam: (id, payload) => api.patch(`/teams/${id}`, payload),
  deleteTeam: (id) => api.delete(`/teams/${id}`),
  inviteMember: (teamId, payload) => api.post(`/teams/${teamId}/invite`, payload),
  acceptInvitation: (token) => api.post(`/teams/invite/${token}/accept`),
  removeMember: (teamId, memberId) => api.delete(`/teams/${teamId}/members/${memberId}`),
  updateMemberRole: (teamId, memberId, role) =>
    api.patch(`/teams/${teamId}/members/${memberId}/role`, { role }),
};
