
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, AuthState } from "./auth/types";
import { authReducer, initialState } from "./auth/auth-reducer";
import { useAuthService } from "./auth/auth-hooks";

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Initialize auth services
  const {
    login,
    register,
    logout,
    clearError,
    approveUser,
    rejectUser,
    getAllUsers
  } = useAuthService(dispatch);

  // Subscribe to auth changes
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Get user data from session
          const userData = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata.name || "",
            role: session.user.user_metadata.role || "user",
            avatar: session.user.user_metadata.avatar_url || null,
            status: "approved",  // Default for logged in users
            createdAt: session.user.created_at,
          };

          // Update state with authenticated user
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: userData,
              token: session.access_token,
            },
          });
        } else if (event === "SIGNED_OUT") {
          // Clear authentication state
          dispatch({ type: "LOGOUT" });
        }
      }
    );

    // Check for existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const userData = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata.name || "",
          role: session.user.user_metadata.role || "user",
          avatar: session.user.user_metadata.avatar_url || null,
          status: "approved",  // Default for logged in users
          createdAt: session.user.created_at,
        };

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: userData,
            token: session.access_token,
          },
        });
      } else {
        // Update loading state even if no session exists
        dispatch({ type: "LOGOUT" });
      }
    };

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        clearError,
        approveUser,
        rejectUser,
        getAllUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
