"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { api } from "@/lib/api";
import { getSession } from "@/lib/authClient";
import { HiOutlineTrash } from "react-icons/hi";

interface Inquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const load = () => {
    const session = getSession();
    if (!session) return;
    api.get<{ data: Inquiry[] }>("/inquiries").then((r) => setInquiries(r.data)).catch(() => {});
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    const session = getSession();
    if (!session) return;
    await api.put(`/inquiries/${id}`, { status }, session.token);
    load();
  };

  const remove = async (id: string) => {
    const session = getSession();
    if (!session || !confirm("Delete this inquiry?")) return;
    await api.delete(`/inquiries/${id}`, session.token);
    load();
  };

  return (
    <AdminGuard>
      <h1 className="font-display text-2xl font-bold text-ink">Inquiries</h1>
      <div className="card-luxury mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink/5 text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {inquiries.map((i) => (
              <tr key={i._id}>
                <td className="px-6 py-4 font-medium text-ink">{i.name}</td>
                <td className="px-6 py-4 text-ink/60">{i.phone}<br />{i.email}</td>
                <td className="max-w-xs px-6 py-4 text-ink/60">{i.message}</td>
                <td className="px-6 py-4">
                  <select value={i.status} onChange={(e) => updateStatus(i._id, e.target.value)} className="rounded-lg border border-ink/10 px-2 py-1 text-xs">
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => remove(i._id)} className="text-red-500 hover:text-red-700">
                    <HiOutlineTrash />
                  </button>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-ink/40">
                  No inquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminGuard>
  );
}
