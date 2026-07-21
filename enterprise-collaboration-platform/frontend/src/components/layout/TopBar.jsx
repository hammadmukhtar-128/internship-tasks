import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { messagesApi } from '../../api/messages';
import Avatar from '../common/Avatar';
import NotificationBell from './NotificationBell';

export default function TopBar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      const { data } = await messagesApi.search({ q: query });
      setResults(data.data.messages);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/60 px-5 backdrop-blur-xl dark:border-white/5 dark:bg-panel-dark/50">
      <div className="relative w-full max-w-md" ref={searchRef}>
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search messages, people, channels..."
          className="input-field pl-9"
        />
        {searchOpen && results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto glass-card animate-slide-up p-2">
            {results.map((m) => (
              <button
                key={m._id}
                onClick={() => {
                  navigate(`/teams/${m.channel?.team}/channels/${m.channel?._id}`);
                  setSearchOpen(false);
                  setQuery('');
                }}
                className="flex w-full flex-col items-start gap-0.5 rounded-lg p-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800/70"
              >
                <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
                  {m.sender?.name} in #{m.channel?.name}
                </span>
                <span className="line-clamp-1 text-sm text-slate-600 dark:text-slate-300">{m.content}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <NotificationBell />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Avatar user={user} size="sm" />
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
              {user?.name}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-52 glass-card animate-slide-up p-1.5">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name}</p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
              <hr className="my-1 border-slate-200 dark:border-slate-700" />
              <button
                onClick={() => {
                  navigate('/profile');
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Settings size={14} /> Profile settings
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
