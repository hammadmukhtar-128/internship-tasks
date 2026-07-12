import { useEffect, useState, useCallback } from 'react';
import { Plus, ClipboardList, Download, Upload, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import AssignmentForm from './AssignmentForm';
import { Skeleton } from '../../components/Loader';
import toast from 'react-hot-toast';

const API_ROOT = import.meta.env.VITE_API_URL.replace('/api/v1', '');

const AssignmentList = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitModal, setSubmitModal] = useState(null);
  const [submitFile, setSubmitFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isInstructor = user.role === 'instructor' || user.role === 'admin';

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/assignments', { params: { page, limit: 9 } });
      setAssignments(data.data);
      setTotalPages(data.meta?.totalPages || 1);

      if (user.role === 'student') {
        const subsRes = await api.get('/assignments/my-submissions');
        setMySubmissions(subsRes.data.data);
      }
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [page, user.role]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const submissionFor = (assignmentId) => mySubmissions.find((s) => s.assignment?._id === assignmentId || s.assignment === assignmentId);

  const handleSubmit = async () => {
    if (!submitFile) return toast.error('Please choose a file');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('file', submitFile);
      await api.post(`/assignments/${submitModal._id}/submit`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Assignment submitted successfully');
      setSubmitModal(null);
      setSubmitFile(null);
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/50">{assignments.length} assignment{assignments.length !== 1 ? 's' : ''}</p>
        {isInstructor && (
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> New Assignment
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : assignments.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No assignments yet" description="Assignments created by instructors will show up here." />
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => {
            const sub = submissionFor(a._id);
            const isPastDue = new Date() > new Date(a.dueDate);
            return (
              <div key={a._id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{a.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-ink/50">{a.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink/40">
                    <span>{a.course?.title}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Due {format(new Date(a.dueDate), 'MMM d, yyyy h:mm a')}
                    </span>
                    {a.attachment && (
                      <a href={`${API_ROOT}${a.attachment}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary-600 hover:underline">
                        <Download size={12} /> Attachment
                      </a>
                    )}
                  </div>
                </div>

                {user.role === 'student' && (
                  <div className="shrink-0">
                    {sub ? (
                      <span className={`badge flex items-center gap-1 ${sub.status === 'graded' ? 'bg-emerald-50 text-emerald-700' : 'bg-primary-50 text-primary-700'}`}>
                        <CheckCircle2 size={12} />
                        {sub.status === 'graded' ? `Graded: ${sub.marks}/100` : 'Submitted'}
                      </span>
                    ) : (
                      <button onClick={() => setSubmitModal(a)} className={`btn-secondary !py-1.5 !px-3 text-xs ${isPastDue ? 'text-red-600' : ''}`}>
                        <Upload size={13} /> Submit
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Assignment">
        <AssignmentForm onSuccess={() => { setModalOpen(false); fetchAssignments(); }} />
      </Modal>

      <Modal open={Boolean(submitModal)} onClose={() => setSubmitModal(null)} title={`Submit: ${submitModal?.title || ''}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Upload your file</label>
            <input type="file" className="input" onChange={(e) => setSubmitFile(e.target.files[0])} />
          </div>
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AssignmentList;
