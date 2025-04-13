
import React, { createContext, useContext } from "react";
import { AuthContextType, AuthState } from "./auth/types";

// Create a mock authenticated state with admin role
const mockAuthState: AuthState = {
  user: {
    id: "temp-user-id",
    email: "admin@example.com",
    name: "Temporary Admin",
    role: "admin",
    avatar: null,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  token: "mock-token",
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Mock auth services
const mockAuthServices = {
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  approveUser: async () => {},
  rejectUser: async () => {},
  getAllUsers: async () => { return [] },
};

// Auth Provider component - temporarily mocked
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        state: mockAuthState,
        ...mockAuthServices
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
