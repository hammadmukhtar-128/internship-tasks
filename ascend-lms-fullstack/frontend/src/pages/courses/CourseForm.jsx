import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CourseForm = ({ initialData, onSuccess }) => {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    duration: initialData?.duration || '',
    price: initialData?.price || 0,
    status: initialData?.status || 'draft'
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category.trim()) e.category = 'Category is required';
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
      if (thumbnail) fd.append('thumbnail', thumbnail);

      if (isEdit) {
        await api.put(`/courses/${initialData._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Course updated successfully');
      } else {
        await api.post('/courses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Course created successfully');
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Course thumbnail</label>
        <label className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-black/10 bg-black/[0.02] hover:border-primary-300">
          {preview ? (
            <img src={preview} alt="preview" className="h-full w-full rounded-xl object-cover" />
          ) : (
            <div className="flex flex-col items-center text-ink/40">
              <ImageIcon size={22} />
              <span className="mt-1 text-xs">Click to upload thumbnail</span>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>
        <div>
          <label className="label">Duration</label>
          <input className="input" placeholder="e.g. 6 weeks" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Price (USD)</label>
          <input type="number" min="0" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
      </button>
    </form>
  );
};

export default CourseForm;
