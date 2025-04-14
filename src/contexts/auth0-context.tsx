
import React, { createContext, useContext, useEffect } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

// Auth0 wrapper component
export const Auth0ProviderWithNavigate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  // Replace these values with your actual Auth0 credentials
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || "YOUR_AUTH0_DOMAIN"; 
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "YOUR_AUTH0_CLIENT_ID";
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || "/dashboard");
  };

  if (!domain || domain === "YOUR_AUTH0_DOMAIN" || !clientId || clientId === "YOUR_AUTH0_CLIENT_ID") {
    console.warn("Auth0 is not properly configured. Please set the VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables.");
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

// Context to bridge Auth0 with our existing auth context
interface Auth0ContextInterface {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
  loginWithAuth0: () => void;
  logoutWithAuth0: () => void;
  syncUserWithSupabase: (auth0User: any) => Promise<User>;
}

const Auth0BridgeContext = createContext<Auth0ContextInterface | null>(null);

export const Auth0BridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    isAuthenticated, 
    isLoading, 
    user: auth0User, 
    getAccessTokenSilently, 
    loginWithRedirect, 
    logout,
    error
  } = useAuth0();
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);

  // Get token when authenticated
  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && auth0User) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
          
          // Sync Auth0 user with Supabase profile
          const syncedUser = await syncUserWithSupabase(auth0User);
          setUser(syncedUser);
        } catch (error) {
          console.error("Error getting token", error);
        }
      }
    };

    getToken();
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);

  const syncUserWithSupabase = async (auth0User: any): Promise<User> => {
    if (!auth0User) throw new Error("No Auth0 user to sync");
    
    try {
      // Check if user exists in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', auth0User.email)
        .maybeSingle();
      
      // Map Auth0 roles to our application roles
      let appRole: "admin" | "user" = "user";
      
      // Check Auth0 roles and map to application roles
      // This assumes you've set up the Auth0 roles as described below
      if (auth0User[`${domain}/roles`] && 
          Array.isArray(auth0User[`${domain}/roles`])) {
        const auth0Roles = auth0User[`${domain}/roles`];
        if (auth0Roles.includes('admin_account')) {
          appRole = "admin";
        } else if (auth0Roles.includes('client_account')) {
          appRole = "user";
        }
      }
      
      if (profile) {
        // User exists, update if needed and return existing profile
        // You may want to update the profile with Auth0 information here
        return {
          id: profile.id,
          email: profile.email,
          name: profile.name || auth0User.name,
          role: profile.role as "admin" | "user",
          avatar: profile.avatar_url || auth0User.picture,
          status: profile.status as "pending" | "approved" | "rejected",
          createdAt: profile.created_at,
          onboardingStatus: profile.onboarding_status
        };
      } else {
        // Create new profile
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert({
            id: auth0User.sub, // Use Auth0 user ID as profile ID
            email: auth0User.email,
            name: auth0User.name,
            role: appRole, // Assign mapped role from Auth0
            avatar_url: auth0User.picture,
            status: 'pending' // New users need approval
          })
          .select('*')
          .single();
        
        if (error) throw error;
        
        return {
          id: newProfile.id,
          email: newProfile.email,
          name: newProfile.name,
          role: newProfile.role as "admin" | "user",
          avatar: newProfile.avatar_url,
          status: newProfile.status as "pending" | "approved" | "rejected",
          createdAt: newProfile.created_at,
          onboardingStatus: newProfile.onboarding_status
        };
      }
    } catch (error) {
      console.error("Error syncing user with Supabase:", error);
      toast({
        title: "Error",
        description: "Failed to sync user profile. Please contact support.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const loginWithAuth0 = () => {
    loginWithRedirect();
  };

  const logoutWithAuth0 = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    setUser(null);
    setToken(null);
  };

  const contextValue: Auth0ContextInterface = {
    isAuthenticated,
    isLoading,
    user,
    token,
    error: error?.message || null,
    loginWithAuth0,
    logoutWithAuth0,
    syncUserWithSupabase
  };

  return (
    <Auth0BridgeContext.Provider value={contextValue}>
      {children}
    </Auth0BridgeContext.Provider>
  );
};

export const useAuth0Bridge = () => {
  const context = useContext(Auth0BridgeContext);
  if (!context) {
    throw new Error("useAuth0Bridge must be used within an Auth0BridgeProvider");
  }
  return context;
};
