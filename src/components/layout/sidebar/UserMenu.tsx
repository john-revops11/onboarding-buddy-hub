
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

export function UserMenu() {
  const { state } = useAuth();
  const user = state.user;
  
  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:block">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <Avatar>
        <AvatarImage src={user?.avatar} />
        <AvatarFallback>
          {user?.name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
