
import React from "react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface TopBarProps {
  showMobileMenu?: boolean;
  onMobileMenuClick?: () => void;
}

export const TopBar = ({ showMobileMenu = false, onMobileMenuClick }: TopBarProps) => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const user = state.user;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <div className="h-16 sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-6">
      {/* Left side - Mobile menu button */}
      <div className="flex items-center">
        {showMobileMenu && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMobileMenuClick}
            className="mr-2 p-2 rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-accentGreen-600 focus:outline-none focus:ring-2 focus:ring-accentGreen-600/40"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </motion.button>
        )}
      </div>
      
      {/* Right side - User controls */}
      <div className="flex items-center gap-3">
        <NotificationsMenu />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-0 rounded-full hover:ring-2 hover:ring-accentGreen-600/40 focus:outline-none focus:ring-2 focus:ring-accentGreen-600/40"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
