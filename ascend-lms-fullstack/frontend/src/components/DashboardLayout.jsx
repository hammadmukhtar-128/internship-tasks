import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const titleMap = {
  '/dashboard': 'Dashboard',
  '/courses': 'Courses',
  '/assignments': 'Assignments',
  '/quizzes': 'Quizzes',
  '/notifications': 'Notifications',
  '/certificates': 'Certificates',
  '/users': 'Users',
  '/profile': 'My Profile'
};

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const base = '/' + location.pathname.split('/')[1];
  const title = titleMap[base] || 'Ascend LMS';

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
