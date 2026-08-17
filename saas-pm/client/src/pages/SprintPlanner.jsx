import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { projectService, sprintService, taskService } from '../services';
import { PageLoader, EmptyState } from '../components/common/States';
import SprintPlanner from '../components/features/sprints/SprintPlanner';
import SprintFormModal from '../components/features/sprints/SprintFormModal';
import BurndownChart from '../components/features/sprints/BurndownChart';
import TaskModal from '../components/features/tasks/TaskModal';
import { Rocket } from 'lucide-react';

export default function SprintPlannerPage() {
  const { organization } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(searchParams.get('project') || '');
  const [project, setProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeSprintId, setActiveSprintId] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [showBurndown, setShowBurndown] = useState(false);

  useEffect(() => {
    if (!organization) return;
    projectService.list(organization._id).then(({ data }) => {
      setProjects(data.data);
      if (!projectId && data.data.length) setProjectId(data.data[0]._id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  const loadProjectData = async (pid) => {
    if (!pid) return;
    setLoading(true);
    try {
      const [projRes, sprintRes, taskRes] = await Promise.all([
        projectService.get(pid),
        sprintService.list(pid),
        taskService.list({ project: pid }),
      ]);
      setProject(projRes.data.data);
      setSprints(sprintRes.data.data);
      setTasks(taskRes.data.data);
      const active = sprintRes.data.data.find((s) => s.status === 'Active') || sprintRes.data.data[0];
      setActiveSprintId(active?._id || '');
    } catch (err) {
      toast.error('Failed to load sprint data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      setSearchParams({ project: projectId });
      loadProjectData(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const activeSprint = sprints.find((s) => s._id === activeSprintId);
  const backlogTasks = useMemo(() => tasks.filter((t) => !t.sprint), [tasks]);
  const sprintTasks = useMemo(() => tasks.filter((t) => t.sprint === activeSprintId), [tasks, activeSprintId]);

  const handleAddToSprint = async (taskId) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, sprint: activeSprintId } : t)));
    try {
      await sprintService.addTask(activeSprintId, taskId);
    } catch (err) {
      toast.error('Failed to add task to sprint');
    }
  };

  const handleRemoveFromSprint = async (taskId) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, sprint: null } : t)));
    try {
      await sprintService.removeTask(activeSprintId, taskId);
    } catch (err) {
      toast.error('Failed to remove task from sprint');
    }
  };

  const handleStart = async (sprint) => {
    try {
      const { data } = await sprintService.update(sprint._id, { status: 'Active' });
      setSprints((prev) => prev.map((s) => (s._id === sprint._id ? data.data : s)));
      toast.success('Sprint started');
    } catch (err) {
      toast.error('Failed to start sprint');
    }
  };

  const handleComplete = async (sprint) => {
    try {
      const { data } = await sprintService.update(sprint._id, { status: 'Completed' });
      setSprints((prev) => prev.map((s) => (s._id === sprint._id ? data.data : s)));
      toast.success('Sprint completed');
    } catch (err) {
      toast.error('Failed to complete sprint');
    }
  };

  const handleDelete = async (sprint) => {
    try {
      await sprintService.remove(sprint._id);
      setSprints((prev) => prev.filter((s) => s._id !== sprint._id));
      setTasks((prev) => prev.map((t) => (t.sprint === sprint._id ? { ...t, sprint: null } : t)));
      setActiveSprintId('');
      toast.success('Sprint deleted');
    } catch (err) {
      toast.error('Failed to delete sprint');
    }
  };

  const handleTaskUpdated = (updated) => {
    setTasks((cur) => cur.map((t) => (t._id === updated._id ? { ...t, ...updated } : t)));
  };

  if (!organization) return null;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Sprint Planner</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Plan sprints and track velocity with real burndown data.</p>
        </div>
        <div className="flex gap-2">
          <select className="input sm:w-56" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <button className="btn-primary" onClick={() => setFormOpen(true)} disabled={!projectId}>
            <Plus size={16} /> New Sprint
          </button>
        </div>
      </div>

      {loading ? (
        <PageLoader label="Loading sprints..." />
      ) : sprints.length === 0 ? (
        <EmptyState
          icon={Rocket}
          title="No sprints yet"
          description="Create a sprint to start planning work for this project."
          action={<button className="btn-primary" onClick={() => setFormOpen(true)}><Plus size={16} /> Create Sprint</button>}
        />
      ) : (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            {sprints.map((s) => (
              <button
                key={s._id}
                onClick={() => setActiveSprintId(s._id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  activeSprintId === s._id
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {s.name} <span className="opacity-70">({s.status})</span>
              </button>
            ))}
            {activeSprintId && (
              <button onClick={() => setShowBurndown((v) => !v)} className="btn-secondary ml-auto">
                <BarChart3 size={15} /> {showBurndown ? 'Hide burndown' : 'Show burndown'}
              </button>
            )}
          </div>

          {showBurndown && activeSprintId && (
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Burndown chart — {activeSprint?.name}</h3>
              <BurndownChart sprintId={activeSprintId} />
            </div>
          )}

          <SprintPlanner
            sprint={activeSprint}
            backlogTasks={backlogTasks}
            sprintTasks={sprintTasks}
            onAddToSprint={handleAddToSprint}
            onRemoveFromSprint={handleRemoveFromSprint}
            onStart={handleStart}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onTaskClick={(t) => setActiveTaskId(t._id)}
          />
        </>
      )}

      <SprintFormModal open={formOpen} onClose={() => setFormOpen(false)} projectId={projectId} onCreated={(s) => setSprints((prev) => [s, ...prev])} />
      <TaskModal taskId={activeTaskId} open={!!activeTaskId} onClose={() => setActiveTaskId(null)} projectMembers={project?.members || []} onUpdated={handleTaskUpdated} onDeleted={(id) => setTasks((prev) => prev.filter((t) => t._id !== id))} />
    </div>
  );
}
