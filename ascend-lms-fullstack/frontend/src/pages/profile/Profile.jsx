import { useState } from 'react';
import { Camera, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const API_ROOT = import.meta.env.VITE_API_URL.replace('/api/v1', '');

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ fullName: user.fullName, phone: user.phone || '', bio: user.bio || '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user.profileImage ? `${API_ROOT}${user.profileImage}` : null);
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('profileImage', image);
      const { data } = await api.put('/auth/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    setPwSaving(true);
    try {
      await api.post('/auth/change-password', pwForm);
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card p-6">
        <h3 className="mb-5 font-semibold text-ink">Profile Information</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="relative cursor-pointer">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-2xl font-semibold uppercase text-primary-700">
                {preview ? <img src={preview} alt="avatar" className="h-full w-full object-cover" /> : user.fullName[0]}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white shadow-soft">
                <Camera size={13} />
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
            <div>
              <p className="font-medium text-ink">{user.fullName}</p>
              <p className="text-sm capitalize text-ink/40">{user.role} · {user.email}</p>
            </div>
          </div>

          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea rows={3} className="input" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="mb-5 flex items-center gap-2 font-semibold text-ink"><Lock size={16} /> Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">Current password</label>
            <input type="password" className="input" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
          </div>
          <div>
            <label className="label">New password</label>
            <input type="password" className="input" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
          </div>
          <button type="submit" disabled={pwSaving} className="btn-secondary w-full sm:w-auto">
            {pwSaving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
