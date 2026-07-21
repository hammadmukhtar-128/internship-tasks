export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-surface-light dark:bg-surface-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full bg-brand-gradient opacity-20 animate-ping" />
          <div className="absolute inset-1 rounded-full bg-brand-gradient" />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading workspace...</p>
      </div>
    </div>
  );
}
