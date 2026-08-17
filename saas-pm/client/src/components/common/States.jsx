import React from 'react';
import { Inbox, RefreshCw } from 'lucide-react';

export function Spinner({ size = 20, className = '' }) {
  return <RefreshCw size={size} className={`animate-spin text-brand-500 ${className}`} />;
}

export function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
      <Spinner size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fadeIn">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4">
        <Icon size={26} className="text-brand-500" />
      </div>
      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <RefreshCw size={22} className="text-red-500" />
      </div>
      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{message}</h3>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded mb-2" />
      <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full mb-3" />
      <div className="flex justify-between">
        <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
        <div className="h-6 w-6 bg-gray-100 dark:bg-gray-800 rounded-full" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}
