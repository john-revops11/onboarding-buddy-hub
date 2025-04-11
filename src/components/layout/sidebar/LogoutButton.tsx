
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Button 
      variant="ghost" 
      className="flex w-full items-center gap-3 justify-start px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground" 
      onClick={handleLogout}
    >
      <LogOut size={18} />
      <span>Logout</span>
    </Button>
  );
}
