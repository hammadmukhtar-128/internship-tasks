import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/users';
import { authApi } from '../api/auth';
import Avatar from '../components/common/Avatar';

export default function ProfilePage() {
  const { user, updateUserLocal } = useAuth();
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await usersApi.updateMe({ name, title });
      updateUserLocal(data.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      const { data } = await authApi.updatePassword(currentPassword, newPassword);
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Profile settings</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your personal information and security.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="glass-card space-y-4 p-6">
          <div className="flex items-center gap-4">
            <Avatar user={user} size="lg" showStatus={false} />
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">{user.name}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
          <div>
            <label className="label-text">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" maxLength={60} />
          </div>
          <div>
            <label className="label-text">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Product Designer"
              className="input-field"
              maxLength={80}
            />
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary">
            {savingProfile ? <Loader2 size={16} className="animate-spin" /> : 'Save changes'}
          </button>
        </form>

        <form onSubmit={savePassword} className="glass-card space-y-4 p-6">
          <h3 className="font-display font-semibold text-slate-800 dark:text-white">Change password</h3>
          <div>
            <label className="label-text">Current password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">New password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="input-field"
            />
          </div>
          <button type="submit" disabled={savingPassword} className="btn-primary">
            {savingPassword ? <Loader2 size={16} className="animate-spin" /> : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
