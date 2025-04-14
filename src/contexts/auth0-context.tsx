
import React, { createContext, useContext, useEffect } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/auth";

// Auth0 wrapper component
export const Auth0ProviderWithNavigate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  // Get Auth0 credentials from environment variables
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-yn0u8awz8ljn8d2a.us.auth0.com";
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "wHXdj4cYZq2MYBKmxHqfZaIq2wyxtXrO";
  
  // Use the current URL's origin as the redirect URI base
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || "/dashboard");
  };

  if (!domain || !clientId) {
    console.error("Missing Auth0 configuration. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables.");
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email"
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
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
          
          // Map Auth0 user to our User type
          setUser({
            id: auth0User.sub || '',
            email: auth0User.email || '',
            name: auth0User.name || '',
            role: auth0User['https://my-app.com/roles']?.includes('admin') ? 'admin' : 'user',
            createdAt: new Date().toISOString(),
            avatar: auth0User.picture,
            status: 'approved'
          });
        } catch (error) {
          console.error("Error getting token", error);
        }
      }
    };

    getToken();
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);

  const loginWithAuth0 = () => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
        scope: "openid profile email"
      }
    });
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
    logoutWithAuth0
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
