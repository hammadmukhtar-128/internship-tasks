import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import AssignmentList from './pages/assignments/AssignmentList';
import QuizList from './pages/quizzes/QuizList';
import QuizAttempt from './pages/quizzes/QuizAttempt';
import NotificationList from './pages/notifications/NotificationList';
import CertificateList from './pages/certificates/CertificateList';
import UserList from './pages/users/UserList';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';
import { PageLoader } from './components/Loader';

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: '10px', fontSize: '14px' },
            success: { iconTheme: { primary: '#5642d6', secondary: '#fff' } }
          }}
        />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/assignments" element={<AssignmentList />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:id/attempt" element={<QuizAttempt />} />
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/certificates" element={<CertificateList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<ProtectedRoute roles={['admin']}><UserList /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
