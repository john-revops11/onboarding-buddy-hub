
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth-context";
import { AuthContextType } from "@/contexts/auth/types";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
