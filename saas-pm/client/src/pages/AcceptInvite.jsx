import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Layers } from 'lucide-react';
import { inviteService } from '../services';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/States';

export default function AcceptInvite() {
  const { token } = useParams();
  const { isAuthenticated, refresh, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); // pending | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return; // wait for login redirect below
    const accept = async () => {
      try {
        await inviteService.accept(token);
        await refresh();
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to accept invite');
      }
    };
    accept();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  if (authLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-6 max-w-sm text-center">
          <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
            <Layers size={22} className="text-white" />
          </div>
          <h1 className="font-bold text-lg mb-1">You've been invited!</h1>
          <p className="text-sm text-gray-500 mb-5">Sign in or create an account to accept this invitation.</p>
          <div className="flex gap-2">
            <Link to="/login" state={{ from: { pathname: `/accept-invite/${token}` } }} className="btn-primary flex-1">Sign in</Link>
            <Link to="/register" className="btn-secondary flex-1">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-6 max-w-sm text-center">
        {status === 'pending' && <PageLoader label="Accepting invitation..." />}
        {status === 'success' && (
          <>
            <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
            <h1 className="font-bold text-lg mb-1">You're in!</h1>
            <p className="text-sm text-gray-500 mb-5">You've joined the workspace successfully.</p>
            <button className="btn-primary w-full" onClick={() => navigate('/dashboard')}>Go to dashboard</button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={40} className="text-red-500 mx-auto mb-3" />
            <h1 className="font-bold text-lg mb-1">Couldn't accept invite</h1>
            <p className="text-sm text-gray-500 mb-5">{message}</p>
            <button className="btn-secondary w-full" onClick={() => navigate('/dashboard')}>Go to dashboard</button>
          </>
        )}
      </div>
    </div>
  );
}
