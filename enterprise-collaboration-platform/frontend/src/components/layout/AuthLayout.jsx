import { MessageSquare, Zap, ShieldCheck, Users } from 'lucide-react';

const FEATURES = [
  { icon: MessageSquare, text: 'Real-time messaging with typing indicators & read receipts' },
  { icon: Users, text: 'Team & channel management with granular roles' },
  { icon: Zap, text: 'Instant notifications and @mentions' },
  { icon: ShieldCheck, text: 'Enterprise-grade security with JWT & audit logs' },
];

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-gradient p-12 text-white lg:flex">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <MessageSquare size={18} />
          </div>
          <span className="font-display text-lg font-bold">Enterprise Collab</span>
        </div>

        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Where teams get work done, together.
          </h1>
          <p className="mt-3 max-w-md text-white/80">
            Chat, teams, channels, and analytics — one modern platform built for how work actually happens.
          </p>
          <div className="mt-10 space-y-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <f.icon size={15} />
                </div>
                <span className="text-sm text-white/90">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/60">© {new Date().getFullYear()} Enterprise Collab. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <MessageSquare size={18} />
              </div>
              <span className="font-display text-lg font-bold text-slate-800 dark:text-white">Enterprise Collab</span>
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
          {subtitle && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
