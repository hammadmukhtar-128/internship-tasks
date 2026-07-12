import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { PageLoader } from '../../components/Loader';
import toast from 'react-hot-toast';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api
      .get(`/quizzes/${id}`)
      .then(({ data }) => setQuiz(data.data.quiz))
      .catch(() => toast.error('Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    const unanswered = quiz.questions.filter((q) => !answers[q._id]);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = { answers: Object.entries(answers).map(([question, selectedAnswer]) => ({ question, selectedAnswer })) };
      const { data } = await api.post(`/quizzes/${id}/attempt`, payload);
      setResult(data.data.result);
      toast.success('Quiz submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!quiz) return null;

  if (result) {
    const percent = Math.round((result.score / result.totalPoints) * 100);
    return (
      <div className="mx-auto max-w-lg">
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Quiz Completed!</h1>
          <p className="mt-2 text-ink/50">You scored</p>
          <p className="mt-1 font-display text-4xl font-bold text-primary-600">
            {result.score}/{result.totalPoints}
          </p>
          <p className="text-sm text-ink/40">({percent}%)</p>
          <button onClick={() => navigate('/quizzes')} className="btn-primary mt-6 w-full">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="card p-6">
        <h1 className="font-display text-xl font-semibold text-ink">{quiz.title}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/50">
          <Clock size={14} /> {quiz.duration} minutes · {quiz.questions.length} questions
        </p>
      </div>

      {quiz.questions.map((q, idx) => (
        <div key={q._id} className="card p-6">
          <p className="mb-4 font-medium text-ink">
            {idx + 1}. {q.questionText} <span className="text-xs font-normal text-ink/40">({q.points} pts)</span>
          </p>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                  answers[q._id] === opt ? 'border-primary-500 bg-primary-50' : 'border-black/10 hover:border-black/20'
                }`}
              >
                <input
                  type="radio"
                  name={q._id}
                  checked={answers[q._id] === opt}
                  onChange={() => setAnswers({ ...answers, [q._id]: opt })}
                  className="accent-primary-600"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  );
};

export default QuizAttempt;
