import { useEffect, useState } from 'react';
import { Users, BookOpen, ClipboardList, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { Skeleton } from '../../components/Loader';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, courses: 0, assignments: 0, certificates: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, coursesRes, assignmentsRes, certsRes] = await Promise.all([
          api.get('/users', { params: { limit: 1 } }),
          api.get('/courses', { params: { limit: 100 } }),
          api.get('/assignments', { params: { limit: 1 } }),
          api.get('/certificates')
        ]);

        const courses = coursesRes.data.data;
        const categoryCounts = {};
        courses.forEach((c) => {
          categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
        });

        setStats({
          users: usersRes.data.meta?.total ?? 0,
          courses: coursesRes.data.meta?.total ?? courses.length,
          assignments: assignmentsRes.data.meta?.total ?? 0,
          certificates: certsRes.data.data?.length ?? 0
        });
        setCategoryData(Object.entries(categoryCounts).map(([name, count]) => ({ name, count })));
        setRecentCourses(courses.slice(0, 5));
      } catch (err) {
        // fail silently, widgets will just show 0
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={stats.users} color="primary" />
        <StatCard icon={BookOpen} label="Total Courses" value={stats.courses} color="emerald" />
        <StatCard icon={ClipboardList} label="Assignments" value={stats.assignments} color="amber" />
        <StatCard icon={Award} label="Certificates Issued" value={stats.certificates} color="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-ink">Courses by Category</h3>
          {categoryData.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink/40">No course data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#6c5ce70d' }} />
                <Bar dataKey="count" fill="#5642d6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-semibold text-ink">Recently Added Courses</h3>
          <div className="space-y-3">
            {recentCourses.length === 0 && <p className="text-sm text-ink/40">No courses yet.</p>}
            {recentCourses.map((c) => (
              <div key={c._id} className="flex items-center justify-between border-b border-black/5 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{c.title}</p>
                  <p className="text-xs text-ink/40">{c.category}</p>
                </div>
                <span className="badge bg-primary-50 text-primary-700 capitalize">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
