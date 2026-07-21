export default function StatCard({ icon: Icon, label, value, accent = 'from-brand-500 to-brand-400' }) {
  return (
    <div className="glass-card relative overflow-hidden p-5">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-1.5 font-display text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-md`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
