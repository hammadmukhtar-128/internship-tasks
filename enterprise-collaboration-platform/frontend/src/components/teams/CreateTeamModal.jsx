import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { teamsApi } from '../../api/teams';

export default function CreateTeamModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { data } = await teamsApi.createTeam({ name, description });
      toast.success('Team created!');
      onCreated(data.data.team);
      setName('');
      setDescription('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new team">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-text">Team name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Product Engineering"
            className="input-field"
            maxLength={80}
          />
        </div>
        <div>
          <label className="label-text">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this team about?"
            className="input-field resize-none"
            rows={3}
            maxLength={300}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading || !name.trim()} className="btn-primary">
            {loading ? 'Creating...' : 'Create team'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
