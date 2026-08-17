import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Paperclip, Send, Download, X, Plus } from 'lucide-react';
import { Modal, ConfirmDialog } from '../../common/Modal';
import Avatar from '../../common/Avatar';
import { taskService } from '../../../services';
import { getApiBaseUrl } from '../../../services/api';
import SubTaskList from './SubTaskList';
import { useAuth } from '../../../context/AuthContext';

const STATUSES = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function TaskModal({ taskId, open, onClose, projectMembers = [], onUpdated, onDeleted }) {
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (open && taskId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, taskId]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await taskService.get(taskId);
      setTask(data.data);
    } catch (err) {
      toast.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const patch = async (fields) => {
    setSaving(true);
    try {
      const { data } = await taskService.update(taskId, fields);
      setTask((prev) => ({ ...prev, ...data.data }));
      onUpdated?.(data.data);
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await taskService.addComment(taskId, commentText.trim());
      setTask((prev) => ({ ...prev, comments: data.data }));
      setCommentText('');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const addLabel = (e) => {
    e.preventDefault();
    if (!labelInput.trim()) return;
    const labels = [...new Set([...(task.labels || []), labelInput.trim()])];
    setTask((prev) => ({ ...prev, labels }));
    setLabelInput('');
    patch({ labels });
  };

  const removeLabel = (label) => {
    const labels = task.labels.filter((l) => l !== label);
    setTask((prev) => ({ ...prev, labels }));
    patch({ labels });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await taskService.uploadAttachment(taskId, file);
      setTask((prev) => ({ ...prev, attachments: [...(prev.attachments || []), data.data] }));
      toast.success('File uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      e.target.value = '';
    }
  };

  const deleteAttachment = async (attachmentId) => {
    setTask((prev) => ({ ...prev, attachments: prev.attachments.filter((a) => a._id !== attachmentId) }));
    try {
      await taskService.deleteAttachment(taskId, attachmentId);
    } catch (err) {
      toast.error('Failed to delete attachment');
    }
  };

  const handleDelete = async () => {
    try {
      await taskService.remove(taskId);
      toast.success('Task deleted');
      onDeleted?.(taskId);
      onClose();
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setConfirmDelete(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} size="xl" title={loading ? 'Loading...' : `${task?.taskId}`}>
      {loading || !task ? (
        <div className="py-16 text-center text-gray-400 text-sm">Loading task...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-5">
            <input
              className="text-lg font-semibold w-full bg-transparent outline-none border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 pb-1"
              value={task.title}
              onChange={(e) => setTask((prev) => ({ ...prev, title: e.target.value }))}
              onBlur={() => patch({ title: task.title })}
            />

            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                rows={4}
                value={task.description || ''}
                placeholder="Add a description..."
                onChange={(e) => setTask((prev) => ({ ...prev, description: e.target.value }))}
                onBlur={() => patch({ description: task.description })}
              />
            </div>

            <div>
              <label className="label">Labels</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(task.labels || []).map((l) => (
                  <span key={l} className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 gap-1">
                    {l}
                    <button onClick={() => removeLabel(l)}><X size={10} /></button>
                  </span>
                ))}
              </div>
              <form onSubmit={addLabel} className="flex gap-2">
                <input className="input text-sm" placeholder="Add label..." value={labelInput} onChange={(e) => setLabelInput(e.target.value)} />
                <button className="btn-secondary shrink-0 px-3" type="submit"><Plus size={14} /></button>
              </form>
            </div>

            <SubTaskList taskId={taskId} subtasks={task.subtasks || []} setSubtasks={(fn) => setTask((prev) => ({ ...prev, subtasks: typeof fn === 'function' ? fn(prev.subtasks || []) : fn }))} />

            <div>
              <label className="label flex items-center justify-between">
                Attachments
                <button className="text-brand-600 text-xs font-medium flex items-center gap-1" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip size={12} /> Upload
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              </label>
              {task.attachments?.length === 0 ? (
                <p className="text-xs text-gray-400">No attachments yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {task.attachments.map((a) => (
                    <div key={a._id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                      <span className="truncate flex items-center gap-2"><Paperclip size={13} className="text-gray-400 shrink-0" />{a.originalName}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <a href={`${getApiBaseUrl()}${a.path}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-600 p-1"><Download size={14} /></a>
                        <button onClick={() => deleteAttachment(a._id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="label">Comments</label>
              <div className="space-y-3 mb-3 max-h-56 overflow-y-auto">
                {task.comments?.map((c) => (
                  <div key={c._id} className="flex items-start gap-2.5">
                    <Avatar name={c.author?.name} color={c.author?.avatarColor} size="xs" />
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium">{c.author?.name}</span>
                        <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{c.text}</p>
                    </div>
                  </div>
                ))}
                {(!task.comments || task.comments.length === 0) && <p className="text-xs text-gray-400">No comments yet.</p>}
              </div>
              <form onSubmit={addComment} className="flex gap-2 items-start">
                <Avatar name={user?.name} color={user?.avatarColor} size="xs" />
                <input className="input text-sm flex-1" placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                <button type="submit" className="btn-secondary shrink-0 px-3"><Send size={14} /></button>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Status</label>
              <select className="input" value={task.status} onChange={(e) => { setTask((p) => ({ ...p, status: e.target.value })); patch({ status: e.target.value }); }}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={task.priority} onChange={(e) => { setTask((p) => ({ ...p, priority: e.target.value })); patch({ priority: e.target.value }); }}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Assignee</label>
              <select
                className="input"
                value={task.assignee?._id || ''}
                onChange={(e) => { const val = e.target.value || null; setTask((p) => ({ ...p, assignee: projectMembers.find((m) => m._id === val) || null })); patch({ assignee: val }); }}
              >
                <option value="">Unassigned</option>
                {projectMembers.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Reporter</label>
              <div className="flex items-center gap-2 text-sm">
                <Avatar name={task.reporter?.name} color={task.reporter?.avatarColor} size="xs" />
                {task.reporter?.name}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Start date</label>
                <input type="date" className="input text-sm" value={task.startDate ? task.startDate.slice(0, 10) : ''} onChange={(e) => { setTask((p) => ({ ...p, startDate: e.target.value })); patch({ startDate: e.target.value }); }} />
              </div>
              <div>
                <label className="label">Due date</label>
                <input type="date" className="input text-sm" value={task.dueDate ? task.dueDate.slice(0, 10) : ''} onChange={(e) => { setTask((p) => ({ ...p, dueDate: e.target.value })); patch({ dueDate: e.target.value }); }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Est. hours</label>
                <input type="number" min={0} className="input text-sm" value={task.estimatedHours || 0} onChange={(e) => setTask((p) => ({ ...p, estimatedHours: e.target.value }))} onBlur={() => patch({ estimatedHours: task.estimatedHours })} />
              </div>
              <div>
                <label className="label">Actual hours</label>
                <input type="number" min={0} className="input text-sm" value={task.actualHours || 0} onChange={(e) => setTask((p) => ({ ...p, actualHours: e.target.value }))} onBlur={() => patch({ actualHours: task.actualHours })} />
              </div>
            </div>
            <div>
              <label className="label">Story points</label>
              <input type="number" min={0} className="input text-sm" value={task.storyPoints || 1} onChange={(e) => setTask((p) => ({ ...p, storyPoints: e.target.value }))} onBlur={() => patch({ storyPoints: task.storyPoints })} />
            </div>

            <button onClick={() => setConfirmDelete(true)} className="btn-danger w-full mt-4">
              <Trash2 size={14} /> Delete task
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete task?"
        description="This will permanently delete this task and its subtasks."
        confirmLabel="Delete task"
      />
    </Modal>
  );
}
