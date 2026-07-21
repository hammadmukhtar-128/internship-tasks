import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-surface-light text-center dark:bg-surface-dark">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient-soft">
        <Compass size={28} className="text-brand-500" />
      </div>
      <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white">Page not found</h1>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn-primary">
        Back to dashboard
      </Link>
    </div>
  );
}
