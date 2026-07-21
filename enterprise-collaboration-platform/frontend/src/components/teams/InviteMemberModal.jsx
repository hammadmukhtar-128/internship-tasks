import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { teamsApi } from '../../api/teams';

export default function InviteMemberModal({ isOpen, onClose, teamId, onInvited }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await teamsApi.inviteMember(teamId, { email, role });
      toast.success(`Invitation sent to ${email}`);
      setEmail('');
      onInvited?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite a member">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-text">Email address</label>
          <input
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
            <option value="member">Member</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading || !email.trim()} className="btn-primary">
            {loading ? 'Sending...' : 'Send invite'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
