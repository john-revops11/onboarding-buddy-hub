
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { LogoutButton } from "./LogoutButton";
import { ToolsSection } from "./ToolsSection";
import { CollapsibleSidebarNavGroup } from "./CollapsibleSidebarNavGroup";
import { adminNavGroups, userNavGroups, IconComponentMap } from "./SidebarNavData";
import { cn } from "@/lib/utils";

interface DesktopSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function DesktopSidebar({ collapsed, setCollapsed }: DesktopSidebarProps) {
  const { state } = useAuth();
  const location = useLocation();
  const isAdmin = state.user?.role === "admin";
  const currentPath = location.pathname;

  // Use the appropriate navigation groups based on user role
  const navGroups = isAdmin ? adminNavGroups : userNavGroups;

  return (
    <div 
      className={cn(
        "bg-sidebar flex flex-col h-full border-r transition-all duration-300 ease-in-out overflow-y-auto",
        collapsed 
          ? "w-[70px]" 
          : "min-w-[240px] max-w-[240px]"
      )}
    >
      <div className="p-4 relative">
        <div className="flex flex-col items-center mb-6">
          {collapsed ? (
            // Favicon when collapsed - using the new logo
            <img
              src="/lovable-uploads/9ab08585-112a-41c2-9706-a57751815ffb.png"
              alt="Logo"
              className="h-10 w-10"
            />
          ) : (
            // Full logo when expanded
            <img
              src="/lovable-uploads/78ce9c1d-4a0e-48f9-b47b-d2ed2bacdbe5.png"
              alt="Logo"
              className="h-16 w-auto"
            />
          )}
        </div>
        
        {/* Toggle collapse button with improved styling */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute right-2 top-4 p-1.5 rounded-full transition-all duration-300",
            collapsed 
              ? "bg-primary-100 hover:bg-primary-200 text-primary-600" 
              : "hover:bg-sidebar-accent text-sidebar-foreground"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={18} className="text-primary-600" />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
        
        {!collapsed && <SearchBar />}
        
        <div className="mb-6 overflow-y-auto">
          {navGroups.map((group, index) => (
            <CollapsibleSidebarNavGroup
              key={index}
              title={group.title}
              items={group.items.map(item => ({
                name: item.title,
                path: item.href,
                icon: IconComponentMap[item.icon as keyof typeof IconComponentMap],
              }))}
              currentPath={currentPath}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t">
        {!collapsed && <ToolsSection />}
        
        <div className="mt-3">
          <LogoutButton collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}
