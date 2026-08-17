import React, { useState } from 'react';
import { Menu, Sun, Moon, ChevronDown, LogOut, User as UserIcon, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/common/Avatar';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ onMenuClick, title }) {
  const { user, organization, organizations, switchOrganization, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button className="lg:hidden text-gray-500" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        {title ? (
          <h1 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate">{title}</h1>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOrgMenuOpen((o) => !o)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
            >
              <span className="truncate max-w-[160px]">{organization?.name || 'Workspace'}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {orgMenuOpen && (
              <div className="absolute mt-2 w-64 card p-1.5 shadow-popover animate-slideUp z-40">
                {organizations.map((org) => (
                  <button
                    key={org._id}
                    onClick={() => {
                      switchOrganization(org._id);
                      setOrgMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                  >
                    <span className="truncate">{org.name}</span>
                    {organization?._id === org._id && <Check size={14} className="text-brand-500 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button onClick={() => setUserMenuOpen((o) => !o)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Avatar name={user?.name} color={user?.avatarColor} size="sm" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 card p-1.5 shadow-popover animate-slideUp z-40">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <UserIcon size={15} /> Profile settings
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
