
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from './contexts/auth-context';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import OnboardingPage from './pages/dashboard/OnboardingPage';
import DataUploadsPage from './pages/dashboard/DataUploadsPage';
import KnowledgeHubPage from './pages/dashboard/KnowledgeHubPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOnboardingPage from './pages/admin/onboarding/AdminOnboardingPage';
import WelcomePage from "./pages/dashboard/WelcomePage";
import InsightsPage from './pages/dashboard/InsightsPage';
import OpportunitiesPage from './pages/dashboard/OpportunitiesPage';

// AuthGuard component
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
    }
  }, [state.isAuthenticated, navigate]);

  return <>{children}</>;
};

// RoleGuard component
const RoleGuard: React.FC<{
  children: React.ReactNode;
  requiredRole: string;
}> = ({ children, requiredRole }) => {
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user?.role !== requiredRole) {
      navigate('/unauthorized');
    }
  }, [state.user?.role, requiredRole, navigate]);

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/onboarding"
          element={
            <AuthGuard>
              <OnboardingPage />
            </AuthGuard>
          }
        />
        <Route
          path="/data-uploads"
          element={
            <AuthGuard>
              <DataUploadsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/knowledge-hub"
          element={
            <AuthGuard>
              <KnowledgeHubPage />
            </AuthGuard>
          }
        />
        <Route
          path="/insights"
          element={
            <AuthGuard>
              <InsightsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/opportunities"
          element={
            <AuthGuard>
              <OpportunitiesPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <RoleGuard requiredRole="admin">
                <AdminDashboard />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/admin/onboarding"
          element={
            <AuthGuard>
              <RoleGuard requiredRole="admin">
                <AdminOnboardingPage />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/welcome"
          element={
            <AuthGuard>
              <WelcomePage />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
