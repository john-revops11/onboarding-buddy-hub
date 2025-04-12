
import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  requiredRole?: "admin" | "user";
}

export const AuthGuard = ({ requiredRole }: AuthGuardProps) => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine if the current path is in admin section
  const isAdminPath = currentPath.startsWith("/admin");
  // Determine if the current path is in user section
  const isUserPath = !isAdminPath && currentPath !== "/login" && 
                    currentPath !== "/register" && currentPath !== "/forgot-password" && 
                    currentPath !== "/reset-password" && currentPath !== "/verify" &&
                    currentPath !== "/client-registration";

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!state.isLoading && !state.isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // If authenticated but on the wrong path based on role
    if (!state.isLoading && state.isAuthenticated && state.user) {
      const userRole = state.user.role;
      
      // Admin trying to access user-only pages
      if (userRole === "admin" && isUserPath) {
        navigate("/admin", { replace: true });
        return;
      }
      
      // User trying to access admin-only pages
      if (userRole === "user" && isAdminPath) {
        navigate("/dashboard", { replace: true });
        return;
      }
      
      // If role is required and user doesn't have it
      if (requiredRole && userRole !== requiredRole) {
        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return;
      }
    }
  }, [
    state.isLoading, 
    state.isAuthenticated, 
    state.user, 
    navigate, 
    requiredRole, 
    isAdminPath, 
    isUserPath
  ]);

  // Show loading state while checking authentication
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication check is complete and user is authenticated
  if (!state.isLoading && state.isAuthenticated) {
    // If user role matches the required role, or if no role is required
    if (!requiredRole || state.user?.role === requiredRole) {
      return <Outlet />;
    }
  }

  // This should not be reached due to the useEffect redirects,
  // but it's a fallback to avoid returning null
  return null;
};
