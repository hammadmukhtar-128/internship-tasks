const colorMap = {
  primary: 'bg-primary-50 text-primary-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600'
};

const StatCard = ({ icon: Icon, label, value, color = 'primary', hint }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorMap[color]}`}>
      <Icon size={22} />
    </div>
    <div className="min-w-0">
      <p className="text-sm text-ink/50">{label}</p>
      <p className="text-2xl font-semibold text-ink">{value}</p>
      {hint && <p className="text-xs text-ink/40">{hint}</p>}
    </div>
  </div>
);

export default StatCard;
