import { useEffect, useState } from 'react';
import { MessageSquare, Users, Hash, UserCheck, Loader2 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { dashboardApi } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/common/EmptyState';

const ACTION_LABELS = {
  user_login: 'logged in',
  user_register: 'joined the platform',
  team_created: 'created a team',
  team_updated: 'updated team settings',
  member_added: 'joined a team',
  member_removed: 'was removed from a team',
  channel_created: 'created a channel',
  channel_updated: 'updated a channel',
  message_sent: 'sent a message',
  message_deleted: 'deleted a message',
  role_changed: "changed a member's role",
  file_uploaded: 'uploaded a file',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: ov }, { data: act }] = await Promise.all([
          dashboardApi.getOverview(),
          dashboardApi.getRecentActivity(),
        ]);
        setOverview(ov.data);
        setActivity(act.data.activity);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    );
  }

  const stats = overview?.stats || {};

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here's what's happening across your workspace today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Teams" value={stats.teams ?? 0} accent="from-brand-500 to-indigo-400" />
        <StatCard icon={Hash} label="Channels" value={stats.channels ?? 0} accent="from-cyan-500 to-teal-400" />
        <StatCard icon={MessageSquare} label="Messages" value={stats.messages ?? 0} accent="from-fuchsia-500 to-pink-400" />
        <StatCard icon={UserCheck} label="Members" value={stats.members ?? 0} accent="from-amber-500 to-orange-400" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Message activity (7 days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={overview?.messageTrend || []}>
              <defs>
                <linearGradient id="msgGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C4DFF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#7C4DFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} stroke="currentColor" className="text-slate-400" />
              <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-slate-400" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#7C4DFF" strokeWidth={2} fill="url(#msgGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Team distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={overview?.teamDistribution || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Bar dataKey="memberCount" fill="#4DD0E1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 glass-card p-5">
        <h3 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Recent activity</h3>
        {activity.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No recent activity" description="Actions across your teams will show up here." />
        ) : (
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a._id} className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                  {a.user?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <p className="flex-1 text-slate-600 dark:text-slate-300">
                  <span className="font-medium text-slate-800 dark:text-white">{a.user?.name || 'Someone'}</span>{' '}
                  {ACTION_LABELS[a.action] || a.action}
                  {a.team?.name && <> in <span className="font-medium">{a.team.name}</span></>}
                </p>
                <span className="shrink-0 text-xs text-slate-400">
                  {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
