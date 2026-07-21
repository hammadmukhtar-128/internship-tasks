import { useEffect, useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import { adminApi } from '../../api/admin';

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getTeams({ limit: 50 })
      .then(({ data }) => setTeams(data.data.teams))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-brand-500" size={24} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((t) => (
        <div key={t._id} className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient font-display font-bold text-white">
              {t.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800 dark:text-white">{t.name}</p>
              <p className="truncate text-xs text-slate-400">Owner: {t.owner?.name}</p>
            </div>
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
            {t.description || 'No description provided.'}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Users size={13} /> {t.members?.length || 0} members
          </div>
        </div>
      ))}
    </div>
  );
}
