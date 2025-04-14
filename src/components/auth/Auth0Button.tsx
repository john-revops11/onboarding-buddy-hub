
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth0Bridge } from "@/contexts/auth0-context";
import { Icons } from "@/components/icons";

export const Auth0Button = () => {
  const { loginWithAuth0, isLoading } = useAuth0Bridge();

  return (
    <Button
      type="button"
      className="w-full h-11 bg-accentGreen-600 hover:bg-accentGreen-700"
      disabled={isLoading}
      onClick={() => loginWithAuth0()}
    >
      {isLoading ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Login with Auth0"
      )}
    </Button>
  );
};
