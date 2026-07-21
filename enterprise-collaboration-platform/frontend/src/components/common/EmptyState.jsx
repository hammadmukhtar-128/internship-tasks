export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient-soft">
          <Icon size={24} className="text-brand-600 dark:text-brand-300" />
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      {description && <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {action}
    </div>
  );
}
