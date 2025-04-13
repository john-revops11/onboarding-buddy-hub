
import { Outlet } from "react-router-dom";

interface AuthGuardProps {
  requiredRole?: "admin" | "user";
}

export const AuthGuard = ({ requiredRole }: AuthGuardProps) => {
  // Temporarily bypass authentication checks and allow all access
  return <Outlet />;
};
