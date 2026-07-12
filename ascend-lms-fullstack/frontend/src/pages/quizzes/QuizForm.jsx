import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const emptyQuestion = () => ({
  questionText: '',
  type: 'multiple_choice',
  options: ['', '', '', ''],
  correctAnswer: '',
  points: 1
});

const QuizForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ title: '', course: '', duration: 30, status: 'draft' });
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/courses/my-courses').then(({ data }) => setCourses(data.data)).catch(() => {});
  }, []);

  const updateQuestion = (idx, field, value) => {
    setQuestions((qs) => qs.map((q, i) => (i === idx ? { ...q, [field]: value } : q)));
  };

  const updateOption = (qIdx, optIdx, value) => {
    setQuestions((qs) =>
      qs.map((q, i) => (i === qIdx ? { ...q, options: q.options.map((o, oi) => (oi === optIdx ? value : o)) } : q))
    );
  };

  const addQuestion = () => setQuestions((qs) => [...qs, emptyQuestion()]);
  const removeQuestion = (idx) => setQuestions((qs) => qs.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.course) return toast.error('Title and course are required');
    for (const q of questions) {
      if (!q.questionText || !q.correctAnswer) return toast.error('Fill in all question fields');
    }

    setLoading(true);
    try {
      await api.post('/quizzes', {
        ...form,
        questions: questions.map((q) => ({
          ...q,
          options: q.type === 'true_false' ? ['True', 'False'] : q.options.filter(Boolean)
        }))
      });
      toast.success('Quiz created successfully');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Course</label>
        <select className="input" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
          <option value="">Select a course...</option>
          {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>

      <div>
        <label className="label">Quiz title</label>
        <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Duration (minutes)</label>
          <input type="number" className="input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-ink">Questions</h4>
          <button type="button" onClick={addQuestion} className="btn-ghost !py-1 !px-2 text-xs">
            <Plus size={13} /> Add question
          </button>
        </div>

        {questions.map((q, idx) => (
          <div key={idx} className="rounded-xl border border-black/10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-ink/40">Question {idx + 1}</span>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(idx)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <input
              className="input mb-3"
              placeholder="Question text"
              value={q.questionText}
              onChange={(e) => updateQuestion(idx, 'questionText', e.target.value)}
            />

            <div className="mb-3 grid grid-cols-2 gap-3">
              <select className="input" value={q.type} onChange={(e) => updateQuestion(idx, 'type', e.target.value)}>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True / False</option>
              </select>
              <input
                type="number"
                min="1"
                className="input"
                placeholder="Points"
                value={q.points}
                onChange={(e) => updateQuestion(idx, 'points', e.target.value)}
              />
            </div>

            {q.type === 'multiple_choice' ? (
              <div className="mb-3 grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <input
                    key={oi}
                    className="input"
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(idx, oi, e.target.value)}
                  />
                ))}
              </div>
            ) : null}

            <div>
              <label className="label !mb-1 text-xs">Correct answer</label>
              {q.type === 'true_false' ? (
                <select className="input" value={q.correctAnswer} onChange={(e) => updateQuestion(idx, 'correctAnswer', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              ) : (
                <input
                  className="input"
                  placeholder="Must match one of the options exactly"
                  value={q.correctAnswer}
                  onChange={(e) => updateQuestion(idx, 'correctAnswer', e.target.value)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Creating...' : 'Create Quiz'}
      </button>
    </form>
  );
};

export default QuizForm;
