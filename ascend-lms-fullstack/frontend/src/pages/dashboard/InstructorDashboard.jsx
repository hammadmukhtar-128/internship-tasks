import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardList, FileQuestion, Users, Plus } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { Skeleton } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const InstructorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [coursesRes, assignmentsRes, quizzesRes] = await Promise.all([
          api.get('/courses/my-courses'),
          api.get('/assignments', { params: { limit: 1 } }),
          api.get('/quizzes', { params: { limit: 1 } })
        ]);
        setCourses(coursesRes.data.data);
        setAssignmentCount(assignmentsRes.data.meta?.total ?? 0);
        setQuizCount(quizzesRes.data.meta?.total ?? 0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.studentsEnrolled?.length || 0), 0);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="My Courses" value={courses.length} color="primary" />
        <StatCard icon={Users} label="Total Students" value={totalStudents} color="emerald" />
        <StatCard icon={ClipboardList} label="Assignments" value={assignmentCount} color="amber" />
        <StatCard icon={FileQuestion} label="Quizzes" value={quizCount} color="rose" />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-ink">My Courses</h3>
          <Link to="/courses" className="btn-primary !py-2 !px-3.5 text-xs">
            <Plus size={14} /> New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Create your first course to start teaching students."
            action={<Link to="/courses" className="btn-primary">Create a course</Link>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((c) => (
              <Link key={c._id} to={`/courses/${c._id}`} className="rounded-xl border border-black/5 p-4 transition hover:border-primary-200 hover:shadow-card">
                <p className="truncate font-medium text-ink">{c.title}</p>
                <p className="mt-1 text-xs text-ink/40">{c.category}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="badge bg-primary-50 text-primary-700 capitalize">{c.status}</span>
                  <span className="text-ink/40">{c.studentsEnrolled?.length || 0} students</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
