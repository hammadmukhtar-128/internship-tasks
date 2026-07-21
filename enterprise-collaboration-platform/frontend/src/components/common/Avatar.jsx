import { useSocket } from '../../context/SocketContext';

const STATUS_COLOR = {
  online: 'bg-emerald-500',
  away: 'bg-amber-400',
  offline: 'bg-slate-400',
};

function initials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Avatar({ user, size = 'md', showStatus = true }) {
  const { onlineUsers } = useSocket() || {};
  const liveStatus = onlineUsers?.[user?._id]?.status || user?.status || 'offline';

  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  };

  return (
    <div className={`relative shrink-0 ${sizes[size]}`}>
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className={`h-full w-full rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10`}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center rounded-full bg-brand-gradient font-semibold text-white`}
        >
          {initials(user?.name)}
        </div>
      )}
      {showStatus && (
        <span
          className={`presence-dot ${STATUS_COLOR[liveStatus]} ${
            liveStatus === 'online' ? 'animate-pulse-ring' : ''
          }`}
        />
      )}
    </div>
  );
}
