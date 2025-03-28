import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthState, User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

// Mock API for now (to be replaced with real API)
const mockUsers: (Omit<User, 'password'> & { password: string })[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin" as const,
    password: "admin123", // In a real app, these should be hashed
    createdAt: new Date().toISOString(),
    status: "approved" as const,
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Test User",
    role: "user" as const,
    password: "user123",
    createdAt: new Date().toISOString(),
    status: "approved" as const,
  },
];

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: "LOGIN_REQUEST" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "REGISTER_REQUEST" }
  | { type: "REGISTER_SUCCESS"; payload: { user: User; token: string } }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "REGISTER_REQUEST":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
type AuthContextType = {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  getAllUsers: () => (typeof mockUsers);
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for saved token when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem("onboard-token");
        const savedUser = localStorage.getItem("onboard-user");
        
        if (savedToken && savedUser) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: JSON.parse(savedUser),
              token: savedToken,
            },
          });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        dispatch({ type: "LOGOUT" });
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_REQUEST" });
    
    try {
      // Mock API call (to be replaced with real API)
      const user = mockUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        throw new Error("Invalid email or password");
      }

      if (user.status === "pending") {
        throw new Error("Your account is pending approval from an administrator");
      }

      if (user.status === "rejected") {
        throw new Error("Your registration has been rejected. Please contact support.");
      }

      // Generate a mock token
      const token = `mock-token-${Date.now()}`;
      
      // Remove password from user object
      const { password, ...secureUser } = user;
      
      // Save to localStorage (in a real app, tokens should be HttpOnly cookies)
      localStorage.setItem("onboard-token", token);
      localStorage.setItem("onboard-user", JSON.stringify(secureUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${secureUser.name}!`,
      });
      
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: secureUser,
          token,
        },
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "An error occurred during login",
      });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: "REGISTER_REQUEST" });
    
    try {
      // Check if user already exists
      if (mockUsers.some((u) => u.email === credentials.email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user with pending status
      const newUser = {
        id: `${mockUsers.length + 1}`,
        email: credentials.email,
        name: credentials.name,
        role: "user" as const,
        password: credentials.password, // In a real app, this should be hashed
        createdAt: new Date().toISOString(),
        status: "pending" as const,
      };
      
      mockUsers.push(newUser);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created and is pending admin approval.",
      });
      
      // For registration, we don't automatically log in the user since they need approval
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: {
          user: { ...newUser, password: undefined } as unknown as User,
          token: "",
        },
      });
      
      // Immediately log them out since they need approval
      logout();
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
    }
  };

  const approveUser = (userId: string) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      mockUsers[userIndex].status = "approved";
      
      toast({
        title: "User approved",
        description: `${mockUsers[userIndex].name} can now log in.`,
      });
    }
  };

  const rejectUser = (userId: string) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      mockUsers[userIndex].status = "rejected";
      
      toast({
        title: "User rejected",
        description: `${mockUsers[userIndex].name}'s registration has been rejected.`,
      });
    }
  };

  const getAllUsers = () => {
    return mockUsers;
  };

  const logout = () => {
    localStorage.removeItem("onboard-token");
    localStorage.removeItem("onboard-user");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

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
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
