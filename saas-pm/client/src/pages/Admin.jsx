import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService, orgService } from '../services';
import Avatar from '../components/common/Avatar';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6', '#14B8A6'];

export default function Admin() {
  const { user, setUser, organization, refresh } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', avatarColor: user?.avatarColor || COLORS[0] });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [orgForm, setOrgForm] = useState({ name: organization?.name || '', description: organization?.description || '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);

  const myRole = organization?.members?.find((m) => (m.user._id || m.user) === user?.id)?.role;
  const canManageOrg = myRole === 'Owner' || myRole === 'Admin';

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await authService.updateProfile(profileForm);
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPw(true);
    try {
      await authService.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPw(false);
    }
  };

  const saveOrg = async (e) => {
    e.preventDefault();
    setSavingOrg(true);
    try {
      await orgService.update(organization._id, orgForm);
      toast.success('Workspace updated');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update workspace');
    } finally {
      setSavingOrg(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your profile and workspace preferences.</p>
      </div>

      <form onSubmit={saveProfile} className="card p-5 space-y-4">
        <h3 className="font-semibold">Profile</h3>
        <div className="flex items-center gap-4">
          <Avatar name={profileForm.name || user?.name} color={profileForm.avatarColor} size="lg" />
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button type="button" key={c} onClick={() => setProfileForm({ ...profileForm, avatarColor: c })} className={`w-6 h-6 rounded-full ${profileForm.avatarColor === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900' : ''}`} style={{ background: c }} />
            ))}
          </div>
        </div>
        <div>
          <label className="label">Full name</label>
          <input className="input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input opacity-60" value={user?.email} disabled />
        </div>
        <button className="btn-primary" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save profile'}</button>
      </form>

      <form onSubmit={changePassword} className="card p-5 space-y-4">
        <h3 className="font-semibold">Change password</h3>
        <div>
          <label className="label">Current password</label>
          <input type="password" required className="input" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">New password</label>
            <input type="password" required className="input" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
          </div>
          <div>
            <label className="label">Confirm new password</label>
            <input type="password" required className="input" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
          </div>
        </div>
        <button className="btn-primary" disabled={savingPw}>{savingPw ? 'Updating...' : 'Update password'}</button>
      </form>

      {canManageOrg && (
        <form onSubmit={saveOrg} className="card p-5 space-y-4">
          <h3 className="font-semibold">Workspace</h3>
          <div>
            <label className="label">Workspace name</label>
            <input className="input" value={orgForm.name} onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={orgForm.description} onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })} />
          </div>
          <button className="btn-primary" disabled={savingOrg}>{savingOrg ? 'Saving...' : 'Save workspace'}</button>
        </form>
      )}
    </div>
  );
}
