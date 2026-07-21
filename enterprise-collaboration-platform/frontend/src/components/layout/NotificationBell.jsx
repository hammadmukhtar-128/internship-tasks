import { useEffect, useRef, useState } from 'react';
import { Bell, Check, AtSign, MessageSquare, UserPlus, Hash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { notificationsApi } from '../../api/notifications';
import { useSocket } from '../../context/SocketContext';

const ICONS = {
  mention: AtSign,
  message: MessageSquare,
  team_invite: UserPlus,
  channel_created: Hash,
  channel_updated: Hash,
  team_join: UserPlus,
  removed_from_team: UserPlus,
  channel_invite: Hash,
  system: Bell,
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);
  const { socket } = useSocket() || {};

  const load = async () => {
    try {
      const [{ data: list }, { data: count }] = await Promise.all([
        notificationsApi.getMine({ limit: 15 }),
        notificationsApi.getUnreadCount(),
      ]);
      setNotifications(list.data.notifications);
      setUnread(count.data.count);
    } catch (err) {
      // silent - non-critical widget
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (n) => {
      setNotifications((prev) => [n, ...prev].slice(0, 15));
      setUnread((prev) => prev + 1);
    };
    socket.on('notification:new', handler);
    return () => socket.off('notification:new', handler);
  }, [socket]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const markAllRead = async () => {
    await notificationsApi.markAllAsRead();
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markOneRead = async (n) => {
    if (n.isRead) return;
    await notificationsApi.markAsRead(n._id);
    setNotifications((prev) => prev.map((item) => (item._id === n._id ? { ...item, isRead: true } : item)));
    setUnread((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 glass-card animate-slide-up p-2">
          <div className="flex items-center justify-between px-2 py-1.5">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notifications</h4>
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-300"
            >
              <Check size={12} /> Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-slate-400">You're all caught up</p>
            )}
            {notifications.map((n) => {
              const Icon = ICONS[n.type] || Bell;
              return (
                <button
                  key={n._id}
                  onClick={() => markOneRead(n)}
                  className={`flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800/70 ${
                    !n.isRead ? 'bg-brand-50/60 dark:bg-brand-900/20' : ''
                  }`}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-gradient-soft">
                    <Icon size={13} className="text-brand-600 dark:text-brand-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{n.title}</p>
                    {n.body && <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{n.body}</p>}
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
