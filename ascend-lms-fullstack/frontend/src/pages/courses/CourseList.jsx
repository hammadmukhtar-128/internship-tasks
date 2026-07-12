import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, BookOpen, Users as UsersIcon } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import { Skeleton } from '../../components/Loader';
import Modal from '../../components/Modal';
import CourseForm from './CourseForm';
import toast from 'react-hot-toast';

const CourseList = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const canCreate = user.role === 'instructor' || user.role === 'admin';

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;
      const { data } = await api.get('/courses', { params });
      setCourses(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      toast.success('Enrolled successfully!');
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            className="input pl-10"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2">
          <select className="input !w-auto" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          {canCreate && (
            <button className="btn-primary shrink-0" onClick={() => setModalOpen(true)}>
              <Plus size={16} /> New Course
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses found" description="Try a different search or check back later." />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div key={c._id} className="card flex flex-col overflow-hidden">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                {c.thumbnail ? (
                  <img src={`${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${c.thumbnail}`} alt={c.title} className="h-full w-full object-cover" />
                ) : (
                  <BookOpen size={32} className="opacity-70" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="badge bg-primary-50 text-primary-700">{c.category}</span>
                  <span className="badge bg-black/5 text-ink/60 capitalize">{c.status}</span>
                </div>
                <Link to={`/courses/${c._id}`} className="font-semibold text-ink hover:text-primary-600">
                  {c.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-ink/50">{c.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-ink/40">
                  <span>by {c.instructor?.fullName || 'Unknown'}</span>
                  <span className="flex items-center gap-1"><UsersIcon size={12} /> {c.studentsEnrolled?.length || 0}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                  <span className="font-semibold text-ink">{c.price > 0 ? `$${c.price}` : 'Free'}</span>
                  {user.role === 'student' ? (
                    c.studentsEnrolled?.some((s) => s._id === user._id || s === user._id) ? (
                      <Link to={`/courses/${c._id}`} className="btn-secondary !py-1.5 !px-3 text-xs">View</Link>
                    ) : (
                      <button onClick={() => handleEnroll(c._id)} className="btn-primary !py-1.5 !px-3 text-xs">Enroll</button>
                    )
                  ) : (
                    <Link to={`/courses/${c._id}`} className="btn-secondary !py-1.5 !px-3 text-xs">Manage</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Course" size="lg">
        <CourseForm
          onSuccess={() => {
            setModalOpen(false);
            fetchCourses();
          }}
        />
      </Modal>
    </div>
  );
};

export default CourseList;
