
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContextType, AuthState } from "./auth/types";
import { authReducer, initialState } from "./auth/auth-reducer";
import { useAuthService } from "./auth/auth-hooks";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types/auth";

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const authServices = useAuthService(dispatch);

  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Get the user profile when authenticated
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          // Convert Supabase user to our app User type
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.user_metadata?.name || 'User',
            role: profile?.role as "admin" | "user",
            avatar: profile?.avatar_url,
            status: profile?.status as "pending" | "approved" | "rejected",
            createdAt: profile?.created_at || session.user.created_at,
            onboardingStatus: profile?.onboarding_status
          };

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user,
              token: session.access_token
            }
          });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        dispatch({ type: "LOGOUT" });
        return;
      }

      // Get user profile data
      setTimeout(async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        // Convert Supabase user to our app User type
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.name || session.user.user_metadata?.name || 'User',
          role: profile?.role as "admin" | "user",
          avatar: profile?.avatar_url,
          status: profile?.status as "pending" | "approved" | "rejected",
          createdAt: profile?.created_at || session.user.created_at,
          onboardingStatus: profile?.onboarding_status
        };

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            token: session.access_token
          }
        });
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        ...authServices
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
