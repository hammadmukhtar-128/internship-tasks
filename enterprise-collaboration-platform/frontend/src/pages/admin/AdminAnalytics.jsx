import { useEffect, useState } from 'react';
import { Loader2, Users, Building2, MessageSquare, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { adminApi } from '../../api/admin';
import StatCard from '../../components/dashboard/StatCard';

const ROLE_COLORS = { admin: '#7C4DFF', team_owner: '#4DD0E1', member: '#F59E0B' };

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then(({ data: res }) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    );
  }

  const totals = data?.totals || {};
  const roleData = (data?.usersByRole || []).map((r) => ({ name: r._id, value: r.count }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={totals.totalUsers ?? 0} accent="from-brand-500 to-indigo-400" />
        <StatCard icon={Building2} label="Total teams" value={totals.totalTeams ?? 0} accent="from-cyan-500 to-teal-400" />
        <StatCard icon={MessageSquare} label="Total messages" value={totals.totalMessages ?? 0} accent="from-fuchsia-500 to-pink-400" />
        <StatCard icon={Activity} label="Active now" value={totals.activeToday ?? 0} accent="from-emerald-500 to-green-400" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">
            Growth (last 30 days)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Line type="monotone" dataKey="count" name="New users" stroke="#7C4DFF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Users by role</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {roleData.map((entry) => (
                  <Cell key={entry.name} fill={ROLE_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="mb-4 font-display font-semibold text-slate-800 dark:text-white">Message volume (30 days)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data?.messageVolume || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
            <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
            <Line type="monotone" dataKey="count" name="Messages" stroke="#4DD0E1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
