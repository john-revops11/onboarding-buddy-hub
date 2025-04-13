import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { AuthAction } from "./types";

export const useAuthService = (dispatch: React.Dispatch<AuthAction>) => {
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_REQUEST" });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      // The onAuthStateChange handler will update the user state
      return data;
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Invalid login credentials",
      });
      
      throw error;
    }
  }, [dispatch]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    dispatch({ type: "REGISTER_REQUEST" });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Your account has been created and is pending admin approval.",
      });
      
      // For registration, we don't automatically log in the user since they need approval
      dispatch({ type: "LOGOUT" });
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      
      dispatch({
        type: "REGISTER_FAILURE",
        payload: error.message || "An error occurred during registration",
      });
      
      throw error;
    }
  }, [dispatch]);

  const approveUser = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: 'approved' })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "User approved",
        description: "The user can now log in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  }, []);

  const rejectUser = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "User rejected",
        description: "The user's registration has been rejected.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  }, []);

  const getAllUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      return data.map((profile): User => ({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as "admin" | "user",
        createdAt: profile.created_at,
        avatar: profile.avatar_url,
        status: profile.status as "pending" | "approved" | "rejected"
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      dispatch({ type: "LOGOUT" });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    clearError,
    approveUser,
    rejectUser,
    getAllUsers
  };
};
