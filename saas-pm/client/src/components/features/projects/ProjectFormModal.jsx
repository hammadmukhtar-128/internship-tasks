import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../common/Modal';
import { projectService } from '../../../services';
import { useAuth } from '../../../context/AuthContext';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6', '#14B8A6'];

export default function ProjectFormModal({ open, onClose, onSaved, project }) {
  const { organization } = useAuth();
  const isEdit = !!project;
  const [form, setForm] = useState({
    name: '',
    key: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    dueDate: '',
    color: COLORS[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        key: project.key || '',
        description: project.description || '',
        status: project.status || 'Planning',
        priority: project.priority || 'Medium',
        startDate: project.startDate ? project.startDate.slice(0, 10) : '',
        dueDate: project.dueDate ? project.dueDate.slice(0, 10) : '',
        color: project.color || COLORS[0],
      });
    } else {
      setForm({ name: '', key: '', description: '', status: 'Planning', priority: 'Medium', startDate: '', dueDate: '', color: COLORS[0] });
    }
  }, [project, open]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        const { data } = await projectService.update(project._id, form);
        toast.success('Project updated');
        onSaved(data.data);
      } else {
        const { data } = await projectService.create({ ...form, organization: organization._id });
        toast.success('Project created');
        onSaved(data.data);
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit project' : 'Create project'}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create project'}
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="label">Project name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Website Redesign" />
          </div>
          <div>
            <label className="label">Key</label>
            <input
              required
              maxLength={6}
              disabled={isEdit}
              className="input uppercase disabled:opacity-60"
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
              placeholder="WEB"
            />
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's this project about?" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {['Planning', 'Active', 'On Hold', 'Completed', 'Archived'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Start date</label>
            <input type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Due date</label>
            <input type="date" className="input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="label">Color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                className={`w-7 h-7 rounded-full ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900' : ''}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
