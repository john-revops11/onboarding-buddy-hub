
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { authReducer, initialState } from "./auth/auth-reducer";
import { AuthContextType } from "./auth/types";
import { useAuthService } from "./auth/auth-hooks";
import { toast } from "@/hooks/use-toast";
import type { User } from "@/types/auth";

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const authService = useAuthService(dispatch);

  // Set up auth state listener
  useEffect(() => {
    // Subscribe to auth state changes and update accordingly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // We use setTimeout to prevent deadlocks
          setTimeout(async () => {
            try {
              // Get user profile from the profiles table
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profileError) throw profileError;

              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: profileData.name || session.user.email?.split('@')[0] || 'User',
                role: profileData.role as 'admin' | 'user',
                createdAt: profileData.created_at,
                avatar: profileData.avatar_url,
                status: profileData.status as 'pending' | 'approved' | 'rejected',
                onboardingStatus: profileData.onboarding_status
              };

              dispatch({
                type: "LOGIN_SUCCESS",
                payload: {
                  user: userData,
                  token: session.access_token,
                },
              });
            } catch (error) {
              console.error("Error fetching user profile:", error);
              
              // If profile fetch fails, still log user in with basic info
              const userData: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || 'User',
                role: 'user',
                createdAt: new Date().toISOString(),
                status: 'approved'
              };
              
              dispatch({
                type: "LOGIN_SUCCESS",
                payload: {
                  user: userData,
                  token: session.access_token,
                },
              });
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: "LOGOUT" });
        }
      }
    );

    // Check for existing session on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // We use setTimeout to prevent deadlocks
        setTimeout(async () => {
          try {
            // Get user profile
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) throw profileError;

            const userData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profileData.name || session.user.email?.split('@')[0] || 'User',
              role: profileData.role as 'admin' | 'user',
              createdAt: profileData.created_at,
              avatar: profileData.avatar_url,
              status: profileData.status as 'pending' | 'approved' | 'rejected',
              onboardingStatus: profileData.onboarding_status
            };

            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                user: userData,
                token: session.access_token,
              },
            });
          } catch (error) {
            console.error("Error fetching user profile:", error);
            dispatch({ type: "LOGOUT" });
          } finally {
            // Set loading to false no matter what
            if (state.isLoading) {
              dispatch({ type: "LOGIN_FAILURE", payload: "" });
            }
          }
        }, 0);
      } else {
        // No session found, set loading to false
        if (state.isLoading) {
          dispatch({ type: "LOGIN_FAILURE", payload: "" });
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Create context value object
  const contextValue: AuthContextType = {
    state,
    ...authService
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
