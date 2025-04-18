
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: string;
  avatar?: string;
  status: "pending" | "approved" | "rejected";
  onboardingStatus?: number | string;
  platformTier?: string;
  fullName?: string;
  supportUrl?: string;
  kbUrl?: string;
  meetingUrl?: string;
  // Add these to appease TypeScript when converting from Supabase User
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
  aud?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
