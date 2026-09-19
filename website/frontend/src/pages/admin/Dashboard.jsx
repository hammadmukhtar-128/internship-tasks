import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Clock3, CheckCircle2, Mail, Stethoscope, Users, AlertTriangle } from "lucide-react";
import { getAppointments } from "../../services/appointmentService";
import { getContactMessages } from "../../services/contactService";
import { getServices } from "../../services/serviceService";
import { getPractitioners } from "../../services/practitionerService";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [appointments, messages, servicesRes, practitionersRes] = await Promise.all([
          getAppointments(),
          getContactMessages(),
          getServices(),
          getPractitioners(),
        ]);
        if (!mounted) return;
        setStats({
          totalAppointments: appointments.length,
          pending: appointments.filter((a) => a.status === "pending").length,
          confirmed: appointments.filter((a) => a.status === "confirmed").length,
          unreadMessages: messages.filter((m) => m.status === "new").length,
          totalServices: servicesRes.items.length,
          totalPractitioners: practitionersRes.items.length,
        });
        setBackendConnected(true);
      } catch {
        if (!mounted) return;
        setBackendConnected(false);
        setStats(null);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = [
    { label: "Total Appointments", value: stats?.totalAppointments, icon: CalendarCheck, to: "/admin/appointments" },
    { label: "Pending Appointments", value: stats?.pending, icon: Clock3, to: "/admin/appointments" },
    { label: "Confirmed Appointments", value: stats?.confirmed, icon: CheckCircle2, to: "/admin/appointments" },
    { label: "Unread Messages", value: stats?.unreadMessages, icon: Mail, to: "/admin/messages" },
    { label: "Total Services", value: stats?.totalServices, icon: Stethoscope, to: "/admin/services" },
    { label: "Total Practitioners", value: stats?.totalPractitioners, icon: Users, to: "/admin/practitioners" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-brand-950">Dashboard</h1>
      <p className="mt-1 text-sm text-brand-500">An overview of your clinic&rsquo;s activity.</p>

      {!backendConnected && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Backend API is not reachable</p>
            <p className="mt-0.5 text-amber-700">
              This is the frontend-only build — connect it to your Express backend (set{" "}
              <code className="rounded bg-amber-100 px-1">VITE_API_URL</code> in <code className="rounded bg-amber-100 px-1">.env</code>)
              to see live stats and manage content here.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="flex items-center gap-4 rounded-xl2 border border-brand-100 bg-white p-6 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <card.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl text-brand-950">{card.value ?? "—"}</p>
              <p className="text-sm text-brand-500">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
