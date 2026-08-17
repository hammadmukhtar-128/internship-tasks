import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'To Do', label: 'To Do', dot: 'bg-gray-400' },
  { id: 'In Progress', label: 'In Progress', dot: 'bg-blue-500' },
  { id: 'In Review', label: 'In Review', dot: 'bg-amber-500' },
  { id: 'Done', label: 'Done', dot: 'bg-emerald-500' },
];

function Column({ status, label, dot, tasks, onTaskClick, onAddTask }) {
  const { setNodeRef } = useSortable({ id: `column-${status}`, data: { type: 'column', status } });
  return (
    <div className="flex flex-col min-w-[280px] w-[280px] shrink-0 bg-gray-50 dark:bg-gray-900/40 rounded-xl">
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <h3 className="font-semibold text-sm">{label}</h3>
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-1.5 py-0.5">{tasks.length}</span>
        </div>
        <button onClick={() => onAddTask(status)} className="text-gray-400 hover:text-brand-600 p-1">
          <Plus size={15} />
        </button>
      </div>
      <div ref={setNodeRef} className="flex-1 px-2 pb-2 space-y-2.5 overflow-y-auto min-h-[100px]">
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="text-center text-xs text-gray-300 dark:text-gray-600 py-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default function DragDropBoard({ tasks, onStatusChange, onTaskClick, onAddTask }) {
  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  const findColumnOfTask = (id) => tasks.find((t) => t._id === id)?.status;

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    let overStatus;
    if (typeof over.id === 'string' && over.id.startsWith('column-')) {
      overStatus = over.id.replace('column-', '');
    } else {
      overStatus = findColumnOfTask(over.id);
    }

    const activeStatus = findColumnOfTask(activeId);
    if (overStatus && overStatus !== activeStatus) {
      onStatusChange(activeId, overStatus);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
        {COLUMNS.map((col) => (
          <Column key={col.id} status={col.id} label={col.label} dot={col.dot} tasks={grouped[col.id] || []} onTaskClick={onTaskClick} onAddTask={onAddTask} />
        ))}
      </div>
      <DragOverlay>{activeTask && <TaskCard task={activeTask} onClick={() => {}} />}</DragOverlay>
    </DndContext>
  );
}
