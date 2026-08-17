import React from 'react';
import { Plus, Play, CheckCircle2, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge, PriorityBadge } from '../../common/Badges';
import Avatar from '../../common/Avatar';

export default function SprintPlanner({ sprint, backlogTasks, sprintTasks, onAddToSprint, onRemoveFromSprint, onStart, onComplete, onDelete, onTaskClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Sprint Backlog</h3>
          <span className="text-xs text-gray-400">{backlogTasks.length} tasks</span>
        </div>
        <div className="space-y-2 max-h-[420px] overflow-y-auto">
          {backlogTasks.length === 0 && <p className="text-xs text-gray-400 text-center py-8">No unassigned tasks in the backlog.</p>}
          {backlogTasks.map((t) => (
            <div key={t._id} className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5 group">
              <div className="min-w-0 cursor-pointer" onClick={() => onTaskClick(t)}>
                <p className="text-sm font-medium truncate">{t.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[11px] text-gray-400">{t.taskId}</span>
                  <PriorityBadge priority={t.priority} />
                </div>
              </div>
              {sprint && sprint.status !== 'Completed' && (
                <button onClick={() => onAddToSprint(t._id)} className="btn-secondary py-1 px-2 text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  Add <Plus size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{sprint ? sprint.name : 'Select a sprint'}</h3>
            {sprint && <StatusBadge status={sprint.status} />}
          </div>
          {sprint && (
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="text-gray-400 p-1"><MoreVertical size={15} /></button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-40 card p-1 shadow-popover z-20 animate-slideUp">
                  {sprint.status === 'Planning' && (
                    <button onClick={() => { setMenuOpen(false); onStart(sprint); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Play size={13} /> Start sprint
                    </button>
                  )}
                  {sprint.status === 'Active' && (
                    <button onClick={() => { setMenuOpen(false); onComplete(sprint); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                      <CheckCircle2 size={13} /> Complete sprint
                    </button>
                  )}
                  <button onClick={() => { setMenuOpen(false); onDelete(sprint); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={13} /> Delete sprint
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {sprint?.goal && <p className="text-xs text-gray-400 mb-3 italic">"{sprint.goal}"</p>}
        <div className="space-y-2 max-h-[380px] overflow-y-auto">
          {!sprint && <p className="text-xs text-gray-400 text-center py-8">Create or select a sprint to plan tasks.</p>}
          {sprint && sprintTasks.length === 0 && <p className="text-xs text-gray-400 text-center py-8">No tasks in this sprint yet.</p>}
          {sprintTasks.map((t) => (
            <div key={t._id} className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5 group">
              <div className="min-w-0 cursor-pointer flex items-center gap-2" onClick={() => onTaskClick(t)}>
                <Avatar name={t.assignee?.name} color={t.assignee?.avatarColor} size="xs" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[11px] text-gray-400">{t.taskId}</span>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              </div>
              <button onClick={() => onRemoveFromSprint(t._id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
