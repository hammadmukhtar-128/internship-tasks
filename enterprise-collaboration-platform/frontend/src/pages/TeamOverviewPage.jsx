import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hash, Loader2 } from 'lucide-react';
import { channelsApi } from '../api/channels';
import EmptyState from '../components/common/EmptyState';

export default function TeamOverviewPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    channelsApi.getTeamChannels(teamId).then(({ data }) => {
      if (!active) return;
      const channels = data.data.channels;
      if (channels.length > 0) {
        navigate(`/teams/${teamId}/channels/${channels[0]._id}`, { replace: true });
      } else {
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [teamId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    );
  }

  return (
    <EmptyState
      icon={Hash}
      title="No channels yet"
      description="Create your first channel from the sidebar to start chatting."
    />
  );
}
