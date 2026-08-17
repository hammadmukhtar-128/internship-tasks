import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Search, ArrowLeft, Rocket } from 'lucide-react';
import { projectService, taskService, sprintService } from '../services';
import { PageLoader, ErrorState } from '../components/common/States';
import { StatusBadge, PriorityBadge } from '../components/common/Badges';
import DragDropBoard from '../components/features/board/DragDropBoard';
import TaskModal from '../components/features/tasks/TaskModal';
import TaskCreateModal from '../components/features/tasks/TaskCreateModal';

export default function Board() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState('To Do');

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [projRes, taskRes, sprintRes] = await Promise.all([
        projectService.get(id),
        taskService.list({ project: id }),
        sprintService.list(id),
      ]);
      setProject(projRes.data.data);
      setTasks(taskRes.data.data);
      setSprints(sprintRes.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (search) list = list.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.taskId.toLowerCase().includes(search.toLowerCase()));
    if (assigneeFilter !== 'All') list = list.filter((t) => (assigneeFilter === 'unassigned' ? !t.assignee : t.assignee?._id === assigneeFilter));
    if (priorityFilter !== 'All') list = list.filter((t) => t.priority === priorityFilter);
    return list;
  }, [tasks, search, assigneeFilter, priorityFilter]);

  const handleStatusChange = async (taskId, newStatus) => {
    const prev = tasks;
    setTasks((cur) => cur.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await taskService.updateStatus(taskId, newStatus);
    } catch (err) {
      toast.error('Failed to move task');
      setTasks(prev);
    }
  };

  const handleTaskUpdated = (updated) => {
    setTasks((cur) => cur.map((t) => (t._id === updated._id ? { ...t, ...updated } : t)));
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((cur) => cur.filter((t) => t._id !== taskId));
  };

  const handleTaskCreated = (task) => {
    setTasks((cur) => [task, ...cur]);
  };

  if (loading) return <PageLoader label="Loading board..." />;
  if (error || !project) return <ErrorState message="Couldn't load this project." onRetry={load} />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <Link to="/projects" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2">
          <ArrowLeft size={14} /> Back to projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full" style={{ background: project.color }} />
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <div className="flex gap-2">
            <Link to={`/sprints?project=${id}`} className="btn-secondary"><Rocket size={15} /> Sprints</Link>
            <button className="btn-primary" onClick={() => { setCreateStatus('To Do'); setCreateOpen(true); }}>
              <Plus size={16} /> Create Task
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="input pl-9" placeholder="Search tasks by title or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-48" value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)}>
          <option value="All">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {(project.members || []).map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <select className="input sm:w-40" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All priorities</option>
          {['Low', 'Medium', 'High', 'Urgent'].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <DragDropBoard
        tasks={filtered}
        onStatusChange={handleStatusChange}
        onTaskClick={(t) => setActiveTaskId(t._id)}
        onAddTask={(status) => { setCreateStatus(status); setCreateOpen(true); }}
      />

      <TaskModal
        taskId={activeTaskId}
        open={!!activeTaskId}
        onClose={() => setActiveTaskId(null)}
        projectMembers={project.members || []}
        onUpdated={handleTaskUpdated}
        onDeleted={handleTaskDeleted}
      />
      <TaskCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        projectId={id}
        defaultStatus={createStatus}
        projectMembers={project.members || []}
        sprints={sprints}
        onCreated={handleTaskCreated}
      />
    </div>
  );
}
