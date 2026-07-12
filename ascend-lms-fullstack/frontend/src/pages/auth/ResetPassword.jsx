import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 font-display text-base font-bold text-white">A</div>
          <span className="font-display text-xl font-semibold text-ink">Ascend LMS</span>
        </div>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-semibold text-ink">Reset your password</h1>
          <p className="mt-1 text-sm text-ink/50">Choose a new password for your account.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">New password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
                <input type="password" className="input pl-10" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
                <input type="password" className="input pl-10" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Resetting...' : 'Reset password'} <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/50">
            Remembered it? <Link to="/login" className="font-semibold text-primary-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
