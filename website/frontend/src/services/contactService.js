import api from "./api";

export async function sendContactMessage(payload) {
  const { data } = await api.post("/contact", payload);
  return data;
}

export async function getContactMessages() {
  const { data } = await api.get("/contact");
  return data.items ?? data;
}

export async function updateContactMessageStatus(id, status) {
  const { data } = await api.patch(`/contact/${id}`, { status });
  return data.item ?? data;
}

export async function deleteContactMessage(id) {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
}
