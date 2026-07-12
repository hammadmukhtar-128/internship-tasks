export const Spinner = ({ size = 20, className = '' }) => (
  <svg
    className={`animate-spin ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

export const PageLoader = ({ label = 'Loading...' }) => (
  <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3 text-primary-600">
    <Spinner size={32} />
    <p className="text-sm font-medium text-ink/50">{label}</p>
  </div>
);

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-black/5 ${className}`} />
);
