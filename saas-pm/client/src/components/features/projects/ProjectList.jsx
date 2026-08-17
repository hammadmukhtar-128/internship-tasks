import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ListChecks, MoreVertical, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge, PriorityBadge } from '../../common/Badges';
import Avatar from '../../common/Avatar';

export function ProjectCard({ project, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="card p-5 hover:shadow-popover transition-shadow relative group animate-fadeIn">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: project.color }} />
          <div className="min-w-0">
            <Link to={`/projects/${project._id}`} className="font-semibold hover:text-brand-600 truncate block">{project.name}</Link>
            <p className="text-xs text-gray-400">{project.key}</p>
          </div>
        </div>
        <div className="relative shrink-0">
          <button onClick={() => setMenuOpen((o) => !o)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 card p-1 shadow-popover z-20 animate-slideUp">
              <button onClick={() => { setMenuOpen(false); onEdit(project); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => { setMenuOpen(false); onDelete(project); }} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 min-h-[2.5rem]">{project.description || 'No description provided.'}</p>

      <div className="flex items-center gap-2 mb-4">
        <StatusBadge status={project.status} />
        <PriorityBadge priority={project.priority} />
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.color }} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {(project.members || []).slice(0, 4).map((m) => (
            <Avatar key={m._id} name={m.name} color={m.avatarColor} size="xs" />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><ListChecks size={13} /> {project.taskCount || 0}</span>
          {project.dueDate && (
            <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(project.dueDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectListRow({ project, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <td className="px-4 py-3">
        <Link to={`/projects/${project._id}`} className="flex items-center gap-2 font-medium hover:text-brand-600">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: project.color }} />
          {project.name}
          <span className="text-xs text-gray-400 font-normal">{project.key}</span>
        </Link>
      </td>
      <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
      <td className="px-4 py-3"><PriorityBadge priority={project.priority} /></td>
      <td className="px-4 py-3 text-sm text-gray-500 w-40">
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-1">
          <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.color }} />
        </div>
        {project.progress}%
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{project.taskCount || 0}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '—'}</td>
      <td className="px-4 py-3 text-right">
        <button onClick={() => onEdit(project)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 mr-1">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(project)} className="text-gray-400 hover:text-red-600 p-1">
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
