import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import Index from "./pages";
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
import { createContext } from "react";
import type { User } from "./types/auth";

const AuthContext = createContext<{
  state: {
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
    isLoading: boolean;
  };
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  getAllUsers: () => Promise<any[]>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  clearError: () => void;
}>({
  state: {
    isAuthenticated: false,
    user: null,
    error: null,
    isLoading: false,
  },
  login: async () => {},
  logout: () => {},
  getAllUsers: async () => [],
  approveUser: async () => {},
  rejectUser: async () => {},
  clearError: () => {},
});

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    isAuthenticated: false,
    user: null,
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem(siteConfig.localStorageKey);
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setState({
        ...state,
        isAuthenticated: authData.isAuthenticated,
        user: authData.user,
      });
    }
  }, []);

  const login = async (credentials: any) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: credentials.email,
        role: credentials.email === "admin@example.com" ? "admin" : "user",
        status: "approved",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        siteConfig.localStorageKey,
        JSON.stringify({ isAuthenticated: true, user: mockUser })
      );
      setState({
        ...state,
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
      });
    } catch (error: any) {
      setState({ ...state, error: error.message, isLoading: false });
    }
  };

  const logout = () => {
    localStorage.removeItem(siteConfig.localStorageKey);
    setState({ ...state, isAuthenticated: false, user: null });
  };

  const getAllUsers = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUsers = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        status: "approved",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        status: "approved",
        createdAt: new Date().toISOString(),
      },
    ];
    return mockUsers;
  };

  const approveUser = async (userId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`User ${userId} approved`);
  };

  const rejectUser = async (userId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`User ${userId} rejected`);
  };

  const clearError = () => {
    setState({ ...state, error: null });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        getAllUsers,
        approveUser,
        rejectUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
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

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
