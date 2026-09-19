import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Stethoscope,
  Users,
  Quote,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/admin/services", label: "Services", icon: Stethoscope },
  { to: "/admin/practitioners", label: "Practitioners", icon: Users },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/settings", label: "Clinic Settings", icon: SettingsIcon },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  const content = (
    <>
      <div className="flex items-center gap-2 px-2 py-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white">
          <Activity className="h-5 w-5" />
        </span>
        <span className="font-display text-lg text-white">Admin Panel</span>
      </div>
      <nav className="mt-8 flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-brand-700 text-white" : "text-brand-300 hover:bg-brand-800 hover:text-white"
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-300 hover:bg-brand-800 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </button>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-brand-800 bg-brand-950 p-4 lg:hidden">
        <span className="font-display text-lg text-white">Admin Panel</span>
        <button onClick={() => setOpen((v) => !v)} className="focus-ring rounded-lg p-2 text-white" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && <div className="flex flex-col gap-1 border-b border-brand-800 bg-brand-950 p-4 lg:hidden">{content}</div>}
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-950 p-5 lg:flex">{content}</aside>
    </>
  );
}
