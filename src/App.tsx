
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import Index from "./pages/index"; // Fixed casing to match the actual file
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyPage from "./pages/auth/VerifyPage";
import ClientRegistrationPage from "./pages/auth/ClientRegistrationPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminClients from "./pages/admin/AdminClients";
import AdminOnboardingPage from "./pages/admin/onboarding/AdminOnboardingPage";
import OnboardingPage from "./pages/dashboard/OnboardingPage";
import ClientDetailsPage from "./pages/admin/ClientDetailsPage";
import RegisterInvitedUser from "./pages/auth/RegisterInvitedUser";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import type { User } from "./types/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { state } = useAuth();
  const location = useLocation();

  const ProtectedRoute = ({
    children,
    requiredRole,
  }: {
    children: React.ReactNode;
    requiredRole?: string;
  }) => {
    if (!state.isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && state.user?.role !== requiredRole) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return <>{children}</>;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterInvitedUser />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/auth/register-client" element={<ClientRegistrationPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminClients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients/:clientId"
          element={
            <ProtectedRoute requiredRole="admin">
              <ClientDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/onboarding"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOnboardingPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
