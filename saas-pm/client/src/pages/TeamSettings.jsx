import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Copy, X, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orgService, inviteService } from '../services';
import { PageLoader, EmptyState } from '../components/common/States';
import { Modal, ConfirmDialog } from '../components/common/Modal';
import Avatar from '../components/common/Avatar';
import { StatusBadge } from '../components/common/Badges';

const ROLES = ['Admin', 'Member', 'Viewer'];

export default function TeamSettings() {
  const { organization, user, refresh } = useAuth();
  const [org, setOrg] = useState(null);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'Member' });
  const [inviting, setInviting] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState('');
  const [removeTarget, setRemoveTarget] = useState(null);

  const myRole = org?.members?.find((m) => m.user._id === user?.id)?.role;
  const canManage = myRole === 'Owner' || myRole === 'Admin';

  const load = async () => {
    if (!organization) return;
    setLoading(true);
    try {
      const [orgRes, inviteRes] = await Promise.all([orgService.get(organization._id), inviteService.list(organization._id)]);
      setOrg(orgRes.data.data);
      setInvites(inviteRes.data.data);
    } catch (err) {
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  const sendInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.email.trim()) return;
    setInviting(true);
    try {
      const { data } = await inviteService.create({ ...inviteForm, organization: organization._id });
      setInvites((prev) => [data.data, ...prev]);
      setLastInviteLink(data.inviteLink);
      toast.success('Invitation created');
      setInviteForm({ email: '', role: 'Member' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  const changeRole = async (userId, role) => {
    try {
      const { data } = await orgService.updateMemberRole(organization._id, userId, role);
      setOrg(data.data.members ? { ...org, members: data.data.members } : org);
      toast.success('Role updated');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const removeMember = async () => {
    try {
      await orgService.removeMember(organization._id, removeTarget._id);
      setOrg((prev) => ({ ...prev, members: prev.members.filter((m) => m.user._id !== removeTarget._id) }));
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    } finally {
      setRemoveTarget(null);
    }
  };

  const cancelInvite = async (invite) => {
    try {
      await inviteService.cancel(invite._id);
      setInvites((prev) => prev.filter((i) => i._id !== invite._id));
      toast.success('Invite cancelled');
    } catch (err) {
      toast.error('Failed to cancel invite');
    }
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success('Invite link copied');
  };

  if (loading || !org) return <PageLoader label="Loading team..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Team Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage members and invitations for {org.name}.</p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={() => setInviteOpen(true)}>
            <Plus size={16} /> Invite Member
          </button>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-400 uppercase">
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {org.members.map((m) => (
              <tr key={m.user._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={m.user.name} color={m.user.avatarColor} size="sm" />
                    <span className="font-medium text-sm">{m.user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{m.user.email}</td>
                <td className="px-4 py-3">
                  {canManage && m.role !== 'Owner' ? (
                    <select className="input py-1 text-sm w-32" value={m.role} onChange={(e) => changeRole(m.user._id, e.target.value)}>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : (
                    <StatusBadge status={m.role} className={m.role === 'Owner' ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : ''} />
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(m.joinedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  {canManage && m.role !== 'Owner' && (
                    <button onClick={() => setRemoveTarget(m.user)} className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Pending Invitations</h2>
        {invites.filter((i) => i.status === 'Pending').length === 0 ? (
          <EmptyState icon={Users} title="No pending invites" description="Invitations you send will appear here until accepted." />
        ) : (
          <div className="card divide-y divide-gray-100 dark:divide-gray-800">
            {invites.filter((i) => i.status === 'Pending').map((inv) => (
              <div key={inv._id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{inv.email}</p>
                  <p className="text-xs text-gray-400">Invited as {inv.role} by {inv.invitedBy?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={inv.status} />
                  {canManage && (
                    <button onClick={() => cancelInvite(inv)} className="text-gray-400 hover:text-red-600 p-1">
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={inviteOpen} onClose={() => { setInviteOpen(false); setLastInviteLink(''); }} title="Invite team member">
        <form onSubmit={sendInvite} className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input required type="email" className="input" placeholder="teammate@company.com" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" disabled={inviting} className="btn-primary w-full">{inviting ? 'Sending...' : 'Send invite'}</button>

          {lastInviteLink && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-2">No email provider configured — share this link directly:</p>
              <div className="flex items-center gap-2">
                <input readOnly className="input text-xs" value={lastInviteLink} />
                <button type="button" onClick={() => copyLink(lastInviteLink)} className="btn-secondary shrink-0 px-3"><Copy size={14} /></button>
              </div>
            </div>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={removeMember}
        title="Remove member?"
        description={`${removeTarget?.name} will lose access to this workspace.`}
        confirmLabel="Remove member"
      />
    </div>
  );
}
