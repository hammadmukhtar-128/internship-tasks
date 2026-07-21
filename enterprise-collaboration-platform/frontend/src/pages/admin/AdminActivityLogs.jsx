import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { adminApi } from '../../api/admin';

const ACTION_LABELS = {
  user_login: 'User login',
  user_register: 'User registered',
  user_logout: 'User logout',
  password_reset: 'Password reset',
  team_created: 'Team created',
  team_updated: 'Team updated',
  team_deleted: 'Team deleted',
  member_added: 'Member added',
  member_removed: 'Member removed',
  channel_created: 'Channel created',
  channel_updated: 'Channel updated',
  channel_deleted: 'Channel deleted',
  message_sent: 'Message sent',
  message_deleted: 'Message deleted',
  message_edited: 'Message edited',
  role_changed: 'Role changed',
  file_uploaded: 'File uploaded',
};

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getActivityLogs({ limit: 50 })
      .then(({ data }) => setLogs(data.data.logs))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-brand-500" size={24} />
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Team</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-gradient-soft px-2.5 py-1 text-xs font-medium text-brand-700 dark:text-brand-300">
                    {ACTION_LABELS[log.action] || log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{log.user?.name || '—'}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{log.team?.name || '—'}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{log.description || '—'}</td>
                <td className="px-4 py-3 text-right text-xs text-slate-400">
                  {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
