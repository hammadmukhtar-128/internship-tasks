"use client";

export interface AdminSession {
  _id: string;
  name: string;
  email: string;
  token: string;
}

const KEY = "lahore_real_estate_admin_session";

export function saveSession(session: AdminSession) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
