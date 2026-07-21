import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { teamsApi } from '../api/teams';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';

export default function InviteAcceptPage() {
  const { token } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState('pending'); // pending | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) return; // wait for login redirect below to render

    const accept = async () => {
      try {
        const { data } = await teamsApi.acceptInvitation(token);
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => navigate(`/teams/${data.data.team._id}`), 1500);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'This invitation could not be accepted.');
      }
    };
    accept();
  }, [token, user, authLoading, navigate]);

  if (!authLoading && !user) {
    return (
      <AuthLayout title="Log in to accept your invitation" subtitle="You need an account to join this team">
        <Link to="/login" state={{ from: { pathname: `/invite/${token}` } }} className="btn-primary w-full">
          Log in to continue
        </Link>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">
            Create an account
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
      <div className="glass-card flex max-w-sm flex-col items-center gap-3 p-8 text-center">
        {status === 'pending' && <Loader2 className="animate-spin text-brand-500" size={32} />}
        {status === 'success' && <CheckCircle2 className="text-emerald-500" size={32} />}
        {status === 'error' && <XCircle className="text-rose-500" size={32} />}
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {status === 'pending' ? 'Accepting your invitation...' : message}
        </p>
      </div>
    </div>
  );
}
