import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import TeamOverviewPage from './pages/TeamOverviewPage';
import ChannelPage from './pages/ChannelPage';
import TeamSettingsPage from './pages/TeamSettingsPage';
import ProfilePage from './pages/ProfilePage';
import InviteAcceptPage from './pages/InviteAcceptPage';
import NotFound from './pages/NotFound';

import AdminLayout from './pages/admin/AdminLayout';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTeams from './pages/admin/AdminTeams';
import AdminActivityLogs from './pages/admin/AdminActivityLogs';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-white dark:!bg-slate-800 !text-slate-700 dark:!text-slate-100 !shadow-lg !rounded-xl',
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/invite/:token"
          element={
            <ProtectedRoute>
              <InviteAcceptPage />
            </ProtectedRoute>
          }
        />

        {/* Protected app shell */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teams/:teamId" element={<TeamOverviewPage />} />
          <Route path="/teams/:teamId/channels/:channelId" element={<ChannelPage />} />
          <Route path="/teams/:teamId/settings" element={<TeamSettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminAnalytics />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="activity" element={<AdminActivityLogs />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
