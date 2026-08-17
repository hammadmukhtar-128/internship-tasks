import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { taskService, projectService } from '../services';
import { PageLoader, ErrorState } from '../components/common/States';
import TaskModal from '../components/features/tasks/TaskModal';

// This page exists for direct/shareable links to a single task
// (e.g. from search results, notifications, or a URL bar). It loads
// the task's project members, then reuses the same TaskModal used
// on the Kanban board so editing behaves identically everywhere.
export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data: taskRes } = await taskService.get(id);
        const projectId = taskRes.data.project?._id || taskRes.data.project;
        const { data: projRes } = await projectService.get(projectId);
        setMembers(projRes.data.members || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <PageLoader label="Loading task..." />;
  if (error) return <ErrorState message="Task not found." onRetry={() => navigate(-1)} />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back
      </button>
      <TaskModal taskId={id} open={true} onClose={() => navigate(-1)} projectMembers={members} />
    </div>
  );
}
