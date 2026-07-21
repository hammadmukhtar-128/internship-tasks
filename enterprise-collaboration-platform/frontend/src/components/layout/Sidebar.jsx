import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  Hash,
  Lock,
  Plus,
  LayoutDashboard,
  Users,
  ShieldCheck,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { teamsApi } from '../../api/teams';
import { channelsApi } from '../../api/channels';
import { useAuth } from '../../context/AuthContext';
import CreateTeamModal from '../teams/CreateTeamModal';
import CreateChannelModal from '../channels/CreateChannelModal';

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teamId, channelId } = useParams();

  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [channels, setChannels] = useState([]);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const loadTeams = async () => {
    const { data } = await teamsApi.getMyTeams();
    setTeams(data.data.teams);
    if (!teamId && data.data.teams.length > 0) {
      navigate(`/teams/${data.data.teams[0]._id}`, { replace: true });
    }
  };

  useEffect(() => {
    loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const current = teams.find((t) => t._id === teamId);
    setActiveTeam(current || null);
  }, [teamId, teams]);

  const loadChannels = async () => {
    if (!teamId) return;
    const { data } = await channelsApi.getTeamChannels(teamId);
    setChannels(data.data.channels);
  };

  useEffect(() => {
    loadChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200/70 bg-white/60 backdrop-blur-xl dark:border-white/5 dark:bg-panel-dark/50">
      {/* Team switcher */}
      <div className="relative border-b border-slate-200/70 p-3 dark:border-white/5">
        <button
          onClick={() => setTeamMenuOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient font-display text-sm font-bold text-white">
              {activeTeam?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="truncate font-display text-sm font-semibold text-slate-800 dark:text-white">
              {activeTeam?.name || 'Select a team'}
            </span>
          </div>
          <ChevronDown size={16} className="shrink-0 text-slate-400" />
        </button>

        {teamMenuOpen && (
          <div className="absolute left-3 right-3 top-full z-30 mt-1 glass-card animate-slide-up p-1.5">
            {teams.map((t) => (
              <button
                key={t._id}
                onClick={() => {
                  navigate(`/teams/${t._id}`);
                  setTeamMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800/70 ${
                  t._id === teamId ? 'bg-brand-50 dark:bg-brand-900/20' : ''
                }`}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-gradient text-xs font-bold text-white">
                  {t.name[0].toUpperCase()}
                </div>
                <span className="truncate text-slate-700 dark:text-slate-200">{t.name}</span>
              </button>
            ))}
            <button
              onClick={() => {
                setShowCreateTeam(true);
                setTeamMenuOpen(false);
              }}
              className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/20"
            >
              <Plus size={15} /> Create team
            </button>
          </div>
        )}
      </div>

      {/* Global nav */}
      <nav className="space-y-0.5 px-3 pt-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-brand-gradient-soft text-brand-700 dark:text-brand-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
            }`
          }
        >
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-gradient-soft text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`
            }
          >
            <ShieldCheck size={16} /> Admin panel
          </NavLink>
        )}
        {activeTeam && (
          <NavLink
            to={`/teams/${teamId}/settings`}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-gradient-soft text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`
            }
          >
            <Users size={16} /> Team members
          </NavLink>
        )}
      </nav>

      {/* Channels */}
      {activeTeam && (
        <div className="mt-4 flex-1 overflow-y-auto px-3 pb-3">
          <div className="mb-1.5 flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Channels</span>
            <button
              onClick={() => setShowCreateChannel(true)}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-0.5">
            {channels.map((c) => (
              <button
                key={c._id}
                onClick={() => navigate(`/teams/${teamId}/channels/${c._id}`)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition ${
                  channelId === c._id
                    ? 'bg-brand-gradient-soft font-medium text-brand-700 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                {c.type === 'private' ? <Lock size={13} /> : <Hash size={13} />}
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showCreateTeam && (
        <CreateTeamModal
          isOpen={showCreateTeam}
          onClose={() => setShowCreateTeam(false)}
          onCreated={(team) => {
            setShowCreateTeam(false);
            loadTeams();
            navigate(`/teams/${team._id}`);
          }}
        />
      )}
      {showCreateChannel && (
        <CreateChannelModal
          isOpen={showCreateChannel}
          teamId={teamId}
          onClose={() => setShowCreateChannel(false)}
          onCreated={(channel) => {
            setShowCreateChannel(false);
            loadChannels();
            navigate(`/teams/${teamId}/channels/${channel._id}`);
          }}
        />
      )}
    </aside>
  );
}
