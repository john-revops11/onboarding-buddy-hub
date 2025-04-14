
import React, { createContext, useContext } from "react";
import { AuthContextType } from "./auth/types";
import { useAuth0Bridge } from "./auth0-context";

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth0Bridge = useAuth0Bridge();

  // Create a merged context with Auth0 functionality
  const contextValue: AuthContextType = {
    state: {
      isLoading: auth0Bridge.isLoading,
      isAuthenticated: auth0Bridge.isAuthenticated,
      user: auth0Bridge.user,
      token: auth0Bridge.token,
      error: auth0Bridge.error
    },
    login: async () => {
      auth0Bridge.loginWithAuth0();
      return { user: null, session: null };
    },
    logout: () => {
      auth0Bridge.logoutWithAuth0();
    },
    register: async () => {
      throw new Error("Registration is handled through Auth0");
    },
    clearError: () => {},
    approveUser: async () => {
      throw new Error("User approval is handled through Auth0");
    },
    rejectUser: async () => {
      throw new Error("User rejection is handled through Auth0");
    },
    getAllUsers: async () => {
      return [];
    }
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
