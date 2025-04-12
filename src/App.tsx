
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";

// Pages (import statements kept as is)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ClientRegistrationPage from "./pages/auth/ClientRegistrationPage";
import VerifyPage from "./pages/auth/VerifyPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import KnowledgeHubPage from "./pages/dashboard/KnowledgeHubPage";
import OpportunitiesPage from "./pages/dashboard/OpportunitiesPage";
import DataUploadsPage from "./pages/dashboard/DataUploadsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminChecklists from "./pages/admin/AdminChecklists";
import AdminApiKeys from "./pages/admin/AdminApiKeys";
import AdminFiles from "./pages/admin/AdminFiles";
import AdminOpportunities from "./pages/admin/AdminOpportunities"; 
import ChecklistEditor from "./pages/admin/ChecklistEditor";
import AssignChecklist from "./pages/admin/AssignChecklist";
import ViewAssignedChecklist from "./pages/admin/ViewAssignedChecklist";
import OnboardingPage from "./pages/dashboard/OnboardingPage";

// New Pages for Revify Portal requirements
import InsightsPage from "./pages/dashboard/InsightsPage";
import DiagnosticReviewsPage from "./pages/dashboard/DiagnosticReviewsPage";
import AdminInsightsPage from "./pages/admin/AdminInsightsPage";
import AdminDiagnosticReviewsPage from "./pages/admin/AdminDiagnosticReviewsPage";

// Subscription and Onboarding Pages
import AdminSubscriptionsPage from "./pages/admin/subscriptions/AdminSubscriptionsPage";
import CreateSubscriptionPage from "./pages/admin/subscriptions/CreateSubscriptionPage";
import EditSubscriptionPage from "./pages/admin/subscriptions/EditSubscriptionPage";
import AdminAddonsPage from "./pages/admin/addons/AdminAddonsPage";
import CreateAddonPage from "./pages/admin/addons/CreateAddonPage";
import EditAddonPage from "./pages/admin/addons/EditAddonPage";
import AdminOnboardingPage from "./pages/admin/onboarding/AdminOnboardingPage";

// Create the QueryClient outside of the component
const queryClient = new QueryClient();

const App = () => {
  return (
    // Ensure all providers are properly nested
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/client-registration" element={<ClientRegistrationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify" element={<VerifyPage />} />

              {/* User Routes */}
              <Route element={<AuthGuard requiredRole="user" />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
                <Route path="/opportunities" element={<OpportunitiesPage />} />
                <Route path="/data-uploads" element={<DataUploadsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                
                {/* New User Routes */}
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/diagnostic-reviews" element={<DiagnosticReviewsPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AuthGuard requiredRole="admin" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/checklists" element={<AdminChecklists />} />
                <Route path="/admin/checklists/create" element={<ChecklistEditor />} />
                <Route path="/admin/checklists/edit/:id" element={<ChecklistEditor />} />
                <Route path="/admin/checklists/assign/:id" element={<AssignChecklist />} />
                <Route path="/admin/checklists/view-assignment/:id" element={<ViewAssignedChecklist />} />
                <Route path="/admin/checklists/edit-assignment/:id" element={<ViewAssignedChecklist />} />
                <Route path="/admin/api-keys" element={<AdminApiKeys />} />
                <Route path="/admin/files" element={<AdminFiles />} />
                <Route path="/admin/opportunities" element={<AdminOpportunities />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin/clients/:id" element={<AdminDashboard />} />
                
                {/* New Admin Routes */}
                <Route path="/admin/insights" element={<AdminInsightsPage />} />
                <Route path="/admin/diagnostic-reviews" element={<AdminDiagnosticReviewsPage />} />
                
                {/* Subscription and Onboarding Routes */}
                <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
                <Route path="/admin/subscriptions/create" element={<CreateSubscriptionPage />} />
                <Route path="/admin/subscriptions/edit/:id" element={<EditSubscriptionPage />} />
                <Route path="/admin/addons" element={<AdminAddonsPage />} />
                <Route path="/admin/addons/create" element={<CreateAddonPage />} />
                <Route path="/admin/addons/edit/:id" element={<EditAddonPage />} />
                <Route path="/admin/onboarding" element={<AdminOnboardingPage />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
