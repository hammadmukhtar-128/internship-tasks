import api from "./api";
import { demoServices } from "../utils/demoData";

/**
 * Every function here tries the real backend first and falls back to demo
 * content if the request fails (e.g. the Express API isn't running yet).
 * This keeps the frontend fully demonstrable on its own.
 */

export async function getServices() {
  try {
    const { data } = await api.get("/services");
    return { items: data.items ?? data, live: true };
  } catch {
    return { items: demoServices, live: false };
  }
}

export async function getServiceBySlug(slug) {
  try {
    const { data } = await api.get(`/services/${slug}`);
    return data.item ?? data;
  } catch {
    return demoServices.find((s) => s.slug === slug) ?? null;
  }
}

// Admin: full list including inactive services — used by the admin dashboard
// so deactivated services don't disappear from view. Falls back to demo
// data (marked not-live) if the backend/session isn't available.
export async function getAllServicesAdmin() {
  try {
    const { data } = await api.get("/services/admin");
    return { items: data.items ?? data, live: true };
  } catch {
    return { items: demoServices, live: false };
  }
}

export async function createService(payload) {
  const { data } = await api.post("/services", payload);
  return data.item ?? data;
}

export async function updateService(id, payload) {
  const { data } = await api.patch(`/services/${id}`, payload);
  return data.item ?? data;
}

export async function deleteService(id) {
  const { data } = await api.delete(`/services/${id}`);
  return data;
}
