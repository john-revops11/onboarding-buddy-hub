
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth-context";
import { AuthContextType } from "@/contexts/auth/types";

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return {
    ...context,
    user: context.state.user // Extract user from state
  };
}
