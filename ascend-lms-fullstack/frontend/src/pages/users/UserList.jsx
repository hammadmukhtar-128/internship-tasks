import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, Users as UsersIcon, ShieldCheck, ShieldOff } from 'lucide-react';
import api from '../../services/api';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { Skeleton } from '../../components/Loader';
import toast from 'react-hot-toast';

const roleColors = { admin: 'bg-rose-50 text-rose-700', instructor: 'bg-amber-50 text-amber-700', student: 'bg-primary-50 text-primary-700' };

const emptyForm = { fullName: '', email: '', password: '', role: 'student', phone: '', bio: '' };

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await api.get('/users', { params });
      setUsers(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ fullName: user.fullName, email: user.email, password: '', role: user.role, phone: user.phone || '', bio: user.bio || '' });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, { fullName: form.fullName, role: form.role, phone: form.phone, bio: form.bio });
        toast.success('User updated successfully');
      } else {
        await api.post('/users', form);
        toast.success('User created successfully');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user) => {
    try {
      await api.put(`/users/${user._id}`, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
          <input className="input pl-10" placeholder="Search users..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
        </div>
        <div className="flex gap-2">
          <select className="input !w-auto" value={roleFilter} onChange={(e) => { setPage(1); setRoleFilter(e.target.value); }}>
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>
          <button className="btn-primary shrink-0" onClick={openCreate}>
            <Plus size={16} /> New User
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase text-ink/40">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                  <td className="px-5 py-3 font-medium text-ink">{u.fullName}</td>
                  <td className="px-5 py-3 text-ink/60">{u.email}</td>
                  <td className="px-5 py-3"><span className={`badge capitalize ${roleColors[u.role]}`}>{u.role}</span></td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleActive(u)} className={`badge flex items-center gap-1 ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-black/5 text-ink/50'}`}>
                      {u.isActive ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-ink/40 hover:bg-black/5"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(u._id)} className="rounded-lg p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Edit User' : 'Create User'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} disabled={Boolean(editingUser)} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          {!editingUser && (
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
          )}
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UserList;
