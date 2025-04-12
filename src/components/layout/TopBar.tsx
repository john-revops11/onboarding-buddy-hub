
import React, { useState } from "react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/layout/sidebar/UserMenu";
import { useAuth } from "@/contexts/auth-context";
import { SearchBar } from "@/components/layout/sidebar/SearchBar";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu"; 

export const TopBar = () => {
  const { state } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="h-16 sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b flex items-center justify-between px-6 lg:px-8">
      <SearchBar 
        showSearchIconOnly 
        onSearchOpen={setIsSearchOpen} 
        searchOpen={isSearchOpen} 
      />
      <div className="flex items-center gap-2">
        <NotificationsMenu />
        <ModeToggle />
        <UserButton user={state.user} />
      </div>
    </div>
  );
};
