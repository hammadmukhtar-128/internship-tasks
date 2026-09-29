"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveSession, AdminSession } from "@/lib/authClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post<AdminSession & { success: boolean }>("/auth/login", form);
      saveSession(res);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-luxury">
        <h1 className="font-display text-2xl font-bold text-ink">Admin Login</h1>
        <p className="mt-2 text-sm text-ink/50">Sign in to manage properties, agents, and inquiries.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-ink/10 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-ink/10 px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full text-xs">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
