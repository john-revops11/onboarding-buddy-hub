
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { SearchBar } from "./SearchBar";
import { LogoutButton } from "./LogoutButton";
import { ToolsSection } from "./ToolsSection";
import { SidebarNavGroup } from "./SidebarNavGroup";
import { adminNavGroups, userNavGroups, IconComponentMap } from "./SidebarNavData";

export function MobileSidebar({ onNavItemClick }: { onNavItemClick: () => void }) {
  const { state } = useAuth();
  const location = useLocation();
  const isAdmin = state.user?.role === "admin";
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // Use the appropriate navigation groups based on user role
  const navGroups = isAdmin ? adminNavGroups : userNavGroups;

  const handleNavClick = (path: string) => {
    navigate(path);
    onNavItemClick(); // Close mobile sidebar after navigation
  };

  return (
    <div className="min-w-full h-full flex flex-col">
      <div className="p-4">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/lovable-uploads/78ce9c1d-4a0e-48f9-b47b-d2ed2bacdbe5.png"
            alt="Revify Logo"
            className="h-16 w-auto"
          />
          <span className="font-bold text-lg mt-2 text-primary-700">Revify</span>
        </div>
        
        <SearchBar />
        
        <div className="mt-4 overflow-y-auto">
          {navGroups.map((group, index) => (
            <SidebarNavGroup
              key={index}
              title={group.title}
              items={group.items.map(item => ({
                name: item.title,
                path: item.href,
                icon: IconComponentMap[item.icon as keyof typeof IconComponentMap],
                onClick: () => handleNavClick(item.href)
              }))}
              currentPath={currentPath}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <ToolsSection />
        
        <div className="mt-3">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
