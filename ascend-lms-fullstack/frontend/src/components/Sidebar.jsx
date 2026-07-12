import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileQuestion,
  Bell,
  Award,
  Users,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const linksByRole = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/users', label: 'Users', icon: Users },
    { to: '/courses', label: 'Courses', icon: BookOpen },
    { to: '/assignments', label: 'Assignments', icon: ClipboardList },
    { to: '/quizzes', label: 'Quizzes', icon: FileQuestion },
    { to: '/certificates', label: 'Certificates', icon: Award },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ],
  instructor: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'My Courses', icon: BookOpen },
    { to: '/assignments', label: 'Assignments', icon: ClipboardList },
    { to: '/quizzes', label: 'Quizzes', icon: FileQuestion },
    { to: '/certificates', label: 'Certificates', icon: Award },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ],
  student: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Browse Courses', icon: BookOpen },
    { to: '/assignments', label: 'Assignments', icon: ClipboardList },
    { to: '/quizzes', label: 'Quizzes', icon: FileQuestion },
    { to: '/certificates', label: 'My Certificates', icon: Award },
    { to: '/notifications', label: 'Notifications', icon: Bell }
  ]
};

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth();
  const links = linksByRole[user?.role] || [];

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-ink text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 font-display text-sm font-bold">A</div>
            <span className="font-display text-lg font-semibold">Ascend LMS</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <NavLink to="/profile" onClick={onClose} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold uppercase">
              {user?.fullName?.[0] || <User size={16} />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.fullName}</p>
              <p className="truncate text-xs capitalize text-white/40">{user?.role}</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
