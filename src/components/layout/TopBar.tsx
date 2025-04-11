
import React, { useState } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { state } = useAuth();
  const user = state.user;
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-slate-900">
      <button 
        className="mr-4 rounded-md p-2 text-muted-foreground hover:bg-accent md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </button>
      
      <div className="w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="success" 
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
              >
                {notificationCount}
              </Badge>
            )}
          </button>
        </div>
        
        <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-80">
          <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
