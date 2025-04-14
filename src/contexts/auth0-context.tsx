
import React, { createContext, useContext, useEffect } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

// Auth0 wrapper component
export const Auth0ProviderWithNavigate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const domain = "YOUR_AUTH0_DOMAIN"; // Replace with your Auth0 domain
  const clientId = "YOUR_AUTH0_CLIENT_ID"; // Replace with your Auth0 client ID
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || "/dashboard");
  };

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
    
    // Check if user exists in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', auth0User.email)
      .maybeSingle();
    
    if (profile) {
      // User exists, return existing profile
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
          role: 'user', // Default role
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
