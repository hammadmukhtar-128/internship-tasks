import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../common/Modal';
import { sprintService } from '../../../services';

export default function SprintFormModal({ open, onClose, projectId, onCreated }) {
  const [form, setForm] = useState({ name: '', goal: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const { data } = await sprintService.create({ ...form, project: projectId });
      toast.success('Sprint created');
      onCreated(data.data);
      setForm({ name: '', goal: '', startDate: '', endDate: '' });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create sprint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create sprint"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={loading}>{loading ? 'Creating...' : 'Create sprint'}</button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Sprint name</label>
          <input required autoFocus className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sprint 3" />
        </div>
        <div>
          <label className="label">Goal</label>
          <textarea className="input" rows={2} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="What should this sprint accomplish?" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Start date</label>
            <input type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="label">End date</label>
            <input type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
