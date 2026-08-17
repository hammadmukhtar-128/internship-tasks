import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../common/Modal';
import { taskService } from '../../../services';

const STATUSES = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function TaskCreateModal({ open, onClose, projectId, defaultStatus = 'To Do', projectMembers = [], sprints = [], onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', status: defaultStatus, priority: 'Medium', assignee: '', dueDate: '', sprint: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setForm({ title: '', description: '', status: defaultStatus, priority: 'Medium', assignee: '', dueDate: '', sprint: '' });
  }, [open, defaultStatus]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const { data } = await taskService.create({ ...form, project: projectId, assignee: form.assignee || null, sprint: form.sprint || null });
      toast.success('Task created');
      onCreated(data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create task"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={loading}>{loading ? 'Creating...' : 'Create task'}</button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input required autoFocus className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Assignee</label>
            <select className="input" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}>
              <option value="">Unassigned</option>
              {projectMembers.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Due date</label>
            <input type="date" className="input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </div>
        {sprints.length > 0 && (
          <div>
            <label className="label">Sprint</label>
            <select className="input" value={form.sprint} onChange={(e) => setForm({ ...form, sprint: e.target.value })}>
              <option value="">Backlog (no sprint)</option>
              {sprints.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        )}
      </form>
    </Modal>
  );
}
