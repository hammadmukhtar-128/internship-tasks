import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, ListChecks, MessageSquare, Paperclip } from 'lucide-react';
import { PriorityBadge, LabelBadge } from '../../common/Badges';
import Avatar from '../../common/Avatar';

export default function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3.5 shadow-card hover:shadow-popover cursor-pointer transition-shadow touch-none"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-gray-400">{task.taskId}</span>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2.5 line-clamp-2">{task.title}</p>

      {task.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {task.labels.slice(0, 3).map((l) => (
            <LabelBadge key={l} label={l} />
          ))}
        </div>
      )}

      {task.subtaskProgress?.total > 0 && (
        <div className="mb-2.5">
          <div className="flex justify-between text-[11px] text-gray-400 mb-1">
            <span>Subtasks</span>
            <span>{task.subtaskProgress.completed}/{task.subtaskProgress.total}</span>
          </div>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full"
              style={{ width: `${(task.subtaskProgress.completed / task.subtaskProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2.5 text-gray-400">
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-[11px] ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
              <Calendar size={11} /> {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-1 text-[11px]"><MessageSquare size={11} /> {task.comments.length}</span>
          )}
          {task.attachments?.length > 0 && (
            <span className="flex items-center gap-1 text-[11px]"><Paperclip size={11} /> {task.attachments.length}</span>
          )}
        </div>
        <Avatar name={task.assignee?.name} color={task.assignee?.avatarColor} size="xs" />
      </div>
    </div>
  );
}
