const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: options.cache || "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  put: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  delete: <T>(path: string, token?: string) =>
    request<T>(path, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
};

export function formatPrice(price: number, currency = "PKR", suffix = "") {
  const value = Number(price || 0).toLocaleString("en-PK");
  return `${currency} ${value}${suffix}`;
}
