"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/authClient";
import AdminSidebar from "./AdminSidebar";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div className="flex bg-ivory">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden p-8">{children}</div>
    </div>
  );
}
