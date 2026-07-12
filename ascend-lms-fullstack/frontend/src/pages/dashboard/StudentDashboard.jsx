import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardCheck, Award, FileQuestion, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { Skeleton } from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [enrolledRes, subsRes, certsRes, resultsRes] = await Promise.all([
          api.get('/courses/enrolled'),
          api.get('/assignments/my-submissions'),
          api.get('/certificates/my-certificates'),
          api.get('/quizzes/my-results')
        ]);
        setEnrolled(enrolledRes.data.data);
        setSubmissions(subsRes.data.data);
        setCertificates(certsRes.data.data);
        setResults(resultsRes.data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <StatCard icon={BookOpen} label="Enrolled Courses" value={enrolled.length} color="primary" />
        <StatCard icon={ClipboardCheck} label="Assignments Submitted" value={submissions.length} color="amber" />
        <StatCard icon={FileQuestion} label="Quizzes Taken" value={results.length} color="emerald" />
        <StatCard icon={Award} label="Certificates Earned" value={certificates.length} color="rose" />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-ink">Continue Learning</h3>
          <Link to="/courses" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
            Browse all courses <ArrowRight size={14} />
          </Link>
        </div>

        {enrolled.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="You're not enrolled in any courses yet"
            description="Browse the course catalog and enroll to start learning."
            action={<Link to="/courses" className="btn-primary">Browse Courses</Link>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolled.map((c) => (
              <Link key={c._id} to={`/courses/${c._id}`} className="rounded-xl border border-black/5 p-4 transition hover:border-primary-200 hover:shadow-card">
                <p className="truncate font-medium text-ink">{c.title}</p>
                <p className="mt-1 text-xs text-ink/40">by {c.instructor?.fullName}</p>
                <span className="badge mt-3 bg-primary-50 text-primary-700">{c.category}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
