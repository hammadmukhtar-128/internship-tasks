import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ProtectedRoute, PublicOnlyRoute } from './components/common/RouteGuards';
import AppLayout from './layouts/AppLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Board from './pages/Board';
import TaskDetail from './pages/TaskDetail';
import SprintPlanner from './pages/SprintPlanner';
import TeamSettings from './pages/TeamSettings';
import Admin from './pages/Admin';
import AcceptInvite from './pages/AcceptInvite';

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { fontSize: '14px' } }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/accept-invite/:token" element={<AcceptInvite />} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<Board />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/sprints" element={<SprintPlanner />} />
          <Route path="/team" element={<TeamSettings />} />
          <Route path="/settings" element={<Admin />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
