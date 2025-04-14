
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useAuth0Bridge } from "@/contexts/auth0-context";

interface AuthGuardProps {
  requiredRole?: "admin" | "user";
}

export const AuthGuard = ({ requiredRole }: AuthGuardProps) => {
  const { state } = useAuth();
  const { isLoading: auth0Loading } = useAuth0Bridge();
  const location = useLocation();
  
  // If still loading Auth0, show nothing (or could add a loading spinner)
  if (auth0Loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accentGreen-600"></div>
    </div>;
  }
  
  // Check if the user is authenticated
  if (!state.isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If a specific role is required, check if the user has that role
  if (requiredRole && state.user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = state.user?.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }
  
  // User is authenticated and has the required role, allow access
  return <Outlet />;
};
