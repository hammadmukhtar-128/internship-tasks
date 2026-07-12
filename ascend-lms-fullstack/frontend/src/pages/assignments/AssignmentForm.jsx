import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AssignmentForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', course: '' });
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/courses/my-courses').then(({ data }) => setCourses(data.data)).catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    if (!form.course) e.course = 'Please select a course';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('attachment', file);
      await api.post('/assignments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Assignment created successfully');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Course</label>
        <select className="input" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
          <option value="">Select a course...</option>
          {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        {errors.course && <p className="mt-1 text-xs text-red-600">{errors.course}</p>}
      </div>

      <div>
        <label className="label">Title</label>
        <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="label">Due date</label>
        <input type="datetime-local" className="input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>}
      </div>

      <div>
        <label className="label">Attachment (optional)</label>
        <input type="file" className="input" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Creating...' : 'Create Assignment'}
      </button>
    </form>
  );
};

export default AssignmentForm;
