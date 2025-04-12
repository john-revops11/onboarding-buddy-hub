
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  collapsed?: boolean;
}

export function LogoutButton({ collapsed = false }: LogoutButtonProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (collapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="w-full justify-center text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
        title="Log out"
      >
        <LogOut size={22} />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="w-full justify-start text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  );
}
