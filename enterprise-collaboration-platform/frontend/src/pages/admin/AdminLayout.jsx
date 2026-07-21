import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Users, Building2, ScrollText } from 'lucide-react';

const TABS = [
  { to: '/admin', end: true, icon: BarChart3, label: 'Analytics' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/teams', icon: Building2, label: 'Teams' },
  { to: '/admin/activity', icon: ScrollText, label: 'Activity logs' },
];

export default function AdminLayout() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Admin panel</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Platform-wide management and analytics.</p>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100/70 p-1 dark:bg-slate-800/60 w-fit">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`
            }
          >
            <tab.icon size={15} /> {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
