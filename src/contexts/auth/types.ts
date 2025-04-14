
import { User } from "@/types/auth";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  isLoading: boolean;
}

export interface AuthContextType {
  state: AuthState;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  getAllUsers: () => Promise<any[]>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  clearError: () => void;
}
