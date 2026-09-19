import api from "./api";
import { demoTestimonials } from "../utils/demoData";

export async function getTestimonials() {
  try {
    const { data } = await api.get("/testimonials");
    return { items: data.items ?? data, live: true };
  } catch {
    return { items: demoTestimonials, live: false };
  }
}

// Admin: full list including unpublished testimonials.
export async function getAllTestimonialsAdmin() {
  try {
    const { data } = await api.get("/testimonials/admin");
    return { items: data.items ?? data, live: true };
  } catch {
    return { items: demoTestimonials, live: false };
  }
}

export async function createTestimonial(payload) {
  const { data } = await api.post("/testimonials", payload);
  return data.item ?? data;
}

export async function updateTestimonial(id, payload) {
  const { data } = await api.patch(`/testimonials/${id}`, payload);
  return data.item ?? data;
}

export async function deleteTestimonial(id) {
  const { data } = await api.delete(`/testimonials/${id}`);
  return data;
}
