import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Clock, Tag, Pencil, Trash2, ArrowLeft, Award } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/Loader';
import Modal from '../../components/Modal';
import CourseForm from './CourseForm';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.data.course);
    } catch (err) {
      toast.error('Course not found');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line
  }, [id]);

  const isOwner = user.role === 'admin' || (user.role === 'instructor' && course?.instructor?._id === user._id);

  const handleDelete = async () => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      navigate('/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleGenerateCertificate = async () => {
    if (!selectedStudent) return toast.error('Select a student first');
    try {
      await api.post('/certificates', { student: selectedStudent, course: id });
      toast.success('Certificate generated successfully');
      setCertModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate certificate');
    }
  };

  if (loading) return <PageLoader />;
  if (!course) return null;

  return (
    <div className="space-y-6">
      <Link to="/courses" className="flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-ink">
        <ArrowLeft size={15} /> Back to courses
      </Link>

      <div className="card overflow-hidden">
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
          {course.thumbnail ? (
            <img
              src={`${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${course.thumbnail}`}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-4xl font-bold text-white/70">{course.title[0]}</span>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-primary-50 text-primary-700">{course.category}</span>
                <span className="badge bg-black/5 text-ink/60 capitalize">{course.status}</span>
              </div>
              <h1 className="mt-2 font-display text-2xl font-semibold text-ink">{course.title}</h1>
              <p className="mt-1 text-sm text-ink/50">by {course.instructor?.fullName}</p>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <button onClick={() => setEditOpen(true)} className="btn-secondary !py-2 !px-3">
                  <Pencil size={15} /> Edit
                </button>
                <button onClick={handleDelete} className="btn-danger !py-2 !px-3">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink/70">{course.description}</p>

          <div className="mt-5 flex flex-wrap gap-6 border-t border-black/5 pt-5 text-sm text-ink/60">
            <span className="flex items-center gap-1.5"><Clock size={15} /> {course.duration || 'Self-paced'}</span>
            <span className="flex items-center gap-1.5"><Users size={15} /> {course.studentsEnrolled?.length || 0} students enrolled</span>
            <span className="flex items-center gap-1.5"><Tag size={15} /> {course.price > 0 ? `$${course.price}` : 'Free'}</span>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">Enrolled Students</h3>
            <button onClick={() => setCertModalOpen(true)} className="btn-secondary !py-1.5 !px-3 text-xs">
              <Award size={14} /> Issue Certificate
            </button>
          </div>
          {course.studentsEnrolled?.length === 0 ? (
            <p className="text-sm text-ink/40">No students enrolled yet.</p>
          ) : (
            <div className="divide-y divide-black/5">
              {course.studentsEnrolled.map((s) => (
                <div key={s._id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{s.fullName}</p>
                    <p className="text-xs text-ink/40">{s.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Course" size="lg">
        <CourseForm
          initialData={course}
          onSuccess={() => {
            setEditOpen(false);
            fetchCourse();
          }}
        />
      </Modal>

      <Modal open={certModalOpen} onClose={() => setCertModalOpen(false)} title="Issue Certificate" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Select student</label>
            <select className="input" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              <option value="">Choose a student...</option>
              {course.studentsEnrolled?.map((s) => (
                <option key={s._id} value={s._id}>{s.fullName} ({s.email})</option>
              ))}
            </select>
          </div>
          <button onClick={handleGenerateCertificate} className="btn-primary w-full">Generate Certificate</button>
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetail;
