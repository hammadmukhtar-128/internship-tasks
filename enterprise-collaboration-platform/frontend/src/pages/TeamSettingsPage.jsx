import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, Trash2, Loader2, Crown, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { teamsApi } from '../api/teams';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import InviteMemberModal from '../components/teams/InviteMemberModal';

export default function TeamSettingsPage() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await teamsApi.getTeam(teamId);
      setTeam(data.data.team);
    } catch (err) {
      toast.error('Could not load team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const isOwner = team?.owner?._id === user._id || user.role === 'admin';

  const removeMember = async (memberId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await teamsApi.removeMember(teamId, memberId);
      toast.success('Member removed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove member');
    }
  };

  const changeRole = async (memberId, role) => {
    try {
      await teamsApi.updateMemberRole(teamId, memberId, role);
      toast.success('Role updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update role');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">{team?.name}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{team?.description || 'Manage team members and settings'}</p>
        </div>
        {isOwner && (
          <button onClick={() => setShowInvite(true)} className="btn-primary">
            <UserPlus size={16} /> Invite member
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b border-slate-200/70 px-5 py-3 dark:border-white/5">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white">
            Members ({team?.members?.length || 0})
          </h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {team?.members?.map((m) => (
            <div key={m.user._id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <Avatar user={m.user} size="md" />
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-white">
                    {m.user.name}
                    {m.role === 'owner' && <Crown size={13} className="text-amber-500" />}
                  </p>
                  <p className="text-xs text-slate-400">{m.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isOwner && m.user._id !== team.owner._id ? (
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.user._id, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <option value="member">Member</option>
                    <option value="owner">Owner</option>
                  </select>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Shield size={11} /> {m.role}
                  </span>
                )}
                {isOwner && m.user._id !== team.owner._id && (
                  <button
                    onClick={() => removeMember(m.user._id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <InviteMemberModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        teamId={teamId}
        onInvited={load}
      />
    </div>
  );
}
