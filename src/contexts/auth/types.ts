
import { User } from "@/types/auth";
import { Session, User as SupabaseUser, WeakPassword } from "@supabase/supabase-js";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  isLoading: boolean;
  token?: string | null; // Made token optional to match both implementations
}

// Action types for the reducer
export type AuthAction =
  | { type: "LOGIN_REQUEST" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "REGISTER_REQUEST" }
  | { type: "REGISTER_SUCCESS"; payload: { user: User; token: string } }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

export interface AuthContextType {
  state: AuthState;
  login: (credentials: { email: string; password: string }) => Promise<any>; // Using 'any' to accommodate both return types
  logout: () => void;
  getAllUsers: () => Promise<any[]>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  clearError: () => void;
}
