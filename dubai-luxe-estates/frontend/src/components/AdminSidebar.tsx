"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/lib/authClient";
import { HiOutlineViewGrid, HiOutlineHome, HiOutlineUserGroup, HiOutlineNewspaper, HiOutlineMailOpen, HiOutlineLogout } from "react-icons/hi";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { href: "/admin/properties", label: "Properties", icon: HiOutlineHome },
  { href: "/admin/agents", label: "Agents", icon: HiOutlineUserGroup },
  { href: "/admin/blogs", label: "Blog Posts", icon: HiOutlineNewspaper },
  { href: "/admin/inquiries", label: "Inquiries", icon: HiOutlineMailOpen },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-ink text-ivory">
      <div className="p-6">
        <p className="font-display text-lg font-bold">
          Lahore <span className="gold-text">Estate</span>
        </p>
        <p className="text-xs uppercase tracking-wider text-ivory/40">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
              pathname.startsWith(l.href) ? "bg-gold-gradient text-ink font-semibold" : "text-ivory/70 hover:bg-white/5"
            }`}
          >
            <l.icon /> {l.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={() => {
          clearSession();
          router.push("/admin/login");
        }}
        className="m-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-ivory/70 hover:bg-white/5"
      >
        <HiOutlineLogout /> Logout
      </button>
    </aside>
  );
}
