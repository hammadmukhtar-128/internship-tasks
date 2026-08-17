import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, LayoutGrid, List as ListIcon, FolderKanban } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../services';
import { CardSkeleton, ErrorState, EmptyState } from '../components/common/States';
import { ConfirmDialog } from '../components/common/Modal';
import { ProjectCard, ProjectListRow } from '../components/features/projects/ProjectList';
import ProjectFormModal from '../components/features/projects/ProjectFormModal';

export default function Projects() {
  const { organization } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sort, setSort] = useState('newest');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    if (!organization) return;
    setLoading(true);
    setError(false);
    try {
      const { data } = await projectService.list(organization._id);
      setProjects(data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  const filtered = useMemo(() => {
    let list = [...projects];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.key.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'All') list = list.filter((p) => p.status === statusFilter);
    if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'oldest') list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'dueDate') list.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
    return list;
  }, [projects, search, statusFilter, sort]);

  const handleSaved = (project) => {
    setProjects((prev) => {
      const exists = prev.find((p) => p._id === project._id);
      if (exists) return prev.map((p) => (p._id === project._id ? { ...p, ...project, progress: p.progress, taskCount: p.taskCount } : p));
      return [{ ...project, progress: 0, taskCount: 0 }, ...prev];
    });
  };

  const confirmDelete = async () => {
    try {
      await projectService.remove(deleting._id);
      setProjects((prev) => prev.filter((p) => p._id !== deleting._id));
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and track all your team's projects.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus size={16} /> Create Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="input pl-9" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {['All', 'Planning', 'Active', 'On Hold', 'Completed', 'Archived'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select className="input sm:w-40" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
          <option value="dueDate">Due date</option>
        </select>
        <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shrink-0">
          <button onClick={() => setView('grid')} className={`px-3 flex items-center ${view === 'grid' ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30' : 'text-gray-400'}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setView('list')} className={`px-3 flex items-center ${view === 'list' ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30' : 'text-gray-400'}`}>
            <ListIcon size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message="Couldn't load projects." onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create your first project to get started."
          action={<button className="btn-primary" onClick={() => setFormOpen(true)}><Plus size={16} /> Create Project</button>}
        />
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p._id} project={p} onEdit={(proj) => { setEditing(proj); setFormOpen(true); }} onDelete={setDeleting} />
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-400 uppercase">
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Progress</th>
                <th className="px-4 py-3 font-medium">Tasks</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <ProjectListRow key={p._id} project={p} onEdit={(proj) => { setEditing(proj); setFormOpen(true); }} onDelete={setDeleting} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProjectFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={handleSaved} project={editing} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete project?"
        description={`This will permanently delete "${deleting?.name}" and all of its tasks. This cannot be undone.`}
        confirmLabel="Delete project"
      />
    </div>
  );
}
