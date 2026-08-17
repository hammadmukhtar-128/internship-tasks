import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskService } from '../../../services';

export default function SubTaskList({ taskId, subtasks, setSubtasks }) {
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const completed = subtasks.filter((s) => s.completed).length;
  const progress = subtasks.length ? Math.round((completed / subtasks.length) * 100) : 0;

  const addSubtask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const { data } = await taskService.addSubtask(taskId, newTitle.trim());
      setSubtasks((prev) => [...prev, data.data]);
      setNewTitle('');
    } catch (err) {
      toast.error('Failed to add subtask');
    } finally {
      setAdding(false);
    }
  };

  const toggle = async (subtask) => {
    const updated = { ...subtask, completed: !subtask.completed };
    setSubtasks((prev) => prev.map((s) => (s._id === subtask._id ? updated : s)));
    try {
      await taskService.updateSubtask(taskId, subtask._id, { completed: updated.completed });
    } catch (err) {
      toast.error('Failed to update subtask');
      setSubtasks((prev) => prev.map((s) => (s._id === subtask._id ? subtask : s)));
    }
  };

  const remove = async (subtask) => {
    setSubtasks((prev) => prev.filter((s) => s._id !== subtask._id));
    try {
      await taskService.deleteSubtask(taskId, subtask._id);
    } catch (err) {
      toast.error('Failed to delete subtask');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">Subtasks</h4>
        {subtasks.length > 0 && <span className="text-xs text-gray-400">{completed} / {subtasks.length} completed</span>}
      </div>
      {subtasks.length > 0 && (
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="space-y-1.5 mb-3">
        {subtasks.map((s) => (
          <div key={s._id} className="flex items-center gap-2 group">
            <button
              onClick={() => toggle(s)}
              className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 ${
                s.completed ? 'bg-brand-600 border-brand-600 text-white' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {s.completed && <Check size={11} />}
            </button>
            <span className={`text-sm flex-1 ${s.completed ? 'line-through text-gray-400' : ''}`}>{s.title}</span>
            <button onClick={() => remove(s)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={addSubtask} className="flex gap-2">
        <input
          className="input text-sm"
          placeholder="Add a subtask..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit" disabled={adding} className="btn-secondary shrink-0 px-3">
          <Plus size={15} />
        </button>
      </form>
    </div>
  );
}
