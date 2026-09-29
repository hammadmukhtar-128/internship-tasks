"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { api } from "@/lib/api";
import { getSession } from "@/lib/authClient";
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineNewspaper, HiOutlineMailOpen } from "react-icons/hi";

interface Stats {
  totalProperties: number;
  totalAgents: number;
  totalBlogs: number;
  totalInquiries: number;
  newInquiries: number;
  featuredCount: number;
  recentInquiries: { _id: string; name: string; message: string; createdAt: string }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    api.get<{ data: Stats }>("/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: "Properties", value: stats.totalProperties, icon: HiOutlineHome },
        { label: "Agents", value: stats.totalAgents, icon: HiOutlineUserGroup },
        { label: "Blog Posts", value: stats.totalBlogs, icon: HiOutlineNewspaper },
        { label: "New Inquiries", value: stats.newInquiries, icon: HiOutlineMailOpen },
      ]
    : [];

  return (
    <AdminGuard>
      <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/50">Overview of site activity and content.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card-luxury p-6">
            <c.icon className="text-2xl text-gold-dark" />
            <p className="mt-4 font-display text-3xl font-bold text-ink">{c.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="card-luxury mt-8 p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Recent Inquiries</h2>
        <div className="mt-4 divide-y divide-ink/5">
          {stats?.recentInquiries?.length ? (
            stats.recentInquiries.map((i) => (
              <div key={i._id} className="py-3">
                <p className="text-sm font-medium text-ink">{i.name}</p>
                <p className="text-sm text-ink/50">{i.message}</p>
              </div>
            ))
          ) : (
            <p className="py-3 text-sm text-ink/40">No inquiries yet.</p>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
