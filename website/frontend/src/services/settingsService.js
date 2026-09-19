import api from "./api";
import { demoClinicSettings } from "../utils/demoData";

export async function getClinicSettings() {
  try {
    const { data } = await api.get("/settings");
    return { item: data.item ?? data, live: true };
  } catch {
    return { item: demoClinicSettings, live: false };
  }
}

export async function updateClinicSettings(payload) {
  const { data } = await api.put("/settings", payload);
  return data.item ?? data;
}
