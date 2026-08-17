import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  KanbanSquare,
  Rocket,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Github,
} from 'lucide-react';

const features = [
  {
    icon: KanbanSquare,
    title: 'Visual Kanban boards',
    desc: 'Drag and drop tasks across To Do, In Progress, In Review and Done — synced live to the database.',
  },
  {
    icon: Rocket,
    title: 'Sprint planning',
    desc: 'Plan sprints, move tasks in and out of the backlog, and track velocity with real burndown charts.',
  },
  {
    icon: BarChart3,
    title: 'Actionable analytics',
    desc: 'A dashboard built from real data: completion rates, overdue tasks, and per-project progress.',
  },
  {
    icon: Users,
    title: 'Team collaboration',
    desc: 'Invite teammates, assign roles, comment on tasks, and keep everyone aligned with activity logs.',
  },
];

const steps = [
  { title: 'Create a workspace', desc: 'Spin up an organization for your team in seconds.' },
  { title: 'Add projects & tasks', desc: 'Break work down into projects, tasks, and subtasks.' },
  { title: 'Plan & ship sprints', desc: 'Organize tasks into sprints and track progress to done.' },
];

function KanbanPreview() {
  const cols = [
    { name: 'To Do', color: 'bg-gray-100 dark:bg-gray-800', items: ['Design homepage', 'Set up CI/CD'] },
    { name: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/20', items: ['Build login API', 'Kanban board UI'] },
    { name: 'In Review', color: 'bg-amber-50 dark:bg-amber-900/20', items: ['Fix mobile layout'] },
    { name: 'Done', color: 'bg-emerald-50 dark:bg-emerald-900/20', items: ['JWT auth', 'Dark mode'] },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cols.map((c) => (
        <div key={c.name} className={`rounded-xl p-3 ${c.color}`}>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{c.name}</p>
          <div className="space-y-2">
            {c.items.map((item) => (
              <div key={item} className="bg-white dark:bg-gray-900 rounded-lg p-2.5 shadow-card text-xs font-medium text-gray-700 dark:text-gray-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1117] text-gray-900 dark:text-gray-100">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg">Flowdesk</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">Sign in</Link>
            <Link to="/register" className="btn-primary">Get started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-1.5 badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 mb-5">
          <Sparkles size={12} /> Built for fast-moving teams
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Project management that keeps your team <span className="text-brand-600">actually</span> in sync
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto text-lg">
          Plan projects, run sprints, and track work on a Kanban board — with real-time data, not spreadsheets.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            Sign in
          </Link>
        </div>

        <div className="card mt-14 p-4 sm:p-6 text-left animate-slideUp">
          <KanbanPreview />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">Everything your team needs</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-10">One platform for planning, executing, and tracking work.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 hover:shadow-popover transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-600" />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 dark:bg-gray-900/40 py-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics + Collaboration preview */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 grid md:grid-cols-2 gap-8">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-brand-600" />
            <h3 className="font-semibold">Analytics that update themselves</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['Total tasks', '128'],
              ['Completed', '84'],
              ['Overdue', '6'],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xl font-bold">{val}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={18} className="text-brand-600" />
            <h3 className="font-semibold">Team collaboration built in</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Role-based access (Owner, Admin, Member, Viewer)</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Comments & activity history on every task</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Invite teammates by email</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 lg:px-6 pb-20">
        <div className="card p-10 text-center bg-brand-600 border-none">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to get organized?</h2>
          <p className="text-brand-100 mb-6">Create your workspace and invite your team — free.</p>
          <Link to="/register" className="btn bg-white text-brand-700 hover:bg-brand-50 px-6 py-3 text-base inline-flex">
            Create your workspace <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Layers size={16} /> Flowdesk
          </div>
          <p>&copy; {new Date().getFullYear()} Flowdesk. Built as a demo SaaS project.</p>
          <a href="#" className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200">
            <Github size={15} /> Source
          </a>
        </div>
      </footer>
    </div>
  );
}
