import api from "./api";

export async function createAppointment(payload) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

export async function getAppointments(params = {}) {
  const { data } = await api.get("/appointments", { params });
  return data.items ?? data;
}

export async function updateAppointmentStatus(id, status) {
  const { data } = await api.patch(`/appointments/${id}`, { status });
  return data.item ?? data;
}

export async function deleteAppointment(id) {
  const { data } = await api.delete(`/appointments/${id}`);
  return data;
}
