import { useEffect, useState, useCallback } from 'react';
import { Bell, CheckCheck, Trash2, BookOpen, ClipboardList, FileQuestion, Award, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import { Skeleton } from '../../components/Loader';
import toast from 'react-hot-toast';

const iconMap = {
  new_course: BookOpen,
  assignment_added: ClipboardList,
  assignment_deadline: Clock,
  quiz_published: FileQuestion,
  certificate_generated: Award,
  general: Bell
};

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications', { params: { page, limit: 10 } });
      setNotifications(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((ns) => ns.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((ns) => ns.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((ns) => ns.filter((n) => n._id !== id));
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/50">{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</p>
        <button onClick={markAllRead} className="btn-secondary !py-1.5 !px-3 text-xs">
          <CheckCheck size={14} /> Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <div
                key={n._id}
                className={`card flex items-start gap-3 p-4 ${!n.isRead ? 'border-l-4 border-l-primary-500' : ''}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="text-sm text-ink/50">{n.message}</p>
                  <p className="mt-1 text-xs text-ink/30">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n._id)} className="rounded-lg p-1.5 text-ink/40 hover:bg-black/5" title="Mark as read">
                      <CheckCheck size={15} />
                    </button>
                  )}
                  <button onClick={() => remove(n._id)} className="rounded-lg p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default NotificationList;
