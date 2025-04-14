import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContextType, AuthState } from "./auth/types";
import { authReducer, initialState } from "./auth/auth-reducer";
import { useAuthService } from "./auth/auth-hooks";
import { useAuth0Bridge } from "./auth0-context";
import { User } from "@/types/auth";

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const authServices = useAuthService(dispatch);
  const auth0Bridge = useAuth0Bridge();

  useEffect(() => {
    // Initialize with Auth0 state if authenticated
    if (auth0Bridge.isAuthenticated && auth0Bridge.user) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: auth0Bridge.user,
          token: auth0Bridge.token || ""
        }
      });
    } else if (!auth0Bridge.isLoading) {
      // If not loading and not authenticated, ensure user is logged out
      dispatch({ type: "LOGOUT" });
    }
  }, [auth0Bridge.isAuthenticated, auth0Bridge.user, auth0Bridge.token, auth0Bridge.isLoading]);

  // Create a merged context with both original auth services and Auth0 functions
  const mergedContext: AuthContextType = {
    ...authServices,
    state: {
      ...state,
      // Override state with Auth0 values when authenticated through Auth0
      isLoading: auth0Bridge.isLoading || state.isLoading,
      isAuthenticated: auth0Bridge.isAuthenticated || state.isAuthenticated,
      user: auth0Bridge.user || state.user,
      token: auth0Bridge.token || state.token,
      error: auth0Bridge.error || state.error
    },
    // Override login method to use Auth0
    login: async (credentials) => {
      try {
        // If using email/password, try to use the original login
        if (credentials.email && credentials.password) {
          return await authServices.login(credentials);
        } else {
          // Otherwise use Auth0 login
          auth0Bridge.loginWithAuth0();
          return { user: null, session: null };
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    // Override logout method to use Auth0
    logout: () => {
      authServices.logout();
      auth0Bridge.logoutWithAuth0();
    }
  };

  return (
    <AuthContext.Provider value={mergedContext}>
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
