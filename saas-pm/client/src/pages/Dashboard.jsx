import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FolderKanban, ListChecks, CheckCircle2, Clock, AlertTriangle, Rocket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services';
import { PageLoader, ErrorState, EmptyState } from '../components/common/States';
import { StatusBadge, PriorityBadge } from '../components/common/Badges';
import Avatar from '../components/common/Avatar';

const STATUS_COLORS = { 'To Do': '#9CA3AF', 'In Progress': '#3B82F6', 'In Review': '#F59E0B', Done: '#10B981' };
const PRIORITY_COLORS = { Low: '#9CA3AF', Medium: '#3B82F6', High: '#F97316', Urgent: '#EF4444' };

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tint}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xl font-bold leading-tight">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { organization, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    if (!organization) return;
    setLoading(true);
    setError(false);
    try {
      const res = await dashboardService.get(organization._id);
      setData(res.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  if (loading) return <PageLoader label="Loading dashboard..." />;
  if (error) return <ErrorState message="Couldn't load your dashboard." onRetry={load} />;
  if (!data) return null;

  const { totals, tasksByStatus, tasksByPriority, myTasks, upcomingDeadlines, recentActivity, projectProgress } = data;

  const statusChartData = tasksByStatus.map((s) => ({ name: s._id, value: s.count }));
  const priorityChartData = tasksByPriority.map((p) => ({ name: p._id, count: p.count }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's what's happening in {organization?.name}.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard icon={FolderKanban} label="Projects" value={totals.totalProjects} tint="bg-brand-50 text-brand-600 dark:bg-brand-900/30" />
        <StatCard icon={ListChecks} label="Total Tasks" value={totals.totalTasks} tint="bg-blue-50 text-blue-600 dark:bg-blue-900/30" />
        <StatCard icon={CheckCircle2} label="Completed" value={totals.completedTasks} tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" />
        <StatCard icon={Clock} label="Pending" value={totals.pendingTasks} tint="bg-amber-50 text-amber-600 dark:bg-amber-900/30" />
        <StatCard icon={AlertTriangle} label="Overdue" value={totals.overdueTasks} tint="bg-red-50 text-red-600 dark:bg-red-900/30" />
        <StatCard icon={Rocket} label="Active Sprints" value={totals.activeSprints} tint="bg-purple-50 text-purple-600 dark:bg-purple-900/30" />
        <StatCard icon={Users} label="Team" value={totals.teamMembers} tint="bg-pink-50 text-pink-600 dark:bg-pink-900/30" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-1">
          <h3 className="font-semibold mb-4">Tasks by status</h3>
          {statusChartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No tasks yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {statusChartData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {statusChartData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[s.name] }} />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Tasks by priority</h3>
          {priorityChartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No tasks yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityChartData.map((entry) => (
                    <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-1">
          <h3 className="font-semibold mb-4">Project progress</h3>
          {projectProgress.length === 0 ? (
            <EmptyState title="No projects yet" description="Create a project to see progress here." />
          ) : (
            <div className="space-y-4">
              {projectProgress.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <Link to={`/projects/${p.id}`} className="font-medium hover:text-brand-600 truncate">{p.name}</Link>
                    <span className="text-gray-400">{p.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color || '#6366F1' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 lg:col-span-1">
          <h3 className="font-semibold mb-4">My tasks</h3>
          {myTasks.length === 0 ? (
            <EmptyState title="Nothing assigned" description="Tasks assigned to you will show up here." />
          ) : (
            <div className="space-y-3">
              {myTasks.map((t) => (
                <div key={t._id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-gray-400">{t.project?.key}-{t.taskId?.split('-')[1]}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5 lg:col-span-1">
          <h3 className="font-semibold mb-4">Upcoming deadlines</h3>
          {upcomingDeadlines.length === 0 ? (
            <EmptyState title="No upcoming deadlines" />
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((t) => (
                <div key={t._id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={t.assignee?.name} color={t.assignee?.avatarColor} size="xs" />
                    <p className="text-sm truncate">{t.title}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{new Date(t.dueDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Recent activity</h3>
        {recentActivity.length === 0 ? (
          <EmptyState title="No recent activity" />
        ) : (
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a._id} className="flex items-start gap-3">
                <Avatar name={a.user?.name} color={a.user?.avatarColor} size="xs" className="mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{a.description}</p>
                  <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
