
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
import Index from "./pages/index"; // Using lowercase import
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyPage from "./pages/auth/VerifyPage";
import ClientRegistrationPage from "./pages/auth/ClientRegistrationPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import OnboardingPage from "./pages/dashboard/OnboardingPage";
import KnowledgeHubPage from "./pages/dashboard/KnowledgeHubPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import InsightsPage from "./pages/dashboard/InsightsPage";
import OpportunitiesPage from "./pages/dashboard/OpportunitiesPage";
import DataUploadsPage from "./pages/dashboard/DataUploadsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminClients from "./pages/admin/AdminClients";
import AdminOnboardingPage from "./pages/admin/onboarding/AdminOnboardingPage";
import AdminFilesPage from "./pages/admin/AdminFiles";
import ClientDetailsPage from "./pages/admin/ClientDetailsPage";
import RegisterInvitedUser from "./pages/auth/RegisterInvitedUser";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminOpportunitiesPage from "./pages/admin/AdminOpportunities";
import AdminChecklists from "./pages/admin/AdminChecklists";
import AdminAddonsPage from "./pages/admin/addons/AdminAddonsPage";
import AdminSubscriptionsPage from "./pages/admin/subscriptions/AdminSubscriptionsPage";
import CreateSubscriptionPage from "./pages/admin/subscriptions/CreateSubscriptionPage";
import EditSubscriptionPage from "./pages/admin/subscriptions/EditSubscriptionPage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import type { User } from "./types/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/layout/DashboardSidebar";
import { AuthGuard } from "./components/auth/auth-guard";

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
  console.log("Current route:", location.pathname);
  console.log("User authenticated:", state.isAuthenticated);
  console.log("User role:", state.user?.role);

  const ProtectedRoute = ({
    children,
    requiredRole,
  }: {
    children: React.ReactNode;
    requiredRole?: string;
  }) => {
    if (!state.isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && state.user?.role !== requiredRole) {
      console.log(`User does not have required role: ${requiredRole}, has: ${state.user?.role}`);
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return <>{children}</>;
  };

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterInvitedUser />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/auth/register-client" element={<ClientRegistrationPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* User dashboard routes - Protected and wrapped with DashboardLayout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />
        <Route path="/knowledge-hub" element={
          <ProtectedRoute>
            <KnowledgeHubPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/insights" element={
          <ProtectedRoute>
            <InsightsPage />
          </ProtectedRoute>
        } />
        <Route path="/opportunities" element={
          <ProtectedRoute>
            <OpportunitiesPage />
          </ProtectedRoute>
        } />
        <Route path="/data-uploads" element={
          <ProtectedRoute>
            <DataUploadsPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Admin routes - Protected with admin role and wrapped with DashboardLayout */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/clients" element={
          <ProtectedRoute requiredRole="admin">
            <AdminClients />
          </ProtectedRoute>
        } />
        <Route path="/admin/clients/:clientId" element={
          <ProtectedRoute requiredRole="admin">
            <ClientDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/onboarding" element={
          <ProtectedRoute requiredRole="admin">
            <AdminOnboardingPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/opportunities" element={
          <ProtectedRoute requiredRole="admin">
            <AdminOpportunitiesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/files" element={
          <ProtectedRoute requiredRole="admin">
            <AdminFilesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/checklists" element={
          <ProtectedRoute requiredRole="admin">
            <AdminChecklists />
          </ProtectedRoute>
        } />
        <Route path="/admin/subscriptions" element={
          <ProtectedRoute requiredRole="admin">
            <AdminSubscriptionsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/subscriptions/create" element={
          <ProtectedRoute requiredRole="admin">
            <CreateSubscriptionPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/subscriptions/edit/:id" element={
          <ProtectedRoute requiredRole="admin">
            <EditSubscriptionPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/addons" element={
          <ProtectedRoute requiredRole="admin">
            <AdminAddonsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute requiredRole="admin">
            <AdminSettingsPage />
          </ProtectedRoute>
        } />
        
        {/* Catch all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
