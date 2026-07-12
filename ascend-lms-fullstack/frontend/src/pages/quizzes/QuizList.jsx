import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileQuestion, Clock, Trash2, BarChart3 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import QuizForm from './QuizForm';
import { Skeleton } from '../../components/Loader';
import toast from 'react-hot-toast';

const QuizList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultsModal, setResultsModal] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  const isInstructor = user.role === 'instructor' || user.role === 'admin';

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/quizzes', { params: { page, limit: 9 } });
      setQuizzes(data.data);
      setTotalPages(data.meta?.totalPages || 1);
      if (user.role === 'student') {
        const resultsRes = await api.get('/quizzes/my-results');
        setMyResults(resultsRes.data.data);
      }
    } catch (err) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, [page, user.role]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const resultFor = (quizId) => myResults.find((r) => r.quiz?._id === quizId);

  const handleDelete = async (quizId) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/quizzes/${quizId}`);
      toast.success('Quiz deleted');
      fetchQuizzes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete quiz');
    }
  };

  const viewResults = async (quiz) => {
    setResultsModal(quiz);
    try {
      const { data } = await api.get(`/quizzes/${quiz._id}/results`);
      setQuizResults(data.data);
    } catch (err) {
      toast.error('Failed to load results');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/50">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''}</p>
        {isInstructor && (
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> New Quiz
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState icon={FileQuestion} title="No quizzes yet" description="Quizzes created by instructors will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((q) => {
            const result = resultFor(q._id);
            return (
              <div key={q._id} className="card flex flex-col p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="badge bg-primary-50 text-primary-700 capitalize">{q.status}</span>
                  <span className="flex items-center gap-1 text-xs text-ink/40"><Clock size={12} /> {q.duration}m</span>
                </div>
                <p className="font-medium text-ink">{q.title}</p>
                <p className="mt-0.5 text-xs text-ink/40">{q.course?.title} · {q.questions?.length || 0} questions</p>

                <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                  {user.role === 'student' ? (
                    result ? (
                      <span className="badge bg-emerald-50 text-emerald-700">Score: {result.score}/{result.totalPoints}</span>
                    ) : (
                      <button onClick={() => navigate(`/quizzes/${q._id}/attempt`)} className="btn-primary !py-1.5 !px-3 text-xs">
                        Take Quiz
                      </button>
                    )
                  ) : (
                    <div className="flex w-full gap-2">
                      <button onClick={() => viewResults(q)} className="btn-secondary !py-1.5 !px-3 text-xs flex-1">
                        <BarChart3 size={13} /> Results
                      </button>
                      <button onClick={() => handleDelete(q._id)} className="btn-danger !py-1.5 !px-2.5 text-xs">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Quiz" size="lg">
        <QuizForm onSuccess={() => { setModalOpen(false); fetchQuizzes(); }} />
      </Modal>

      <Modal open={Boolean(resultsModal)} onClose={() => setResultsModal(null)} title={`Results: ${resultsModal?.title || ''}`}>
        {quizResults.length === 0 ? (
          <p className="text-sm text-ink/40">No attempts yet.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {quizResults.map((r) => (
              <div key={r._id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-ink">{r.student?.fullName}</p>
                  <p className="text-xs text-ink/40">{r.student?.email}</p>
                </div>
                <span className="badge bg-primary-50 text-primary-700">{r.score}/{r.totalPoints}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuizList;
