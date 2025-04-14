
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth0Bridge } from "@/contexts/auth0-context";

export const Auth0Button = () => {
  const { loginWithAuth0, isLoading } = useAuth0Bridge();

  return (
    <Button
      type="button"
      className="w-full mt-4 bg-accentGreen-600 hover:bg-accentGreen-700"
      disabled={isLoading}
      onClick={() => loginWithAuth0()}
    >
      {isLoading ? "Connecting..." : "Login with Auth0"}
    </Button>
  );
};
