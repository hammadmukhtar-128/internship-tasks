"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminGuard from "@/components/AdminGuard";
import { api } from "@/lib/api";
import { getSession } from "@/lib/authClient";
import { Agent } from "@/types";
import { HiOutlineTrash } from "react-icons/hi";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);

  const load = () => {
    api.get<{ data: Agent[] }>("/agents").then((r) => setAgents(r.data)).catch(() => {});
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    const session = getSession();
    if (!session || !confirm("Remove this agent?")) return;
    await api.delete(`/agents/${id}`, session.token);
    load();
  };

  return (
    <AdminGuard>
      <h1 className="font-display text-2xl font-bold text-ink">Agents</h1>
      <p className="mt-1 text-sm text-ink/50">
        Use the <code>/api/agents</code> POST endpoint (same pattern as Properties) to add new agents, or extend this
        page with a create form.
      </p>
      <div className="card-luxury mt-6 divide-y divide-ink/5">
        {agents.map((a) => (
          <div key={a._id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image src={a.image} alt={a.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-medium text-ink">{a.name}</p>
                <p className="text-xs text-ink/50">{a.designation}</p>
              </div>
            </div>
            <button onClick={() => remove(a._id)} className="text-red-500 hover:text-red-700">
              <HiOutlineTrash />
            </button>
          </div>
        ))}
        {agents.length === 0 && <p className="p-6 text-center text-ink/40">No agents yet.</p>}
      </div>
    </AdminGuard>
  );
}
