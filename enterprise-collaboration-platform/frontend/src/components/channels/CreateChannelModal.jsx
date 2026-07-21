import { useState } from 'react';
import toast from 'react-hot-toast';
import { Hash, Lock } from 'lucide-react';
import Modal from '../common/Modal';
import { channelsApi } from '../../api/channels';

export default function CreateChannelModal({ isOpen, onClose, teamId, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('public');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const { data } = await channelsApi.createChannel({ name, description, type, team: teamId });
      toast.success(`#${data.data.channel.name} created`);
      onCreated(data.data.channel);
      setName('');
      setDescription('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create channel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a channel">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-text">Channel name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="e.g. product-launch"
            className="input-field"
            maxLength={60}
          />
        </div>
        <div>
          <label className="label-text">Description (optional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this channel for?"
            className="input-field"
            maxLength={300}
          />
        </div>
        <div>
          <label className="label-text">Visibility</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('public')}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                type === 'public'
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <Hash size={15} /> Public
            </button>
            <button
              type="button"
              onClick={() => setType('private')}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                type === 'private'
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <Lock size={15} /> Private
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading || !name.trim()} className="btn-primary">
            {loading ? 'Creating...' : 'Create channel'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
