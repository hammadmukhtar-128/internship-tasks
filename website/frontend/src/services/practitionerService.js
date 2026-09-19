import api from "./api";
import { demoPractitioners } from "../utils/demoData";

export async function getPractitioners() {
  try {
    const { data } = await api.get("/practitioners");
    return { items: data.items ?? data, live: true };
  } catch {
    return { items: demoPractitioners, live: false };
  }
}

export async function getPractitionerById(idOrSlug) {
  try {
    const { data } = await api.get(`/practitioners/${idOrSlug}`);
    return data.item ?? data;
  } catch {
    return (
      demoPractitioners.find((p) => p.slug === idOrSlug || p._id === idOrSlug) ?? null
    );
  }
}

// Admin: full list including inactive practitioners.
export async function getAllPractitionersAdmin() {
  try {
    const { data } = await api.get("/practitioners/admin");
    return { items: data.items ?? data, live: true };
  } catch {
    return { items: demoPractitioners, live: false };
  }
}

export async function createPractitioner(payload) {
  const { data } = await api.post("/practitioners", payload);
  return data.item ?? data;
}

export async function updatePractitioner(id, payload) {
  const { data } = await api.patch(`/practitioners/${id}`, payload);
  return data.item ?? data;
}

export async function deletePractitioner(id) {
  const { data } = await api.delete(`/practitioners/${id}`);
  return data;
}
