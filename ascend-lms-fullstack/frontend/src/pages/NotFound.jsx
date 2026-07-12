import { Link } from 'react-router-dom';
import { CompassIcon } from 'lucide-react';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-6 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
      <CompassIcon size={28} />
    </div>
    <h1 className="mt-4 font-display text-3xl font-bold text-ink">404</h1>
    <p className="mt-1 text-ink/50">The page you're looking for doesn't exist.</p>
    <Link to="/dashboard" className="btn-primary mt-6">Go to Dashboard</Link>
  </div>
);

export default NotFound;
